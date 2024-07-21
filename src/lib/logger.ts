import winston, { LogCallback, LogEntry, Logger } from 'winston';
import Transport, { TransportStreamOptions } from 'winston-transport';

// Custom transport class that keeps track of the last 1000 log entries
// This is used to dump the log history into an error report
class HistoryTransport extends Transport { // Correctly extend Transport from 'winston-transport'
  history: any[];
  maxSize: number;

  constructor(opts: TransportStreamOptions) {
    super(opts);
    this.history = []; // Initialize history stack
    this.maxSize = 1000; // Maximum size of the history stack
  }

  log(info: LogEntry, callback: LogCallback) {
    // Add log entry to history
    this.history.push(info);

    // Ensure history does not exceed maxSize
    if (this.history.length > this.maxSize) {
      this.history.shift(); // Remove the oldest entry
    }

    // Perform the logging action
    setImmediate(() => {
      this.emit('logged', info);
    });

    // Callback when done
    if (callback) {
      callback();
    }
  }

  // Method to get the history
  getHistory() {
    return this.history;
  }

  // Pretty print the history
  prettyPrintHistory() {
    const messageSymbol = Symbol.for('message');
    return this.history.map(entry => entry[messageSymbol]);
  }
}

const historyTransport = new HistoryTransport({ level: 'info' });

export default function createLogger(logContext: string): Logger {

  const customFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: [${logContext}] ${message}`;
  })

  // Create a new logger instance for each logContext
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json(),
      customFormat
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          customFormat
        ),
      }),
      historyTransport,
      // Uncomment or modify the file transport as needed
      // new winston.transports.File({ filename: 'combined.log' })
    ],
  });

  return logger;
}

export { historyTransport };
