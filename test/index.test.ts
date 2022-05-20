import app from '../app';
import { QuizModel } from '../model';
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

// Global variables (reuseable)

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

/** GET Method(s) */

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

/** POST Method(s) */

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

/** PUT Method(s) */

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

/** DELETE Method(s) */

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
