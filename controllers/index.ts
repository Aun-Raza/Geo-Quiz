import express, { Request, Response, NextFunction } from 'express';
import { QuizModel, schema } from '../models/index';
import logger from '../log/dev-logger';

export async function getQuizzes(
	req: Request,
	res: Response,
	next: NextFunction
) {
	logger.info('GET /api/getQuizzes processing..', { service: 'getQuizzes' });
	try {
		const result = await QuizModel.find({});
		if (!result.length) {
			return res.status(200).json({ data: 'no results are found.' });
		}
		res.status(200).json({ data: result });
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
	logger.info('Post /api/createQuiz processing..', { service: 'createQuiz' });
	try {
		await schema.validateAsync(req.body || {});
		let doc = new QuizModel({
			title: req.body.title,
			questions: req.body.questions,
		});

		const result = await doc.save();
		res.status(200).json({ data: result });
	} catch (error) {
		if (error.isJoi === true) res.status(400);
		else res.status(500);
		next(error);
	}
}
