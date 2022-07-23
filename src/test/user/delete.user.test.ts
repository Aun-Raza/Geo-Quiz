import app from "../../../app";
import mongoose, { ObjectId } from "mongoose";
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
    return await request(app).delete(apiEndPoint).set("x-auth-token", token);
}

interface IUser extends mongoose.Document {
    _id: ObjectId;
    username: string;
}

// Global Variables
let apiEndPoint: string;
let savedUser: IUser;
let token: string;

describe("DELETE /api/deleteUser/:id", () => {
    beforeEach(async () => {
        apiEndPoint = "/api/deleteUser/";
        savedUser = await User.saveUser();
        token = User.getSignedToken(savedUser);
    });
    it("should return status 400, and error property if ObjectId is invalid", async () => {
        apiEndPoint += 1;

        const { statusCode, body } = await exec();

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("error");
        expect(body.error).toBe("Given id is not a valid ObjectID");
    });
    it("should return status 401, and error property if x-auth-token is not provided", async () => {
        apiEndPoint += savedUser._id;
        token = null;

        const { statusCode, body } = await exec();

        expect(statusCode).toBe(401);
        expect(body).toHaveProperty("error");
    });
    it("should return status 401, and error property if req.user._id does match with req.params.id", async () => {
        apiEndPoint += savedUser._id;
        const newUser = await User.saveUser();
        token = User.getSignedToken(newUser);

        const { statusCode, body } = await exec();

        expect(statusCode).toBe(401);
        expect(body).toHaveProperty("error");
    });
    it("should return status 404, and error property if req.param is not authenticated", async () => {
        const { statusCode, body } = await exec();

        const _id = new mongoose.Types.ObjectId().toString();
        apiEndPoint += _id;

        expect(statusCode).toBe(404);
        expect(body).toHaveProperty("error");
    });
    it("should return status 201, and data property if req.user matches with the targeted user", async () => {
        apiEndPoint += savedUser._id;

        const { statusCode, body } = await exec();

        expect(statusCode).toBe(201);
        expect(body).toHaveProperty("data");
    });
});
