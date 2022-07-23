import { Request, Response } from "express";
import { UserModel } from "../../model/user/model.user";
import validator from "../../model/user/validators";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "config";
import log from "../../log";
import _ from "lodash";
import { ObjectId } from "mongoose";

interface CustomRequest extends Request {
    user: { _id: ObjectId; username: string };
}

/* GET METHOD(s)
 */
export async function getUsers(req: Request, res: Response) {
    log.info("GET /api/getUsers", { service: "getUsers" });

    const queries = await UserModel.find();
    if (!queries.length) {
        res.status(404);
        throw new Error("no users are found.");
    }

    const filteredQueries = queries.map((query) =>
        _.pick(query, ["_id", "username", "email"])
    );
    res.json({ data: filteredQueries });
}

export async function getUser(req: Request, res: Response) {
    log.info("GET /api/getUser/:id", { service: "getUser" });

    const query = await UserModel.findById(req.params.id);
    if (!query) {
        res.status(404);
        throw new Error("no result is found");
    }

    res.json({ data: _.pick(query, ["_id", "username", "email"]) });
}

/* POST METHOD(s)
 */

export async function registerUser(req: Request, res: Response) {
    log.info("POST /api/registerUser", { service: "registerUser" });

    const user = await validator
        .validateAsync(req.body || null)
        .catch((error) => {
            res.status(400);
            throw error;
        });

    const isAlreadyRegistered = await UserModel.findOne({
        username: user.username,
    });
    if (isAlreadyRegistered) {
        res.status(400);
        throw new Error("User already exist in the registration");
    }

    const salt = await bcrypt.genSalt();
    user.hash = await bcrypt.hash(user.password, salt);

    let doc = new UserModel(user);
    doc = await doc.save();

    const token = jwt.sign(
        { _id: user._id, username: user.username },
        config.get("JWT_PRIVATE_KEY"),
        { expiresIn: 1800 }
    );
    res.header("x-auth-token", token)
        .status(201)
        .json({
            data: _.pick(doc, ["_id", "username", "email"]),
            authToken: token,
        });
}

export async function loginUser(req: Request, res: Response) {
    log.info("POST /api/loginUser", { service: "loginUser" });

    const { username: inputUsername, password: inputPassword } = req.body;

    const user = await UserModel.findOne({ username: inputUsername });
    if (!user) {
        res.status(400);
        throw new Error("Username is not correct");
    }

    const isCorrectPassword = await bcrypt.compare(
        inputPassword || "",
        user.hash
    );
    if (!isCorrectPassword) {
        res.status(400);
        throw new Error("Password is not correct");
    }

    const token = jwt.sign(
        { _id: user._id, username: user.username },
        config.get("JWT_PRIVATE_KEY"),
        { expiresIn: 1800 }
    );

    res.header("x-auth-token", token)
        .status(200)
        .json({ msg: "You logged in" });
}

export async function updateUser(req: CustomRequest, res: Response) {
    log.info("UPDATE /api/updateUser/:id", { service: "updateUser" });

    if (req.user._id.toString() != req.params.id) {
        res.status(401);
        throw new Error(`You are not authorized to update this user`);
    }

    const user = await validator
        .validateAsync(req.body || null)
        .catch((error) => {
            res.status(400);
            throw error;
        });

    const salt = await bcrypt.genSalt();
    user.hash = await bcrypt.hash(user.password, salt);

    const query = await UserModel.findByIdAndUpdate(req.params.id, user);
    if (!query) {
        res.status(404);
        throw new Error(`Cannot find targeted user in the registry`);
    }

    res.status(201).json({ data: query });
}

export async function deleteUser(req: CustomRequest, res: Response) {
    log.info("PUT /api/deleteUser/:id", { service: "deleteUser" });

    if (req.user._id.toString() != req.params.id) {
        res.status(401);
        throw new Error(`You are not authorized to delete this user`);
    }

    const query = await UserModel.findByIdAndDelete(req.params.id);
    if (!query) {
        res.status(404);
        throw new Error(`Cannot find targeted user in the registry`);
    }

    res.status(201).json({ data: query });
}
