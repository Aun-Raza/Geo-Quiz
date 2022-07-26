import { Request, Response } from "express";
import { QuizModel } from "../../model/quiz/model.quiz";
import { isMCValid } from "../../model/quiz/validators/custom-validator";
import validator from "../../model/quiz/validators/joi-validator";
import log from "../../log";
import mongoose, { ObjectId } from "mongoose";
import { UserModel } from "../../model/user/model.user";
import _ from "lodash";

interface CustomRequest extends Request {
    user: { _id: ObjectId };
}

/**
 * GET METHOD(s)
 */
export async function getQuizzes(req: Request, res: Response) {
    log.info("GET /api/getQuizzes", { service: "getQuizzes" });

    const queries = await QuizModel.find().populate({
        path: "owner",
        select: "username email",
    });

    if (!queries.length) {
        res.status(404);
        throw new Error("no quizzes are found.");
    }

    res.json({ data: _.pick(queries, ["_id", "title", "questions", "owner"]) });
}

export async function getQuiz(req: Request, res: Response) {
    log.info("GET /api/getQuiz/:id", { service: "getQuiz" });

    const query = await QuizModel.findById(req.params.id).populate({
        path: "owner",
        select: "username email",
    });

    if (!query) {
        res.status(404);
        throw new Error("no result is found");
    }

    res.json({ data: _.pick(query, ["_id", "title", "questions", "owner"]) });
}

/**
 * POST METHOD(s)
 */

export async function createQuiz(req: CustomRequest, res: Response) {
    log.info("POST /api/createQuiz", { service: "createQuiz" });

    const quiz = await validator
        .validateAsync(req.body || null)
        .catch((error) => {
            res.status(400);
            throw error;
        });

    const multipleChoices = quiz.questions.filter(
        (question: { type: string }) => question.type === "Multiple-Choice"
    );

    if (!isMCValid(multipleChoices)) {
        res.status(400);
        throw new Error("wrong choices");
    }

    quiz.owner = req.user._id.toString();

    let doc = new QuizModel(quiz);
    doc = await doc.save();

    const user = await UserModel.findById(req.user._id);
    user.quizzes.push(doc._id);
    await user.save();

    res.status(201).json({
        data: _.pick(doc, ["_id", "title", "questions", "owner"]),
    });
}

/**
 * PUT METHOD(s)
 */

export async function updateQuiz(req: Request, res: Response) {
    log.info("PUT /api/updateQuiz/:id", { service: "updateQuiz" });

    const query = await QuizModel.findById(req.params.id);
    if (!query) {
        res.status(404);
        throw new Error("quiz does not exist");
    }

    const updatedQuiz = await validator
        .validateAsync(req.body || null)
        .catch((error) => {
            res.status(400);
            throw error;
        });

    const doc = await QuizModel.findOneAndUpdate({ query }, updatedQuiz, {
        returnDocument: "after",
    });

    res.status(201).json({
        data: _.pick(doc, ["_id", "title", "questions", "owner"]),
    });
}

/**
 * DELETE METHOD(s)
 */

export async function deleteQuiz(req: CustomRequest, res: Response) {
    log.info("DELETE /api/deleteQuiz/:id", { service: "deleteQuiz" });

    const doc = await QuizModel.findByIdAndDelete(req.params.id);
    if (!doc) {
        res.status(404);
        throw new Error("quiz does not exist");
    }

    const user = await UserModel.findById(req.user._id);
    const filter = user.quizzes.filter((v: mongoose.Types.ObjectId) => {
        v !== doc._id;
    });
    user.quizzes = filter;
    await user.save();

    res.json({ data: _.pick(doc, ["_id", "title", "questions", "owner"]) });
}
