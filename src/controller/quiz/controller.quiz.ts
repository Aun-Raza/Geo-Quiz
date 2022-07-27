import { isMCValid } from "../../model/quiz/validators/custom-validator.quiz";
import log from "../../log/logger";
import mongoose, { ObjectId } from "mongoose";
import { QuizModel } from "../../model/quiz/model.quiz";
import { Request, Response } from "express";
import { UserModel } from "../../model/user/model.user";
import Joi from "../../model/quiz/validators/joi-validator.quiz";
import _ from "lodash";

interface CustomRequest extends Request {
    user: { _id: ObjectId };
}

/**
 * GET METHOD(s)
 */
export async function getQuizzes(req: Request, res: Response) {
    log.info("GET /api/getQuizzes", { service: "getQuizzes" });

    const quizDocs = await QuizModel.find().populate({
        path: "owner",
        select: "username email",
    });

    if (!quizDocs.length) {
        res.status(404);
        throw new Error("no quizzes are found.");
    }

    res.json({
        data: _.pick(quizDocs, ["_id", "title", "questions", "owner"]),
    });
}

export async function getQuiz(req: Request, res: Response) {
    log.info("GET /api/getQuiz/:id", { service: "getQuiz" });

    const { id } = req.params;
    const quizDoc = await QuizModel.findById(id).populate({
        path: "owner",
        select: "username email",
    });

    if (!quizDoc) {
        res.status(404);
        throw new Error(`quizId: ${id} does not exist.`);
    }

    res.json({ data: _.pick(quizDoc, ["_id", "title", "questions", "owner"]) });
}

/**
 * POST METHOD(s)
 */

export async function createQuiz(req: CustomRequest, res: Response) {
    log.info("POST /api/createQuiz", { service: "createQuiz" });

    const quizReqBody = await Joi.validateAsync(req.body || null).catch(
        (error) => {
            res.status(400);
            throw error;
        }
    );

    const multipleChoices = quizReqBody.questions.filter(
        (question: { type: string }) => question.type === "Multiple-Choice"
    );

    if (!isMCValid(multipleChoices)) {
        res.status(400);
        throw new Error("multiple choice format is not valid");
    }

    const { _id } = req.user;
    const quizDoc = new QuizModel(Object.assign(quizReqBody, { owner: _id }));
    await quizDoc.save();

    await UserModel.findByIdAndUpdate(_id, { $push: { quizzes: quizDoc._id } });

    res.status(201).json({
        data: _.pick(quizDoc, ["_id", "title", "questions", "owner"]),
    });
}

/**
 * PUT METHOD(s)
 */

export async function updateQuiz(req: Request, res: Response) {
    log.info("PUT /api/updateQuiz/:id", { service: "updateQuiz" });

    const quizReqBody = await Joi.validateAsync(req.body || null).catch(
        (error) => {
            res.status(400);
            throw error;
        }
    );

    const { id } = req.params;
    const quizDoc = await QuizModel.findByIdAndUpdate(id, quizReqBody, {
        returnDocument: "after",
    });
    if (!quizDoc) {
        res.status(404);
        throw new Error(`quizId: ${id} does not exist.`);
    }

    res.status(201).json({
        data: _.pick(quizDoc, ["_id", "title", "questions", "owner"]),
    });
}

/**
 * DELETE METHOD(s)
 */

export async function deleteQuiz(req: CustomRequest, res: Response) {
    log.info("DELETE /api/deleteQuiz/:id", { service: "deleteQuiz" });

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

    res.json({ data: _.pick(quizDoc, ["_id", "title", "questions", "owner"]) });
}
