import app from "../../../app";
import { QuizModel } from "../../model/quiz/model.quiz";
import mongoose from "mongoose";
import config from "config";
import request from "supertest";
import { User } from "../user/User";
import { Quiz } from "./Quiz";

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

async function exec() {
    return await request(app)
        .post(apiEndPoint)
        .set("x-auth-token", token)
        .send(reqBody);
}
// Global Variable(s)
let apiEndPoint: string;
let token: string;
let reqBody: any;

describe("POST /api/createQuiz - BOTH", () => {
    beforeEach(async () => {
        apiEndPoint = "/api/createQuiz";
        reqBody = new Quiz();
        token = User.getSignedToken(await User.saveUser());
    });

    it("should return status 401 if auth-token is not provided", async () => {
        token = null;

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(401);
        expect(body).toHaveProperty("error");
    });
    it("should return status 400, and error property if req.body is invalid", async () => {
        reqBody = null;

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("error");
    });
    it("should return status 201, data property, and be saved if req.body is valid", async () => {
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
    beforeEach(async () => {
        apiEndPoint = "/api/createQuiz";
        reqBody = new Quiz([Quiz.trueFalse]);
        token = User.getSignedToken(await User.saveUser());
    });
    it("should return status 201, data property, and be saved if req.body is valid", async () => {
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
    beforeEach(async () => {
        apiEndPoint = "/api/createQuiz";
        reqBody = new Quiz([Quiz.multipleChoice]);
        token = User.getSignedToken(await User.saveUser());
    });
    it("should return status 400, and error property if correctAnswer is invalid", async () => {
        let updatedMC = { ...Quiz.multipleChoice };
        updatedMC.correctAnswer = "e";
        reqBody = new Quiz([updatedMC]);

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("error");
    });
    it("should return status 400, and error property if answers are duplicated", async () => {
        let updatedMC = { ...Quiz.multipleChoice };
        updatedMC.answers = ["a", "b", "c", "c", "d"];
        reqBody = new Quiz([updatedMC]);

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("error");
    });
    it("should return status 201, data property, and be saved if req.body is valid", async () => {
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
