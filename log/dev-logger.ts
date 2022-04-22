import { createLogger, format, transports } from 'winston';
const { combine, timestamp, colorize, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
	return `${level}: ${message}: {${timestamp}}`;
});

const logger = createLogger({
	format: combine(
		colorize(),
		timestamp({ format: 'YYYY-MM-DD HH:mm' }),
		myFormat
	),
	transports: [new transports.Console()],
});

export default logger;
