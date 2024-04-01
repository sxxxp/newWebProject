import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";
const { combine, timestamp, printf, colorize } = winston.format;

const logDir = "logs";
const logFormat = printf((info) => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    logFormat
  ),
  transports: [
    new winstonDaily({
      level: "info",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/info",
      filename: `%DATE%.log`,
      maxFiles: 7,
      zippedArchive: true,
    }),

    new winstonDaily({
      level: "warn",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/warn",
      filename: `%DATE%.warn.log`,
      maxFiles: 7,
      zippedArchive: true,
    }),
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/error",
      filename: `%DATE%.error.log`,
      maxFiles: 14,
      zippedArchive: true,
    }),
  ],
});
const stream = {
  write: (message: string) => {
    logger.info(message);
  },
};
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize({ all: true }), logFormat),
    })
  );
}
export default stream;
