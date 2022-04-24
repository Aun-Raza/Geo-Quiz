import express from 'express';
import router from './routes/index';
import winston from 'winston';
import logger from './log/dev-logger';

let { NODE_ENV } = process.env;
NODE_ENV = 'testing';

if (NODE_ENV === 'testing') {
	const console = new winston.transports.Console();
	console.silent = true;
	logger.add(console);
}

const app = express();

app.use(router);

const server = app.listen('3000', () => {
	logger.info('App listening on port:3000', { service: 'App' });
});

export default server;
