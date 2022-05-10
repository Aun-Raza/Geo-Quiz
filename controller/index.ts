import { Request, Response } from 'express';
import { QuizModel, schema } from '../model';
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

	await schema.validateAsync(req.body || null).catch((error) => {
		res.status(400);
		throw error;
	});

	let doc = new QuizModel({
		title: req.body.title,
		questions: req.body.questions,
	});
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

	await schema.validateAsync(req.body || null).catch((error) => {
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
		throw new Error('quiz does not exist.');
	}

	res.json({ data: doc });
}
