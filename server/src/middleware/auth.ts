/* eslint-disable linebreak-style */
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

interface CustomRequest extends Request {
  user?: string | jwt.JwtPayload;
}

export function auth(req: CustomRequest, res: Response, next: NextFunction) {
  const token = req.header('x-auth-token');
  if (!token) {
    res.status(401);
    next(new Error('auth token is not provided'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401);
    next(new Error('auth token is invalid'));
  }
}
