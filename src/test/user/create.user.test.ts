import app from "../../../app";
import mongoose from "mongoose";
import { UserModel } from "../../model/user/model.user";
import config from "config";
import request from "supertest";
import { User } from "./User";

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

async function exec() {
    return await request(app).post(apiEndPoint).send(reqBody);
}

interface IUser extends mongoose.Document {
    username: string;
}

// Global Variables
let apiEndPoint: string;
let reqBody: any;
let saveUser: () => Promise<IUser>;

describe("POST /api/registerUser", () => {
    beforeEach(() => {
        apiEndPoint = "/api/registerUser";
        reqBody = new User();
        saveUser = async () => {
            const user = new User();
            const hash = await User.hash(user.password);
            const doc = new UserModel(Object.assign(user, { hash }));
            await doc.save();
            return doc;
        };
    });
    it("should return status 400, and error property if req.body is invalid", async () => {
        reqBody = null;

        const { statusCode, body } = await exec();

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("error");
    });
    it("should return status 400, error property, and not be saved if user is already registered", async () => {
        let doc = await saveUser();

        const { statusCode, body } = await exec();

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("error");

        const res = await UserModel.find({ username: doc.username });
        expect(res).toHaveLength(1);
    });
    it("should return status 201, data property, auth-token, and be saved if req.body is valid", async () => {
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
    beforeEach(() => {
        apiEndPoint = "/api/loginUser";
        reqBody = { username: "john doe", password: "password" };
        saveUser = async () => {
            const user = new User();
            const hash = await User.hash(user.password);
            const doc = new UserModel(Object.assign(user, { hash }));
            await doc.save();
            return doc;
        };
    });
    it("should return status 400, and error property if username is incorrect", async () => {
        await saveUser();

        delete reqBody.username;

        const { statusCode, body } = await exec();

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("error");
        expect(body.error).toEqual("Username is not correct");
    });
    it("should return status 400, and error property if password is incorrect", async () => {
        await saveUser();

        delete reqBody.password;

        const { statusCode, body } = await exec();

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("error");
        expect(body.error).toEqual("Password is not correct");
    });
    it("should return status 200, auth-token, and msg property if username & password is correct", async () => {
        await saveUser();

        const { statusCode, body, headers } = await exec();

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("msg");
        expect(headers["x-auth-token"]).not.toBeNull();
    });
});
