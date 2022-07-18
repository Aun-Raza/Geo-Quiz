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
const quiz = {
    title: "quiz1",
    questions: [
        {
            name: "true and false question",
            type: "True-False",
            correctAnswer: true,
        },
        {
            name: "multiple choice question",
            type: "Multiple-Choice",
            answers: ["a", "b", "c", "d"],
            correctAnswer: "a",
        },
    ],
};

async function exec() {
    return await request(app).delete(apiEndPoint);
}

describe("DELETE /api/deleteQuiz/:id", () => {
    it("should return status 400, and error property if req.param is not ObjectID", async () => {
        apiEndPoint = "/api/deleteQuiz/1";

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("error");
    });
    it("should return status 404, and error property if req.param is not authenticated", async () => {
        const _id = new mongoose.Types.ObjectId().toString();
        apiEndPoint = "/api/deleteQuiz/" + _id;

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(404);
        expect(body).toHaveProperty("error");
    });
    it("should return status 200, data property, and data to be deleted if req.param is valid", async () => {
        const doc = new QuizModel(quiz);
        await doc.save();

        const { _id } = doc;
        apiEndPoint = "/api/deleteQuiz/" + _id;

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("data");

        const res = await QuizModel.findById(_id);
        expect(res).toBeNull();
    });
});
