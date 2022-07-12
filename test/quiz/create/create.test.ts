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

describe('POST /api/createQuiz', () => {
	const apiEndPoint = '/api/createQuiz';
	it('should return status 400 if req.body is invalid', async () => {
		const { body, statusCode } = await request(app)
			.post(apiEndPoint)
			.send(null);

		expect(statusCode).toBe(400);
		expect(body).toHaveProperty('error');
	});
	it('should return status 400 if multiple choice correctAnswer is invalid', async () => {
		const clone = { ...request_body };
		const mc_clone = { ...multiple_choice };
		mc_clone.correctAnswer = 'e';
		clone.questions = [mc_clone];

		const { body, statusCode } = await request(app)
			.post(apiEndPoint)
			.send(clone);

		expect(statusCode).toBe(400);
		expect(body).toHaveProperty('error');
	});
	it('should return status 400 if multiple choice answers are duplicated', async () => {
		const clone = { ...request_body };
		const mc_clone = { ...multiple_choice };
		mc_clone.answers = ['a', 'b', 'c', 'c', 'd'];
		clone.questions = [mc_clone];

		const { body, statusCode } = await request(app)
			.post(apiEndPoint)
			.send(clone);

		expect(statusCode).toBe(400);
		expect(body).toHaveProperty('error');
	});
	it('should return status 201 if req.body is valid, include only multiple-choice', async () => {
		request_body.questions = [multiple_choice];

		const { body, statusCode } = await request(app)
			.post(apiEndPoint)
			.send(request_body);

		const { data } = body;
		const { questions, _id } = data;

		expect(statusCode).toBe(201);
		expect(questions.length).toBe(1);
		expect(Object.keys(data)).toEqual(
			expect.arrayContaining(['title', 'questions'])
		);
		expect(questions).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ type: 'Multiple-Choice' }),
			])
		);

		const res = await QuizModel.findById(_id);
		expect(res).not.toBeNull();
	});
	it('should return status 201 if req.body is valid, include only true-false', async () => {
		request_body.questions = [true_false];

		const { body, statusCode } = await request(app)
			.post(apiEndPoint)
			.send(request_body);

		const { data } = body;
		const { questions, _id } = data;

		expect(statusCode).toBe(201);
		expect(questions.length).toBe(1);
		expect(Object.keys(data)).toEqual(
			expect.arrayContaining(['title', 'questions'])
		);
		expect(questions).toEqual(
			expect.arrayContaining([expect.objectContaining({ type: 'True-False' })])
		);

		const res = await QuizModel.findById(_id);
		expect(res).not.toBeNull();
	});
	it("should return status 201 if req.body is valid, include 'both' true-false and multiple-choice", async () => {
		request_body.questions = [true_false, multiple_choice];

		const { body, statusCode } = await request(app)
			.post(apiEndPoint)
			.send(request_body);

		const { data } = body;
		const { questions, _id } = data;

		expect(statusCode).toBe(201);
		expect(questions.length).toBe(2);
		expect(Object.keys(data)).toEqual(
			expect.arrayContaining(['title', 'questions'])
		);
		expect(questions).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ type: 'Multiple-Choice' }),
				expect.objectContaining({ type: 'True-False' }),
			])
		);

		const res = await QuizModel.findById(_id);
		expect(res).not.toBeNull();
	});
});
