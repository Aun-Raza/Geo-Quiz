import express from 'express';
import router from './routes/index';
import db from './config/db';
import { transports } from 'winston';
import config from 'config';
import logger from './log/dev-logger';

let { NODE_ENV } = process.env;
NODE_ENV = 'test';

const console = new transports.Console();

if (NODE_ENV === 'test') {
	console.silent = true;
	logger.add(console);
} else if (NODE_ENV === 'development') {
	db();
	logger.add(console);
}

const app = express();

app.use(express.json());

app.use(router);

const server = app.listen(config.get('PORT'), () => {
	logger.info(`App listening on port: ${8080}`);
});

export default server;
