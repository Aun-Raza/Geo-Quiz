import app from "../../../app";
import { QuizModel } from "../../../model/quiz/model.quiz";
import mongoose from "mongoose";
import config from "config";
import request from "supertest";

// Basic App & DB Setup
beforeAll(async () => {
    await mongoose.connect(config.get("DB_URI"));
});

afterAll(async () => {
    await mongoose.connection.close();
    await app.close();
});

beforeEach(async () => {
    await QuizModel.deleteMany({});
});

// Global Variables
let apiEndPoint: string;
let reqBody: any;

// TODO: Replace this with a reusable class
const true_false = {
    name: "true and false question",
    type: "True-False",
    correctAnswer: true,
};
const multiple_choice = {
    name: "multiple choice question",
    type: "Multiple-Choice",
    answers: ["a", "b", "c", "d"],
    correctAnswer: "a",
};
const quiz = {
    title: "quiz1",
    questions: [true_false, multiple_choice],
};

async function exec() {
    return await request(app).put(apiEndPoint).send(reqBody);
}

describe("PUT /api/updateQuiz/:id", () => {
    it("should return status 400, and error property if req.param is not a ObjectID", async () => {
        apiEndPoint = "/api/updateQuiz/1";
        reqBody = { ...quiz };

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("error");
    });
    it("should return status 404, and error property if req.param is not authenticated", async () => {
        const _id = new mongoose.Types.ObjectId().toString();
        apiEndPoint = "/api/updateQuiz/" + _id;
        reqBody = { ...quiz };

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(404);
        expect(body).toHaveProperty("error");
    });
    it("should return status 400, and error property if req.body is invalid", async () => {
        const doc = new QuizModel(quiz);
        await doc.save();

        const { _id } = doc;
        apiEndPoint = "/api/updateQuiz/" + _id;
        reqBody = null;

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("error");
    });
    it("should return status 201, and data property, and be saved if req.body is valid", async () => {
        const doc = new QuizModel(quiz);
        await doc.save();

        const { _id } = doc;
        apiEndPoint = "/api/updateQuiz/" + _id;
        reqBody = { ...quiz };
        reqBody.title = "quiz 1 updated";

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(201);
        const { data } = body;
        expect(Object.keys(data)).toEqual(
            expect.arrayContaining(["title", "questions"])
        );
        expect(data.title).toEqual(reqBody.title);

        const { title } = await QuizModel.findById(_id);
        expect(title).toEqual(reqBody.title);
    });
});
