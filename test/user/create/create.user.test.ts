import app from "../../../app";
import mongoose from "mongoose";
import { UserModel } from "../../../model/user/model.user";
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
let reqBody: any;

import User from "../User";

async function exec() {
    return await request(app).post(apiEndPoint).send(reqBody);
}

describe("POST /api/registerUser", () => {
    it("should return status 400, and error property if req.body is invalid", async () => {
        apiEndPoint = "/api/registerUser";
        reqBody = null;

        const { statusCode, body } = await exec();

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("error");
    });
    it("should return status 400, error property, and not be saved if user is already registered", async () => {
        const user = new User();
        const hash = await User.hash(user.password);
        const doc = new UserModel(Object.assign(user, { hash }));
        await doc.save();

        apiEndPoint = "/api/registerUser";
        reqBody = { ...user };

        const { statusCode, body } = await exec();

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("error");

        const res = await UserModel.find({ username: doc.username });
        expect(res).toHaveLength(1);
    });
    it("should return status 201, data property, auth-token, and be saved if req.body is valid", async () => {
        apiEndPoint = "/api/registerUser";
        reqBody = new User();

        const { statusCode, body, headers } = await exec();

        const { data } = body;
        expect(statusCode).toBe(201);
        expect(Object.keys(data)).toEqual(
            expect.arrayContaining(["_id", "email", "username"])
        );
        expect(data).not.toHaveProperty("password");
        expect(headers["x-auth-token"]).not.toBeNull();

        const res = await UserModel.findById(data._id);
        expect(res).not.toBeNull();
        expect(res.hash).not.toEqual(reqBody.password);
    });
});

describe("POST /api/loginUser", () => {
    it("should return status 400, and error property if username is incorrect", async () => {
        const user = new User();
        const hash = await User.hash(user.password);
        const doc = new UserModel(Object.assign(user, { hash }));
        await doc.save();

        apiEndPoint = "/api/loginUser";
        reqBody = { password: "password" };

        const { statusCode, body } = await exec();

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("error");
        expect(body.error).toEqual("Username is not correct");
    });
    it("should return status 400, and error property if password is incorrect", async () => {
        const user = new User();
        const hash = await User.hash(user.password);
        const doc = new UserModel(Object.assign(user, { hash }));
        await doc.save();

        apiEndPoint = "/api/loginUser";
        reqBody = { username: "John Doe" };

        const { statusCode, body } = await exec();

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("error");
        expect(body.error).toEqual("Password is not correct");
    });
    it("should return status 200, auth-token, and msg property if username & password is correct", async () => {
        const user = new User();
        const hash = await User.hash(user.password);
        const doc = new UserModel(Object.assign(user, { hash }));
        await doc.save();

        apiEndPoint = "/api/loginUser";
        reqBody = { username: "John Doe", password: user.password };

        const { statusCode, body, headers } = await exec();

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("msg");
        expect(headers["x-auth-token"]).not.toBeNull();
    });
});
