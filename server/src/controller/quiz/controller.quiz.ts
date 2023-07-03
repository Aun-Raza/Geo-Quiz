/* eslint-disable linebreak-style */
import { isMCValid } from '../../model/quiz/validators/custom-validator.quiz';
import log from '../../log/logger';
import mongoose, { ObjectId } from 'mongoose';
import { QuizModel } from '../../model/quiz/model.quiz';
import { Request, Response } from 'express';
import { UserModel } from '../../model/user/model.user';
import Joi from '../../model/quiz/validators/joi-validator.quiz';
import _ from 'lodash';

interface CustomRequest extends Request {
  user: { _id: ObjectId };
}

/**
 * GET METHOD(s)
 */
export async function getQuizzes(req: Request, res: Response) {
  log.info('GET /api/getQuizzes', { service: 'getQuizzes' });

  const quizDocs = await QuizModel.find().populate({
    path: 'owner',
    select: 'username email _id',
  });

  if (!quizDocs.length) {
    res.status(404);
    throw new Error('no quizzes are found.');
  }

  const selectedQuizDocsProps = quizDocs.map((quizDoc) => {
    return _.pick(quizDoc, ['_id', 'title', 'numQuestions', 'owner']);
  });

  res.json(selectedQuizDocsProps);
}

export async function getQuiz(req: Request, res: Response) {
  log.info('GET /api/getQuiz/:id', { service: 'getQuiz' });

  const { id } = req.params;

  const newId = new mongoose.Types.ObjectId(id);
  console.log('ID:', newId);
  const quizDoc = await QuizModel.findById(newId).populate({
    path: 'owner',
    select: 'username email _id',
  });

  if (!quizDoc) {
    res.status(404);
    throw new Error(`quizId: ${id} does not exist.`);
  }

  res.json(_.pick(quizDoc, ['_id', 'title', 'questions', 'owner']));
}

/**
 * POST METHOD(s)
 */

export async function createQuiz(req: CustomRequest, res: Response) {
  log.info('POST /api/createQuiz', { service: 'createQuiz' });

  try {
    const quizReqBody = await Joi.validateAsync(req.body || null).catch(
      (error) => {
        console.error('Error from Joi validation:', error);
        res.status(400);
        throw error;
      }
    );

    const multipleChoices = quizReqBody.questions.filter(
      (question: { type: string }) => question.type === 'Multiple-Choice'
    );

    if (!isMCValid(multipleChoices)) {
      const mcError = new Error('multiple choice format is not valid');
      console.error('Error from multiple choice validation:', mcError);
      res.status(400);
      throw mcError;
    }

    const { _id } = req.user;

    const quizDoc = new QuizModel(Object.assign(req.body, { owner: _id }));

    await quizDoc.save().catch((error) => {
      console.error('Error from saving quizDoc:', error);
      throw error;
    });

    await UserModel.findByIdAndUpdate(_id, { $push: { quizzes: quizDoc._id } });

    res
      .status(201)
      .json(_.pick(quizDoc, ['_id', 'title', 'questions', 'owner']));
  } catch (error) {
    console.error('Error thrown inside createQuiz:', error);
  }
}

/**
 * PUT METHOD(s)
 */

export async function updateQuiz(req: Request, res: Response) {
  log.info('PUT /api/updateQuiz/:id', { service: 'updateQuiz' });

  const quizReqBody = await Joi.validateAsync(req.body || null).catch(
    (error) => {
      res.status(400);
      throw error;
    }
  );

  const { id } = req.params;
  const quizDoc = await QuizModel.findByIdAndUpdate(id, quizReqBody, {
    returnDocument: 'after',
  });
  if (!quizDoc) {
    res.status(404);
    throw new Error(`quizId: ${id} does not exist.`);
  }

  res.status(201).json(_.pick(quizDoc, ['_id', 'title', 'questions', 'owner']));
}

/**
 * DELETE METHOD(s)
 */

export async function deleteQuiz(req: CustomRequest, res: Response) {
  log.info('DELETE /api/deleteQuiz/:id', { service: 'deleteQuiz' });

  const { params } = req;
  const quizDoc = await QuizModel.findByIdAndDelete(params.id);
  if (!quizDoc) {
    res.status(404);
    throw new Error(`quizId: ${params.id} does not exist`);
  }

  const userDoc = await UserModel.findById(req.user._id);
  const filter = userDoc.quizzes.filter((quizId: mongoose.Types.ObjectId) => {
    quizId !== quizDoc._id;
  });
  userDoc.quizzes = filter;
  await userDoc.save();

  res.json(_.pick(quizDoc, ['_id', 'title', 'questions', 'owner']));
}
