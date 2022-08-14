import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';
import log from '../../log/logger';
import { ObjectId } from 'mongoose';
import { QuizModel } from '../../model/quiz/model.quiz';
import { Request, Response } from 'express';
import { UserModel } from '../../model/user/model.user';
import Joi from '../../model/user/joi-validator.user';
import _ from 'lodash';

interface CustomRequest extends Request {
  user: { _id: ObjectId; username: string };
}

/* GET METHOD(s)
 */
export async function getUsers(req: Request, res: Response) {
  log.info('GET /api/getUsers', { service: 'getUsers' });

  const userDocs = await UserModel.find();
  if (!userDocs.length) {
    res.status(404);
    throw new Error('No users are found.');
  }

  const docSelectedProperties = userDocs.map((userDoc) =>
    _.pick(userDoc, ['_id', 'username', 'email', 'quizzes'])
  );

  res.json(docSelectedProperties);
}

export async function getUser(req: Request, res: Response) {
  log.info('GET /api/getUser/:id', { service: 'getUser' });

  const userDoc = await UserModel.findById(req.params.id);
  if (!userDoc) {
    res.status(404);
    throw new Error(`UserId: ${userDoc._id} does not exist.`);
  }

  res.json(_.pick(userDoc, ['_id', 'username', 'email', 'quizzes']));
}

/* POST METHOD(s)
 */

export async function registerUser(req: Request, res: Response) {
  log.info('POST /api/registerUser', { service: 'registerUser' });

  const userReqBody = await Joi.validateAsync(req.body || null).catch(
    (error) => {
      res.status(400);
      throw error;
    }
  );

  const { username, password } = userReqBody;
  let userDoc = await UserModel.findOne({ username });
  if (userDoc) {
    res.status(400);
    throw new Error('User already exist in the registration.');
  }

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);
  userDoc = new UserModel(Object.assign(userReqBody, { hash }));
  await userDoc.save();

  const payload = {
    _id: userDoc._id,
    username: userDoc.username,
    email: userDoc.email,
  };
  const token = jwt.sign(payload, config.get('JWT_PRIVATE_KEY'));

  res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .status(201)
    .json(_.pick(userDoc, ['_id', 'username', 'email', 'quizzes']));
}

export async function loginUser(req: Request, res: Response) {
  log.info('POST /api/loginUser', { service: 'loginUser' });

  const { username, password } = req.body;
  const userDoc = await UserModel.findOne({ username });
  if (!userDoc) {
    res.status(400);
    throw new Error('Username or password is invalid.');
  }

  const isCorrectPassword = await bcrypt.compare(password || '', userDoc.hash);
  if (!isCorrectPassword) {
    res.status(400);
    throw new Error('Username or password is invalid.');
  }

  const payload = {
    _id: userDoc._id,
    username: userDoc.username,
    email: userDoc.email,
  };
  const token = jwt.sign(payload, config.get('JWT_PRIVATE_KEY'));

  res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .status(200)
    .json({ msg: 'You successfully logged in.' });
}

export async function updateUser(req: CustomRequest, res: Response) {
  log.info('UPDATE /api/updateUser/:id', { service: 'updateUser' });

  const { params } = req;
  if (params.id !== req.user._id.toString()) {
    res.status(401);
    throw new Error('You are not authorized to update this user.');
  }

  const userReqBody = await Joi.validateAsync(req.body || null).catch(
    (error) => {
      res.status(400);
      throw error;
    }
  );

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(userReqBody.password, salt);
  const userDoc = await UserModel.findByIdAndUpdate(
    params.id,
    Object.assign(userReqBody, { hash })
  );
  if (!userDoc) {
    res.status(404);
    throw new Error('Cannot find targeted user in the registry.');
  }

  const payload = {
    _id: userDoc._id,
    username: userDoc.username,
    email: userDoc.email,
  };
  const token = jwt.sign(payload, config.get('JWT_PRIVATE_KEY'));

  res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .status(201)
    .json(_.pick(userDoc, ['_id', 'username', 'email', 'quizzes']));
}

// TODO: Transaction HERE
export async function deleteUser(req: CustomRequest, res: Response) {
  log.info('PUT /api/deleteUser/:id', { service: 'deleteUser' });

  const { params } = req;
  if (params.id !== req.user._id.toString()) {
    res.status(401);
    throw new Error('You are not authorized to delete this user.');
  }

  const userDoc = await UserModel.findById(params.id);
  if (!userDoc) {
    res.status(404);
    throw new Error('Cannot find targeted user in the registry');
  }

  userDoc.quizzes.map(async (quiz) => {
    await QuizModel.findByIdAndDelete(quiz);
  });
  await UserModel.deleteOne({ userDoc });

  res
    .status(201)
    .json(_.pick(userDoc, ['_id', 'username', 'email', 'quizzes']));
}
