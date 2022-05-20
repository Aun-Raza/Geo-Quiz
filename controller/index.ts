import { Request, Response } from 'express';
import { QuizModel } from '../model';
import { isMCValid } from '../model/validators/custom-validator';
import validator from '../model/validators/joi-validator';
import log from '../log';

/**
 * GET METHOD(s)
 */
export async function getQuizzes(req: Request, res: Response) {
	log.info('GET /api/getQuizzes', { service: 'getQuizzes' });

	const queries = await QuizModel.find();
	if (!queries.length) {
		res.status(404);
		throw new Error('no quizzes are found.');
	}

	res.json({ data: queries });
}

export async function getQuiz(req: Request, res: Response) {
	log.info('GET /api/getQuiz/:id', { service: 'getQuiz' });

	const query = await QuizModel.findById(req.params.id);
	if (!query) {
		res.status(404);
		throw new Error('no result is found');
	}

	res.json({ data: query });
}

/**
 * POST METHOD(s)
 */

export async function createQuiz(req: Request, res: Response) {
	log.info('POST /api/createQuiz', { service: 'createQuiz' });

	await validator.validateAsync(req.body || null).catch((error) => {
		res.status(400);
		throw error;
	});

	const multipleChoices = req.body.questions.filter(
		(question: { type: string }) => question.type === 'Multiple-Choice'
	);

	if (!isMCValid(multipleChoices)) {
		res.status(400);
		throw new Error('wrong choices');
	}

	let doc = new QuizModel(req.body);
	doc = await doc.save();

	res.status(201).json({ data: doc });
}

/**
 * PUT METHOD(s)
 */

export async function updateQuiz(req: Request, res: Response) {
	log.info('PUT /api/updateQuiz/:id', { service: 'updateQuiz' });

	const query = await QuizModel.findById(req.params.id);
	if (!query) {
		res.status(404);
		throw new Error('quiz does not exist');
	}

	await validator.validateAsync(req.body || null).catch((error) => {
		res.status(400);
		throw error;
	});

	const doc = await QuizModel.findOneAndUpdate({ query }, req.body, {
		returnDocument: 'after',
	});

	res.status(201).json({ data: doc });
}

/**
 * DELETE METHOD(s)
 */

export async function deleteQuiz(req: Request, res: Response) {
	log.info('DELETE /api/deleteQuiz/:id', { service: 'deleteQuiz' });

	const doc = await QuizModel.findByIdAndDelete(req.params.id);
	if (!doc) {
		res.status(404);
		throw new Error('quiz does not exist');
	}

	res.json({ data: doc });
}
