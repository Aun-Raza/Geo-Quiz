import app from '../../../app';
import config from 'config';
import mongoose from 'mongoose';
import request from 'supertest';
import { User, IUser } from './User';
import { UserModel } from '../../model/user/model.user';

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
  return await request(app)
    .put(apiEndPoint)
    .set('x-auth-token', token)
    .send(reqBody);
}

// Global Variables
let apiEndPoint: string;
let reqBody: User | null;
let savedUser: IUser;
let token: string;

describe('PUT /api/updateUser/:id', () => {
  beforeEach(async () => {
    apiEndPoint = '/api/updateUser/';
    reqBody = new User();
    savedUser = await User.saveUser();
    token = User.getSignedToken(savedUser);
  });
  it('should return status 400, and error property if req.param is not an ObjectId', async () => {
    apiEndPoint += 1;

    const { statusCode, body } = await exec();

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty('error');
  });
  it('should return status 401, and error property if auth-token is not provided', async () => {
    apiEndPoint += savedUser._id;
    token = null;

    const { statusCode, body } = await exec();

    expect(statusCode).toBe(401);
    expect(body).toHaveProperty('error');
  });
  it('should return status 404, and error property if req.param.id is not authenticated', async () => {
    const _id = new mongoose.Types.ObjectId().toString();
    apiEndPoint += _id;

    const { statusCode, body } = await exec();

    expect(statusCode).toBe(401);
    expect(body).toHaveProperty('error');
  });
  it('should return status 400, and error property if req.body is invalid', async () => {
    apiEndPoint += savedUser._id;
    reqBody = null;

    const { statusCode, body } = await exec();

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty('error');
  });
  it('should return status 201, and data property, and be saved if req.body is valid', async () => {
    apiEndPoint += savedUser._id;
    reqBody.username = 'jane doe';

    const { statusCode, body } = await exec();

    expect(statusCode).toBe(201);
    expect(body).not.toHaveProperty('error');

    const res = await UserModel.findById(savedUser._id);
    expect(res.username).toBe('jane doe');
  });
});
