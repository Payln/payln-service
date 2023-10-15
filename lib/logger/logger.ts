import winston from "winston";
import { blue, red, yellow } from "colorette";

// Define log format with Colorette colorization
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
	let colorizedMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;

	// Apply Colorette colors based on log level
	switch (level) {
	case "info":
		colorizedMessage = blue(colorizedMessage); // Use blue for info level
		break;
	case "error":
		colorizedMessage = red(colorizedMessage); // Use red for error level
		break;
	case "warn":
		colorizedMessage = yellow(colorizedMessage); // Use yellow for warn level
		break;
	default:
		break;
	}

	return colorizedMessage;
});

// Configure Winston logger
const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(
		winston.format.timestamp(),
		logFormat
	),
	transports: [
		new winston.transports.Console(),
	],
});

export default logger;
