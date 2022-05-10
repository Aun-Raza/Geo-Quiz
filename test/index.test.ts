import server from '../app';
import { QuizModel } from '../model';
import mongoose from 'mongoose';
import config from 'config';
import request from 'supertest';

beforeAll(async () => {
	await mongoose.connect(config.get('DB_URI'));
});

afterAll(async () => {
	await mongoose.connection.close();
	await server.close();
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
	correctAnswer: 'c',
};
const request_body = {
	title: 'quiz1',
	questions: [true_false, multiple_choice],
};

/** GET Method(s) */

describe('GET /api/getQuizzes', () => {
	it('should return status 404 if result is empty - Failed -', async () => {
		const { body, statusCode } = await request(server).get('/api/getQuizzes');

		expect(statusCode).toBe(404);
		expect(body).toHaveProperty('error');
	});
	it('should return status 200 if result is not empty - Success -', async () => {
		const doc = new QuizModel(request_body);
		await doc.save();

		const { body, statusCode } = await request(server).get('/api/getQuizzes');

		expect(statusCode).toBe(200);
		expect(body).toHaveProperty('data');
	});
});

describe('GET /api/getQuiz/:id', () => {
	it('should return status 400 if req.param is not ObjectID - Failed -', async () => {
		const id = 1;
		const { body, statusCode } = await request(server).get(
			`/api/getQuiz/${id}`
		);
		expect(statusCode).toBe(400);
		expect(body).toHaveProperty('error');
	});
	it('should return status 404 if req.param is not authenticated - Failed -', async () => {
		const id = new mongoose.Types.ObjectId().toString();
		const { body, statusCode } = await request(server).get(
			`/api/getQuiz/${id}`
		);
		expect(statusCode).toBe(404);
		expect(body).toHaveProperty('error');
	});
	it('should return status 200 if req.param is authenticated - Success -', async () => {
		const doc = new QuizModel(request_body);
		await doc.save();
		const { _id } = doc;
		const { body, statusCode } = await request(server).get(
			`/api/getQuiz/${_id}`
		);
		expect(statusCode).toBe(200);
		expect(body).toHaveProperty('data');
	});
});

/** POST Method(s) */

describe('POST /api/createQuiz', () => {
	it('should return status 400 if req.body is invalid - Failed -', async () => {
		const { body, statusCode } = await request(server)
			.post('/api/createQuiz')
			.send({});

		expect(statusCode).toBe(400);
		expect(body).toHaveProperty('error');
	});
	it('should return status 201 if req.body is valid (only Multiple-Choice) - Success -', async () => {
		request_body.questions = [multiple_choice]; // Remove True-False
		const { body, statusCode } = await request(server)
			.post('/api/createQuiz')
			.send(request_body);
		const { data } = body;

		expect(statusCode).toBe(201);
		expect(Object.keys(data)).toEqual(
			expect.arrayContaining(['title', 'questions'])
		);
		expect(data.questions).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ type: 'Multiple-Choice' }),
			])
		);

		expect(data.questions.length).toBe(1);

		const { _id } = await QuizModel.findById(data._id);
		expect(_id).not.toBeNull();
	});
	it('should return status 201 if req.body is valid (only True-False) - Success -', async () => {
		request_body.questions = [true_false];
		const { body, statusCode } = await request(server)
			.post('/api/createQuiz')
			.send(request_body);
		const { data } = body;

		expect(statusCode).toBe(201);
		expect(Object.keys(data)).toEqual(
			expect.arrayContaining(['title', 'questions'])
		);
		expect(data.questions).toEqual(
			expect.arrayContaining([expect.objectContaining({ type: 'True-False' })])
		);

		expect(data.questions.length).toBe(1);

		const { _id } = await QuizModel.findById(data._id);
		expect(_id).not.toBeNull();
	});
	it('should return status 201 if req.body is valid (True-False & Multiple-Choice) - Success -', async () => {
		request_body.questions = [true_false, multiple_choice];
		const { body, statusCode } = await request(server)
			.post('/api/createQuiz')
			.send(request_body);
		const { data } = body;

		expect(statusCode).toBe(201);
		expect(Object.keys(data)).toEqual(
			expect.arrayContaining(['title', 'questions'])
		);
		expect(data.questions).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ type: 'True-False' }),
				expect.objectContaining({ type: 'Multiple-Choice' }),
			])
		);

		const { _id } = await QuizModel.findById(data._id);
		expect(_id).not.toBeNull();
	});
});

/** PUT Method(s) */

describe('PUT /api/updateQuiz/:id', () => {
	it('should return status 400 if req.param is not a ObjectID', async () => {
		const id = 1;
		const { body, statusCode } = await request(server).put(
			`/api/updateQuiz/${id}`
		);
		expect(statusCode).toBe(400);
		expect(body).toHaveProperty('error');
	});
	it('should return status 404 if req.param is not authenticated', async () => {
		const id = new mongoose.Types.ObjectId().toString();

		const { body, statusCode } = await request(server).put(
			`/api/updateQuiz/${id}`
		);
		expect(statusCode).toBe(404);
		expect(body).toHaveProperty('error');
	});
	it('should return status 400 if req.body is invalid', async () => {
		const doc = new QuizModel(request_body);
		await doc.save();
		const { _id } = doc;

		const { body, statusCode } = await request(server)
			.put(`/api/updateQuiz/${_id}`)
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

		const { body, statusCode } = await request(server)
			.put(`/api/updateQuiz/${_id}`)
			.send(clone);

		expect(statusCode).toBe(201);
		const { data } = body;
		expect(Object.keys(data)).toEqual(
			expect.arrayContaining(['title', 'questions'])
		);
		expect(data.title).toEqual('quiz 1 updated');

		const { title } = await QuizModel.findById(_id);
		expect(title).toEqual('quiz 1 updated');
	});
});

/** DELETE Method(s) */

describe('DELETE /api/deleteQuiz/:id', () => {
	it('should return status 400 if req.param is not ObjectID', async () => {
		const id = 1;
		const { body, statusCode } = await request(server).delete(
			`/api/deleteQuiz/${id}`
		);
		expect(statusCode).toBe(400);
		expect(body).toHaveProperty('error');
	});
	it('should return status 404 if req.param is not authenticated', async () => {
		const id = new mongoose.Types.ObjectId().toString();
		const { body, statusCode } = await request(server).delete(
			`/api/deleteQuiz/${id}`
		);
		expect(statusCode).toBe(404);
		expect(body).toHaveProperty('error');
	});
	it('should return status 200 if req.param is valid', async () => {
		const doc = new QuizModel(request_body);
		await doc.save();
		const { _id } = doc;
		const { body, statusCode } = await request(server).delete(
			`/api/deleteQuiz/${_id}`
		);
		expect(statusCode).toBe(200);
		expect(body).toHaveProperty('data');

		const res = await QuizModel.findById(_id);
		expect(res).toBeNull();
	});
});
