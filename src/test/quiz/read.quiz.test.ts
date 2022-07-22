import app from "../../../app";
import { QuizModel } from "../../model/quiz/model.quiz";
import mongoose from "mongoose";
import config from "config";
import request from "supertest";
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
    return await request(app).get(apiEndPoint);
}
// Globals variable(s)
let apiEndPoint: string;

describe("GET /api/getQuizzes", () => {
    beforeEach(() => {
        apiEndPoint = "/api/getQuizzes";
    });
    it("should return status 404, and error property if result is empty", async () => {
        const { body, statusCode } = await exec();

        expect(statusCode).toBe(404);
        expect(body).toHaveProperty("error");
    });
    it("should return status 200, and data property if result is not empty", async () => {
        const doc = new QuizModel(new Quiz());
        await doc.save();

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("data");
    });
});

describe("GET /api/getQuiz/:id", () => {
    beforeEach(() => {
        apiEndPoint = "/api/getQuiz/";
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
    it("should return status 200, and data property if req.param is authenticated", async () => {
        const doc = new QuizModel(new Quiz());
        await doc.save();

        apiEndPoint += doc._id;

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("data");
    });
});
