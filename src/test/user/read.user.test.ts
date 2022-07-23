import app from "../../../app";
import { UserModel } from "../../model/user/model.user";
import mongoose from "mongoose";
import config from "config";
import request from "supertest";
import { User, IUser } from "./User";

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
    return await request(app).get(apiEndPoint);
}

// Global Variables
let apiEndPoint: string;
let savedUser: IUser;

describe("GET /api/getUsers", () => {
    beforeEach(() => {
        apiEndPoint = "/api/getUsers";
    });
    it("should return status 404, and error property if result is empty", async () => {
        const { body, statusCode } = await exec();

        expect(statusCode).toBe(404);
        expect(body).toHaveProperty("error");
    });

    it("should return status 200, and data property if result is not empty", async () => {
        await User.saveUser();

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("data");
        expect(body.data).not.toHaveProperty("hash");
    });
});

describe("GET /api/getUser/:id", () => {
    beforeEach(async () => {
        apiEndPoint = "/api/getUser/";
        savedUser = await User.saveUser();
    });
    it("should return status 400. and error property if req.param is not ObjectID", async () => {
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
        apiEndPoint += savedUser._id;

        const { body, statusCode } = await exec();

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("data");
        expect(body.data).not.toHaveProperty("hash");
    });
});
