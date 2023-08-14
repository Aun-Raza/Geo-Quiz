/* eslint-disable linebreak-style */
import mongoose from 'mongoose';
import log from '../src/log/logger';
import dotenv from 'dotenv';
dotenv.config();

export default async function run() {
  try {
    console.log(process.env.PORT);
    await mongoose.connect(process.env.DB_URI, { dbName: 'js_quiz' });
    log.info('Connected to MongoDB', { service: 'MongoDB' });
  } catch (error) {
    log.error(error.msg, { service: 'MongoDb' });
  }
}
