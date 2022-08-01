import app from "../../../app";
import config from "config";
import mongoose from "mongoose";
import request from "supertest";
import { Quiz, IQuiz } from "./Quiz";
import { QuizModel } from "../../model/quiz/model.quiz";
import { User } from "../user/User";
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
    return await request(app).delete(apiEndPoint).set("x-auth-token", token);
}

// Global Variable(s)
let apiEndPoint: string;
let savedQuiz: IQuiz;
let token: string;

describe("DELETE /api/deleteQuiz/:id", () => {
    beforeEach(async () => {
        apiEndPoint = "/api/deleteQuiz/";
        savedQuiz = await Quiz.saveQuiz();
        token = User.getSignedToken(await User.saveUser());
    });
    it("should return status 401 if auth-token is not provided", async () => {
        apiEndPoint += savedQuiz._id;
        token = null;

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(401);
        expect(body).toHaveProperty("error");
    });
    it("should return status 400, and error property if req.param is not ObjectID", async () => {
        apiEndPoint += 1;

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("error");
    });
    it("should return status 404, and error property if req.param is not authenticated", async () => {
        const _id = new mongoose.Types.ObjectId().toString();
        apiEndPoint += _id;

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(404);
        expect(body).toHaveProperty("error");
    });
    it("should return status 200, data property, and data to be deleted if req.param is valid", async () => {
        apiEndPoint += savedQuiz._id;
        const { owner: ownerId } = savedQuiz;

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("data");

        const res = await QuizModel.findById(savedQuiz._id);
        expect(res).toBeNull();

        const { quizzes } = await UserModel.findById(ownerId);
        expect(quizzes.length).toBe(0);
    });
});
