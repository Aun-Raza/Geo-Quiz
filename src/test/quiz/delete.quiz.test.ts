import app from "../../../app";
import { QuizModel } from "../../model/quiz/model.quiz";
import mongoose, { ObjectId } from "mongoose";
import config from "config";
import request from "supertest";
import { getSignedToken } from "./getSignedToken";
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
    return await request(app).delete(apiEndPoint).set("x-auth-token", token);
}

interface IQuiz extends mongoose.Document {
    _id: ObjectId;
}

// Global Variable(s)
let apiEndPoint: string;
let saveQuiz: () => Promise<IQuiz>;
let token: string;

describe("DELETE /api/deleteQuiz/:id", () => {
    beforeEach(() => {
        apiEndPoint = "/api/deleteQuiz/";
        saveQuiz = async () => {
            const doc = new QuizModel(new Quiz());
            await doc.save();
            return doc;
        };
        token = getSignedToken();
    });
    it("should return status 401 if auth-token is not provided", async () => {
        const doc = await saveQuiz();

        apiEndPoint += doc._id;
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
        const doc = await saveQuiz();

        apiEndPoint += doc._id;

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("data");

        const res = await QuizModel.findById(doc._id);
        expect(res).toBeNull();
    });
});
