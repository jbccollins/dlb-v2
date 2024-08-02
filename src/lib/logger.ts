import pino from 'pino';
import pretty from 'pino-pretty';

export default function createLogger(logContext: string) {
  const isProduction = process.env.NODE_ENV === 'production';

  const logger = pino({
    level: 'info',
    base: { context: logContext },
    timestamp: pino.stdTimeFunctions.isoTime,
  }, isProduction ? undefined : pretty({
    colorize: true,
    translateTime: 'SYS:standard',
    ignore: 'pid,hostname'
  }));

  return logger;
}