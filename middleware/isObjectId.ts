import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export async function isObjectID(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
		if (!isValid) {
			res.status(400);
			const err = new Error('Given id is not a objectId');
			return next(err);
		}
		next();
	} catch (error) {
		next(error);
	}
}
