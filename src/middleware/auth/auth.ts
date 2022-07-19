import { Request, Response, NextFunction } from "express";
import config from "config";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
    user?: string | jwt.JwtPayload;
}

export function auth(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.header("x-auth-token");
    if (!token) {
        res.status(400);
        throw new Error("auth token is not provided");
    }
    try {
        const decoded = jwt.verify(token, config.get("JWT_PRIVATE_KEY"));
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400);
        throw new Error("auth token is invalid");
    }
}
