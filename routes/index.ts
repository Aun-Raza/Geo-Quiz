import express, { Request, Response, NextFunction } from 'express';
import { createQuiz, getQuizzes } from '../controllers/index';
import logger from '../log/dev-logger';
import IError from '../interfaces/IError';

const router = express.Router();

router.get('/api/getQuizzes', getQuizzes);
router.post('/api/createQuiz', createQuiz);

router.use((req, res, next) => {
	res.status(404);
	let err: IError = new Error(`${req.path} could not be found`);
	err.service = 'none';
	next(err);
});

router.use((err: IError, req: Request, res: Response, next: NextFunction) => {
	// logger.error(err.message, { service: err.service });
	res.json({ error: err.message });
});

export default router;
