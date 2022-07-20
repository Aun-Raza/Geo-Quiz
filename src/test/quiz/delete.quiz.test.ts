import app from "../../../app";
import { QuizModel } from "../../model/quiz/model.quiz";
import mongoose from "mongoose";
import config from "config";
import request from "supertest";
import { getSignedToken } from "../../model/user/model.user";

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
let token: string;

import { Quiz } from "./Quiz";

async function exec() {
    return await request(app).delete(apiEndPoint).set("x-auth-token", token);
}

describe("DELETE /api/deleteQuiz/:id", () => {
    beforeEach(() => {
        token = getSignedToken("john doe");
    });
    it("should return status 401 if auth-token is not provided", async () => {
        const doc = new QuizModel(new Quiz());
        await doc.save();

        const { _id } = doc;
        apiEndPoint = "/api/deleteQuiz/" + _id;
        token = null;

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(401);
        expect(body).toHaveProperty("error");
    });
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
        const doc = new QuizModel(new Quiz());
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
