import { auth } from '../middleware/auth';
import express from 'express';
import {
    getQuizzes,
    getQuiz,
    createQuiz,
    updateQuiz,
    deleteQuiz,
} from '../controller/quiz/controller.quiz';
import {
    getUsers,
    getUser,
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
} from '../controller/user/controller.user';
import { isObjectID } from '../middleware/objectID';
import { notFound, errorHandler } from '../middleware/error';

const router = express.Router();

// Quiz Section
router.get('/api/getQuizzes', getQuizzes);
router.get('/api/getQuiz/:id', isObjectID, getQuiz);
router.post('/api/createQuiz', auth, createQuiz);
router.put('/api/updateQuiz/:id', [isObjectID, auth], updateQuiz);
router.delete('/api/deleteQuiz/:id', [isObjectID, auth], deleteQuiz);

// User Section
router.get('/api/getUsers', getUsers);
router.get('/api/getUser/:id', isObjectID, getUser);
router.post('/api/registerUser', registerUser);
router.post('/api/loginUser', loginUser);
router.put('/api/updateUser/:id', [isObjectID, auth], updateUser);
router.delete('/api/deleteUser/:id', [isObjectID, auth], deleteUser);

router.use(notFound);
router.use(errorHandler);

export default router;
