const winston = require("winston");
const { combine, timestamp, printf, colorize, align, json } = winston.format;

export const logger = winston.createLogger({});

// Customizing error format
logger.add(new winston.transports.Console({
    level: 'error',
    format: combine(
        colorize({ all: true }),
        timestamp({
            format: 'DD-MM-YYYY hh:mm:ss.SSS A',
        }),
        align(),
        printf((info: any) => `\n[ERROR] [${info.timestamp}] ${info.level}: ${info?.message}\nerror details: ${String(info?.error?.stack)}`)
    )
}));


