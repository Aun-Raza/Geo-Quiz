import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

export function isObjectID(req: Request, res: Response, next: NextFunction) {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) {
    res.status(400);
    throw new Error('Given id is not a valid ObjectID');
  }
  next();
}
