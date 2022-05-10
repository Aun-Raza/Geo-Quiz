import express, { Request, Response, NextFunction } from 'express';
import {
	getQuizzes,
	getQuiz,
	createQuiz,
	updateQuiz,
	deleteQuiz,
} from '../controllers/index';
import { isObjectID } from '../middleware/isObjectID';
import IError from '../interfaces/IError';
import log from '../log';

const router = express.Router();

router.get('/api/getQuizzes', getQuizzes);
router.get('/api/getQuiz/:id', isObjectID, getQuiz);
router.post('/api/createQuiz', createQuiz);
router.put('/api/updateQuiz/:id', isObjectID, updateQuiz);
router.delete('/api/deleteQuiz/:id', isObjectID, deleteQuiz);

router.use((req, res, next) => {
	res.status(404);
	let err: IError = new Error(`${req.path} could not be found`);
	err.service = 'none';
	next(err);
});

router.use((err: IError, req: Request, res: Response, next: NextFunction) => {
	log.error(err.message, { service: err.service });
	res.json({ error: err.message });
});

export default router;
