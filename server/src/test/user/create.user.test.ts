import app from '../../../app';
import config from 'config';
import mongoose from 'mongoose';
import request from 'supertest';
import { UserModel } from '../../model/user/model.user';
import { User } from './User';

// Basic App & DB Setup
beforeAll(async () => {
  await mongoose.connect(config.get('DB_URI'));
});

afterAll(async () => {
  await UserModel.deleteMany({});
  await mongoose.connection.close();
  await app.close();
});

beforeEach(async () => {
  await UserModel.deleteMany({});
});

async function exec() {
  return await request(app).post(apiEndPoint).send(reqBody);
}

// Global Variables
let apiEndPoint: string;
let reqBody: User | { username: string; password: string } | null;

describe('POST /api/registerUser', () => {
  beforeEach(() => {
    apiEndPoint = '/api/registerUser';
    reqBody = new User();
  });
  it('should return status 400, and error property if req.body is invalid', async () => {
    reqBody = null;

    const { statusCode, body } = await exec();

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty('error');
  });
  it('should return status 400, error property, and not be saved if user is already registered', async () => {
    const { username } = await User.saveUser();

    const { statusCode, body } = await exec();

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty('error');

    const res = await UserModel.find({ username });
    expect(res).toHaveLength(1);
  });
  it('should return status 201, data property, auth-token, and be saved if req.body is valid', async () => {
    const { statusCode, body, headers } = await exec();

    expect(statusCode).toBe(201);
    expect(Object.keys(body)).toEqual(
      expect.arrayContaining(['_id', 'email', 'username'])
    );
    expect(body).not.toHaveProperty('password');
    expect(headers['x-auth-token']).not.toBeNull();

    const res = await UserModel.findById(body._id);
    expect(res).not.toBeNull();
    expect(res.hash).not.toEqual(reqBody.password);
  });
});

describe('POST /api/loginUser', () => {
  beforeEach(async () => {
    apiEndPoint = '/api/loginUser';
    reqBody = { username: 'john doe', password: 'password' };
    await User.saveUser();
  });
  it('should return status 400, and error property if username is incorrect', async () => {
    delete reqBody.username;

    const { statusCode, body } = await exec();

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty('error');
  });
  it('should return status 400, and error property if password is incorrect', async () => {
    delete reqBody.password;

    const { statusCode, body } = await exec();

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty('error');
  });
  it('should return status 200, auth-token, and msg property if username & password is correct', async () => {
    const { statusCode, body, headers } = await exec();

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('msg');
    expect(headers['x-auth-token']).not.toBeNull();
  });
});
