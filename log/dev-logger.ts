import { createLogger, format, transports } from 'winston';
const { combine, timestamp, colorize, printf } = format;

const myFormat = printf(({ level, message, timestamp, service }) => {
	return `${level}: {service: ${service}} ${message}: {${timestamp}}`;
});

const logger = createLogger({
	defaultMeta: { service: 'index' },
	format: combine(
		colorize(),
		timestamp({ format: 'YYYY-MM-DD HH:mm' }),
		myFormat
	),
});

export default logger;
