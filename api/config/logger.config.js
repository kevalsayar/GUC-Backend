/**
 * @module LoggerConfig
 * 
 * @description Logger configurations using Winston.
 */

const winston = require("winston"),
  {
    TIME_FORMAT,
    MAX_SIZE,
    LOGGER_ERROR_PATH,
    LOGGER_COMBINED_PATH,
  } = require("./env"),
  path = require("path");
require("winston-daily-rotate-file");

const combineFileTransport = new winston.transports.DailyRotateFile({
  filename: "%DATE%.log",
  dirname: path.join(process.cwd(), LOGGER_COMBINED_PATH),
  datePattern: TIME_FORMAT,
  maxSize: MAX_SIZE,
});

const errorFileTransport = new winston.transports.DailyRotateFile({
  filename: "%DATE%.log",
  dirname: path.join(process.cwd(), LOGGER_ERROR_PATH),
  level: "error",
  datePattern: TIME_FORMAT,
  maxSize: MAX_SIZE,
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    winston.format.prettyPrint()
  ),
  transports: [combineFileTransport, errorFileTransport],
});

if (process.env.NODE_ENV.trim() !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.json(),
    })
  );
}

module.exports = {
  logger,
};
