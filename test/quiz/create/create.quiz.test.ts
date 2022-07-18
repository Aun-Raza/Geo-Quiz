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
    return await request(app).post(apiEndPoint).send(reqBody);
}

describe("POST /api/createQuiz - BOTH", () => {
    it("should return status 400, and error property if req.body is invalid", async () => {
        apiEndPoint = "/api/createQuiz";
        reqBody = null;
        const { body, statusCode } = await exec();

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("error");
    });
    it("should return status 201, data property, and be saved if req.body is valid", async () => {
        apiEndPoint = "/api/createQuiz";
        reqBody = { ...quiz };

        const { body, statusCode } = await exec();
        const { data } = body;

        expect(statusCode).toBe(201);
        expect(data.questions.length).toBe(2);
        expect(Object.keys(data)).toEqual(
            expect.arrayContaining(["title", "questions"])
        );
        expect(data.questions).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ type: "Multiple-Choice" }),
                expect.objectContaining({ type: "True-False" }),
            ])
        );

        const res = await QuizModel.findById(data._id);
        expect(res).not.toBeNull();
    });
});

describe("POST /api/createQuiz - True & False", () => {
    it("should return status 201, data property, and be saved if req.body is valid", async () => {
        apiEndPoint = "/api/createQuiz";
        reqBody = { ...quiz };
        reqBody.questions = [{ ...true_false }];

        const { body, statusCode } = await exec();
        const { data } = body;

        expect(statusCode).toBe(201);
        expect(data.questions.length).toBe(1);
        expect(Object.keys(data)).toEqual(
            expect.arrayContaining(["title", "questions"])
        );
        expect(data.questions).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ type: "True-False" }),
            ])
        );

        const res = await QuizModel.findById(data._id);
        expect(res).not.toBeNull();
    });
});

describe("POST /api/createQuiz - Multiple Choice", () => {
    it("should return status 400, and error property if correctAnswer is invalid", async () => {
        apiEndPoint = "/api/createQuiz";

        reqBody = { ...quiz };
        reqBody.questions = [{ ...multiple_choice }];
        reqBody.questions[0].correctAnswer = "e";

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("error");
    });
    it("should return status 400, and error property if answers are duplicated", async () => {
        apiEndPoint = "/api/createQuiz";

        reqBody = { ...quiz };
        reqBody.questions = { ...multiple_choice };
        reqBody.questions.answers = ["a", "b", "c", "c", "d"];

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("error");
    });
    it("should return status 201, data property, and be saved if req.body is valid", async () => {
        apiEndPoint = "/api/createQuiz";
        reqBody = { ...quiz };
        reqBody.questions = [{ ...multiple_choice }];

        const { body, statusCode } = await exec();
        const { data } = body;

        expect(statusCode).toBe(201);
        expect(data.questions.length).toBe(1);
        expect(Object.keys(data)).toEqual(
            expect.arrayContaining(["title", "questions"])
        );
        expect(data.questions).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ type: "Multiple-Choice" }),
            ])
        );

        const res = await QuizModel.findById(data._id);
        expect(res).not.toBeNull();
    });
});
