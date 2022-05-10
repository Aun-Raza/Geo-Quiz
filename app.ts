import express from 'express';
import 'express-async-errors';
import router from './routes/index';
import MongoDB from './config/connect';
import { transports } from 'winston';
import config from 'config';
import log from './log';

let { NODE_ENV } = process.env;
NODE_ENV = 'test';

const console = new transports.Console();

if (NODE_ENV === 'test') {
	console.silent = true;
	log.add(console);
} else if (NODE_ENV === 'development') {
	MongoDB();
	log.add(console);
}

const app = express();

app.use(express.json());

app.use(router);

const server = app.listen(config.get('PORT'), () => {
	log.info(`App listening on port: ${8080}`);
});

export default server;
