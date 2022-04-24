import server from '../../app';
import request from 'supertest';

beforeAll(() => {
	server.close();
});

describe('/api/getQuizzes', () => {
	beforeEach(() => {
		server.listen();
	});
	afterEach(() => {
		server.close();
	});
	describe('GET /', () => {
		it('should return status 200', async () => {
			const result = await request(server).get('/api/getQuizzes');

			expect(result.status).toBe(200);
			expect(result.body.data).toEqual(
				expect.arrayContaining([
					expect.objectContaining({ title: 'quiz1', date: expect.any(Number) }),
					expect.objectContaining({ title: 'quiz2', date: expect.any(Number) }),
				])
			);
		});
	});
});
