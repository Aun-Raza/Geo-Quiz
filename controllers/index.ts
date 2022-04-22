import express, { Request, Response, NextFunction } from 'express';
import logger from '../log/dev-logger';

export function getQuizzes(req: Request, res: Response, next: NextFunction) {
	logger.info('Returning API middleware response', { service: 'getQuizzes' });
	res.status(200).json({
		data: [
			{ title: 'quiz1', date: Date.now() },
			{ title: 'quiz2', date: Date.now() },
		],
	});
}
