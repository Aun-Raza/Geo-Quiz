import app from '../../../app';
// PLACEHOLDER import { UserModel } from '../../../model/user';
import mongoose from 'mongoose';
import config from 'config';
import request from 'supertest';

describe('GET /api/getUsers', () => {
	const apiEndPoint = '/api/getUsers';
	it('should return status 404 if result is empty', async () => {
		const { body, statusCode } = await request(app).get(apiEndPoint);

		expect(statusCode).toBe(404);
		expect(body).toHaveProperty('error');
	});
	// it('should return status 200 if result is not empty', async () => {
	// 	const doc = new UserModel(request_body);
	// 	await doc.save();

	// 	const { body, statusCode } = await request(app).get(apiEndPoint);

	// 	expect(statusCode).toBe(200);
	// 	expect(body).toHaveProperty('data');
	// });
});

describe('GET /api/getQuiz/:id', () => {
	const apiEndPoint = '/api/getUser/';
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
	// it('should return status 200 if req.param is authenticated', async () => {
	// 	const doc = new UserModel(request_body);
	// 	await doc.save();
	// 	const { _id } = doc;

	// 	const { body, statusCode } = await request(app).get(apiEndPoint + _id);

	// 	expect(statusCode).toBe(200);
	// 	expect(body).toHaveProperty('data');
	// });
});
