import jwt from "jsonwebtoken";
import config from "config";

export const getSignedToken = (username: string = "john doe") => {
    return jwt.sign({ username }, config.get("JWT_PRIVATE_KEY"));
};
