import express from 'express';
import router from './routes/index';
import winston from 'winston';
import logger from './log/dev-logger';

if (process.env.NODE_ENV === 'production') {
	const console = new winston.transports.Console();
	logger.add(console);
}

const app = express();

app.use(router);

app.listen('3000', () => {
	logger.info('App listening on port:3000', { service: 'App' });
});
