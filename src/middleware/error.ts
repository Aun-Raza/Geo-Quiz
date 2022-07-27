import log from "../log/logger";
import { Request, Response, NextFunction } from "express";

export function notFound(req: Request, res: Response, next: NextFunction) {
    res.status(404);
    next(new Error(`${req.path} could not be found`));
}

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    log.error(err.message);
    res.json({ error: err.message });
}
