import app from '../../app';
import { QuizModel } from '../../model';
import mongoose from 'mongoose';
import config from 'config';
import request from 'supertest';

beforeAll(async () => {
	await mongoose.connect(config.get('DB_URI'));
});

afterAll(async () => {
	await mongoose.connection.close();
	await app.close();
});

beforeEach(async () => {
	await QuizModel.deleteMany({});
});

const true_false = {
	name: 'true and false question',
	type: 'True-False',
	correctAnswer: true,
};
const multiple_choice = {
	name: 'multiple choice question',
	type: 'Multiple-Choice',
	answers: ['a', 'b', 'c', 'd'],
	correctAnswer: 'a',
};
const request_body = {
	title: 'quiz1',
	questions: [true_false, multiple_choice],
};

describe('PUT /api/updateQuiz/:id', () => {
	const apiEndPoint = '/api/updateQuiz/';
	it('should return status 400 if req.param is not a ObjectID', async () => {
		const _id = 1;

		const { body, statusCode } = await request(app).put(apiEndPoint + _id);

		expect(statusCode).toBe(400);
		expect(body).toHaveProperty('error');
	});
	it('should return status 404 if req.param is not authenticated', async () => {
		const _id = new mongoose.Types.ObjectId().toString();

		const { body, statusCode } = await request(app).put(apiEndPoint + _id);
		expect(statusCode).toBe(404);
		expect(body).toHaveProperty('error');
	});
	it('should return status 400 if req.body is invalid', async () => {
		const doc = new QuizModel(request_body);
		await doc.save();

		const { _id } = doc;

		const { body, statusCode } = await request(app)
			.put(apiEndPoint + _id)
			.set({});

		expect(statusCode).toBe(400);
		expect(body).toHaveProperty('error');
	});
	it('should return status 201 if req.body is valid', async () => {
		const doc = new QuizModel(request_body);
		await doc.save();

		const { _id } = doc;
		const clone = { ...request_body };
		clone.title = 'quiz 1 updated';

		const { body, statusCode } = await request(app)
			.put(apiEndPoint + _id)
			.send(clone);

		expect(statusCode).toBe(201);
		const { data } = body;
		expect(Object.keys(data)).toEqual(
			expect.arrayContaining(['title', 'questions'])
		);
		expect(data.title).toEqual(clone.title);

		const { title } = await QuizModel.findById(_id);
		expect(title).toEqual(clone.title);
	});
});
