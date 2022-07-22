import app from "../../../app";
import { QuizModel } from "../../model/quiz/model.quiz";
import mongoose, { ObjectId } from "mongoose";
import config from "config";
import request from "supertest";
import { getSignedToken } from "./getSignedToken";
import { Quiz } from "./Quiz";
import { ObjectBindingOrAssignmentElement } from "typescript";

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
        .put(apiEndPoint)
        .set("x-auth-token", token)
        .send(reqBody);
}

interface IQuiz extends mongoose.Document {
    _id: ObjectId;
}

// Global Variables
let apiEndPoint: string;
let reqBody: any;
let saveQuiz: () => Promise<IQuiz>;
let token: string;

describe("PUT /api/updateQuiz/:id", () => {
    beforeEach(() => {
        apiEndPoint = "/api/updateQuiz/";
        reqBody = new Quiz();
        token = getSignedToken();
        saveQuiz = async () => {
            const doc = new QuizModel(new Quiz());
            await doc.save();
            return doc;
        };
    });
    it("should return status 401 if auth-token is not provided", async () => {
        const doc = await saveQuiz();

        apiEndPoint += doc._id;
        token = null;

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(401);
        expect(body).toHaveProperty("error");
    });
    it("should return status 400, and error property if req.param is not a ObjectID", async () => {
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
    it("should return status 400, and error property if req.body is invalid", async () => {
        const doc = await saveQuiz();

        apiEndPoint += doc._id;
        reqBody = null;

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("error");
    });
    it("should return status 201, and data property, and be saved if req.body is valid", async () => {
        const doc = await saveQuiz();

        apiEndPoint += doc._id;
        reqBody.title = "quiz 1 updated";

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(201);
        const { data } = body;
        expect(Object.keys(data)).toEqual(
            expect.arrayContaining(["title", "questions"])
        );
        expect(data.title).toEqual(reqBody.title);

        const { title } = await QuizModel.findById(doc._id);
        expect(title).toEqual(reqBody.title);
    });
});
