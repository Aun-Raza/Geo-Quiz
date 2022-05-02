import server from '../../app';
import { QuizModel } from '../../models/index';
import { connect, connection } from 'mongoose';
import config from 'config';
import request from 'supertest';

beforeEach(async () => {
	await connect(config.get('DB_URI'));
});

afterEach(async () => {
	await QuizModel.deleteMany({});
	await connection.close();
	server.close();
});

describe('GET /api/getQuizzes', () => {
	it('should return no result and status 200 if database is empty - SUCCESS -', async () => {
		const { body, statusCode } = await request(server).get('/api/getQuizzes');

		expect(statusCode).toBe(200);
		expect(body).toEqual({ data: 'no results are found.' });
	});
});

describe('POST /api/createQuiz', () => {
	it('should return status 200 if req.body is valid and includes both question types - SUCCESS -', async () => {
		const requestBody = {
			title: 'quiz1',
			questions: [
				{
					name: 'question1',
					type: 'Multiple-Choice',
					answers: ['a', 'b', 'c', 'd'],
					correctAnswer: 'c',
				},
				{
					name: 'question2',
					type: 'True-False',
					correctAnswer: true,
				},
			],
		};
		const { body, statusCode } = await request(server)
			.post('/api/createQuiz')
			.send(requestBody);

		expect(statusCode).toBe(200);
		expect(body.data).toEqual(
			expect.objectContaining({
				title: expect.any(String),
				questions: expect.arrayContaining([
					expect.objectContaining({
						name: expect.any(String),
						type: expect.any(String),
						answers: expect.any(Array),
						correctAnswer: expect.any(String),
					}),
					expect.objectContaining({
						name: expect.any(String),
						type: expect.any(String),
						correctAnswer: expect.any(Boolean),
					}),
				]),
			})
		);
		const result = await QuizModel.findById(body.data._id);
		expect(body.data._id).toEqual(result._id.toString());
	});
	it('should return status 400 if req.body does not match mongoose doc - FAILED -', async () => {
		const { body, statusCode } = await request(server)
			.post('/api/createQuiz')
			.send({});

		expect(statusCode).toBe(400);
		expect(body).toEqual(
			expect.objectContaining({
				error: expect.any(String),
			})
		);
	});
});
