import express, { Request, Response, NextFunction } from 'express';
import { QuizModel, schema } from '../models/index';
import logger from '../log/dev-logger';

export async function getQuizzes(
	req: Request,
	res: Response,
	next: NextFunction
) {
	logger.info('GET /api/getQuizzes', { service: 'getQuizzes' });
	try {
		const result = await QuizModel.find({});
		if (!result.length) {
			res.status(404);
			return next(new Error('no results are found.'));
		}
		res.json({ data: result });
	} catch (error) {
		res.status(500);
		next(error);
	}
}
export async function getQuiz(req: Request, res: Response, next: NextFunction) {
	logger.info('GET /api/getQuiz/:id', { service: 'getQuiz' });
	try {
		const result = await QuizModel.findById(req.params.id);
		if (!result) {
			res.status(404);
			return next(new Error('no result is found'));
		}
		res.json({ data: result });
	} catch (error) {
		res.status(500);
		next(error);
	}
}

export async function createQuiz(
	req: Request,
	res: Response,
	next: NextFunction
) {
	logger.info('POST /api/createQuiz', { service: 'createQuiz' });
	try {
		await schema.validateAsync(req.body || {});
		let doc = new QuizModel({
			title: req.body.title,
			questions: req.body.questions,
		});

		const result = await doc.save();
		res.status(201).json({ data: result });
	} catch (error) {
		if (error.isJoi === true) res.status(400);
		else res.status(500);
		next(error);
	}
}

export async function updateQuiz(
	req: Request,
	res: Response,
	next: NextFunction
) {
	logger.info('PUT /api/updateQuiz/:id', { service: 'updateQuiz' });
	try {
		const initialResult = await QuizModel.findById(req.params.id);
		if (!initialResult) {
			res.status(404);
			return next(new Error('quiz does not exist'));
		}
		await schema.validateAsync(req.body || {});
		const updatedResult = await QuizModel.findOneAndUpdate(
			{ initialResult },
			req.body,
			{ returnDocument: 'after' }
		);
		res.status(201).json({ data: updatedResult });
	} catch (error) {
		if (error.isJoi === true) res.status(400);
		else res.status(500);
		next(error);
	}
}

export async function deleteQuiz(
	req: Request,
	res: Response,
	next: NextFunction
) {
	logger.info('DELETE /api/deleteQuiz/:id', { service: 'deleteQuiz' });
	try {
		const result = await QuizModel.findByIdAndDelete(req.params.id);
		if (!result) {
			res.status(404);
			return next(new Error('quiz does not exist.'));
		}
		res.json({ data: result });
	} catch (error) {
		res.status(500);
		next(error);
	}
}
