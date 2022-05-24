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

describe('GET /api/getQuizzes', () => {
	const apiEndPoint = '/api/getQuizzes';
	it('should return status 404 if result is empty', async () => {
		const { body, statusCode } = await request(app).get(apiEndPoint);

		expect(statusCode).toBe(404);
		expect(body).toHaveProperty('error');
	});
	it('should return status 200 if result is not empty', async () => {
		const doc = new QuizModel(request_body);
		await doc.save();

		const { body, statusCode } = await request(app).get(apiEndPoint);

		expect(statusCode).toBe(200);
		expect(body).toHaveProperty('data');
	});
});

describe('GET /api/getQuiz/:id', () => {
	const apiEndPoint = '/api/getQuiz/';
	it('should return status 400 if req.param is not ObjectID', async () => {
		const _id = 1;

		const { body, statusCode } = await request(app).get(apiEndPoint + _id);

		expect(statusCode).toBe(400);
		expect(body).toHaveProperty('error');
	});
	it('should return status 404 if req.param is not authenticated', async () => {
		const _id = new mongoose.Types.ObjectId().toString();

		const { body, statusCode } = await request(app).get(apiEndPoint + _id);

		expect(statusCode).toBe(404);
		expect(body).toHaveProperty('error');
	});
	it('should return status 200 if req.param is authenticated', async () => {
		const doc = new QuizModel(request_body);
		await doc.save();
		const { _id } = doc;

		const { body, statusCode } = await request(app).get(apiEndPoint + _id);

		expect(statusCode).toBe(200);
		expect(body).toHaveProperty('data');
	});
});
