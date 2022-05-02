import mongoose from 'mongoose';
import config from 'config';
import logger from '../log/dev-logger';

export default async function run() {
	try {
		await mongoose.connect(config.get('DB_URI'));
		logger.info('Connected to MongoDB', { service: 'MongoDB' });
	} catch (error) {
		logger.error(error.msg, { service: 'MongoDb' });
	}
}
