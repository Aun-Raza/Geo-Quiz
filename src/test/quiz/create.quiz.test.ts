import app from "../../../app";
import config from "config";
import mongoose from "mongoose";
import request from "supertest";
import { User, IUser } from "../user/User";
import { Quiz } from "./Quiz";
import { QuizModel } from "../../model/quiz/model.quiz";
import { UserModel } from "../../model/user/model.user";

// Basic App & DB Setup
beforeAll(async () => {
    await mongoose.connect(config.get("DB_URI"));
});

afterAll(async () => {
    await QuizModel.deleteMany();
    await UserModel.deleteMany();
    await mongoose.connection.close();
    await app.close();
});

beforeEach(async () => {
    await QuizModel.deleteMany();
    await UserModel.deleteMany();
});

async function exec() {
    return await request(app)
        .post(apiEndPoint)
        .set("x-auth-token", token)
        .send(reqBody);
}

async function validateDB(data: any) {
    const res = await QuizModel.findById(data._id);
    expect(res).not.toBeNull();
    const { quizzes } = await UserModel.findById(savedUser._id);
    expect(quizzes[0].toString()).toEqual(data._id);
}

// Global Variable(s)
let apiEndPoint: string;
let reqBody: any;
let savedUser: IUser;
let token: string;

describe("POST /api/createQuiz - BOTH", () => {
    beforeEach(async () => {
        apiEndPoint = "/api/createQuiz";
        reqBody = new Quiz();
        savedUser = await User.saveUser();
        token = User.getSignedToken(savedUser);
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

        await validateDB(data);
    });
});

describe("POST /api/createQuiz - True & False", () => {
    beforeEach(async () => {
        apiEndPoint = "/api/createQuiz";
        reqBody = new Quiz([Quiz.trueFalse]);
        savedUser = await User.saveUser();
        token = User.getSignedToken(savedUser);
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

        await validateDB(data);
    });
});

describe("POST /api/createQuiz - Multiple Choice", () => {
    beforeEach(async () => {
        apiEndPoint = "/api/createQuiz";
        reqBody = new Quiz([Quiz.multipleChoice]);
        savedUser = await User.saveUser();
        token = User.getSignedToken(savedUser);
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

        await validateDB(data);
    });
});
