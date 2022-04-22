import express from 'express';
import logger from './log/dev-logger';

const app = express();

app.listen('3000', () => {
	logger.info('App listening on port:3000');
});
