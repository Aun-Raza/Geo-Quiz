import app from "../../../app";
import { UserModel } from "../../../model/user/model.user";
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
    await UserModel.deleteMany({});
});

// Global Variables
let apiEndPoint: string;

const user = {
    email: "johnDoe@gmail.com",
    username: "John Doe",
    hash: "password", // In code, we converted password to hash in schema
};

async function exec() {
    return await request(app).get(apiEndPoint);
}

describe("GET /api/getUsers", () => {
    it("should return status 404, and error property if result is empty", async () => {
        apiEndPoint = "/api/getUsers";

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(404);
        expect(body).toHaveProperty("error");
    });

    it("should return status 200, and data property if result is not empty", async () => {
        const doc = new UserModel(user);
        await doc.save();

        apiEndPoint = "/api/getUsers";

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("data");
        expect(body.data).not.toHaveProperty("hash");
    });
});

describe("GET /api/getUser/:id", () => {
    it("should return status 400. and error property if req.param is not ObjectID", async () => {
        apiEndPoint = "/api/getUser/1";

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("error");
    });

    it("should return status 404, and error property if req.param is not authenticated", async () => {
        const _id = new mongoose.Types.ObjectId().toString();
        apiEndPoint = "/api/getUser/" + _id;

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(404);
        expect(body).toHaveProperty("error");
    });

    it("should return status 200, and data property if req.param is authenticated", async () => {
        const doc = new UserModel(user);
        await doc.save();

        const { _id } = doc;
        apiEndPoint = "/api/getUser/" + _id;

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("data");
        expect(body.data).not.toHaveProperty("hash");
    });
});
