import app from '../../../app';
import { QuizModel } from '../../../model/quiz';
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

const request_body = {
	title: 'quiz1',
	questions: [
		{
			name: 'true and false question',
			type: 'True-False',
			correctAnswer: true,
		},
		{
			name: 'multiple choice question',
			type: 'Multiple-Choice',
			answers: ['a', 'b', 'c', 'd'],
			correctAnswer: 'a',
		},
	],
};

describe('DELETE /api/deleteQuiz/:id', () => {
	const apiEndPoint = '/api/deleteQuiz/';
	it('should return status 400 if req.param is not ObjectID', async () => {
		const _id = 1;

		const { body, statusCode } = await request(app).delete(apiEndPoint + _id);

		expect(statusCode).toBe(400);
		expect(body).toHaveProperty('error');
	});
	it('should return status 404 if req.param is not authenticated', async () => {
		const _id = new mongoose.Types.ObjectId().toString();

		const { body, statusCode } = await request(app).delete(apiEndPoint + _id);

		expect(statusCode).toBe(404);
		expect(body).toHaveProperty('error');
	});
	it('should return status 200 if req.param is valid', async () => {
		const doc = new QuizModel(request_body);
		await doc.save();

		const { _id } = doc;

		const { body, statusCode } = await request(app).delete(apiEndPoint + _id);

		expect(statusCode).toBe(200);
		expect(body).toHaveProperty('data');

		const res = await QuizModel.findById(_id);
		expect(res).toBeNull();
	});
});
