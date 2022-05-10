import express from 'express';
import {
	getQuizzes,
	getQuiz,
	createQuiz,
	updateQuiz,
	deleteQuiz,
} from '../controller';
import { isObjectID } from '../middleware/auth/objectID';
import { notFound, errorHandler } from '../middleware/error';
const router = express.Router();

router.get('/api/getQuizzes', getQuizzes);
router.get('/api/getQuiz/:id', isObjectID, getQuiz);
router.post('/api/createQuiz', createQuiz);
router.put('/api/updateQuiz/:id', isObjectID, updateQuiz);
router.delete('/api/deleteQuiz/:id', isObjectID, deleteQuiz);

router.use(notFound);
router.use(errorHandler);

export default router;
