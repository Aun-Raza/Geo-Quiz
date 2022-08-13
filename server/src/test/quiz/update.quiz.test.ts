import app from '../../../app';
import config from 'config';
import mongoose from 'mongoose';
import request from 'supertest';
import { QuizModel } from '../../model/quiz/model.quiz';
import { Quiz, IQuiz } from './Quiz';
import { User } from '../user/User';
import { UserModel } from '../../model/user/model.user';

// Basic App & DB Setup
beforeAll(async () => {
  await mongoose.connect(config.get('DB_URI'));
});

afterAll(async () => {
  await QuizModel.deleteMany();
  await UserModel.deleteMany();
  await mongoose.connection.close();
  await app.close();
});

beforeEach(async () => {
  await QuizModel.deleteMany();
  await UserModel.deleteMany();
});

async function exec() {
  return await request(app)
    .put(apiEndPoint)
    .set('x-auth-token', token)
    .send(reqBody);
}

// Global Variables
let apiEndPoint: string;
let reqBody: Quiz | null;
let savedQuiz: IQuiz;
let token: string;

describe('PUT /api/updateQuiz/:id', () => {
  beforeEach(async () => {
    apiEndPoint = '/api/updateQuiz/';
    reqBody = new Quiz();
    savedQuiz = await Quiz.saveQuiz();
    token = User.getSignedToken(await User.saveUser());
  });
  it('should return status 401 if auth-token is not provided', async () => {
    apiEndPoint += savedQuiz._id;
    token = null;

    const { body, statusCode } = await exec();

    expect(statusCode).toBe(401);
    expect(body).toHaveProperty('error');
  });
  it('should return status 400, and error property if req.param is not a ObjectID', async () => {
    apiEndPoint += 1;

    const { body, statusCode } = await exec();

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty('error');
  });
  it('should return status 404, and error property if req.param is not authenticated', async () => {
    const _id = new mongoose.Types.ObjectId().toString();
    apiEndPoint += _id;

    const { body, statusCode } = await exec();

    expect(statusCode).toBe(404);
    expect(body).toHaveProperty('error');
  });
  it('should return status 400, and error property if req.body is invalid', async () => {
    apiEndPoint += savedQuiz._id;
    reqBody = null;

    const { body, statusCode } = await exec();

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty('error');
  });
  it('should return status 201, and data property, and be saved if req.body is valid', async () => {
    apiEndPoint += savedQuiz._id;
    reqBody.title = 'quiz 1 updated';

    const { body, statusCode } = await exec();

    expect(statusCode).toBe(201);

    expect(Object.keys(body)).toEqual(
      expect.arrayContaining(['title', 'questions'])
    );
    expect(body.title).toEqual(reqBody.title);

    const { title } = await QuizModel.findById(savedQuiz._id);
    expect(title).toEqual(reqBody.title);
  });
});
