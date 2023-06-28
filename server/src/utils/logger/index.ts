// import { format, createLogger, transports } from 'winston';
// const { timestamp, combine, printf, errors } = format;

// // dev logger
// function buildLogger() {
//     const logFormat = printf(({ level, message, timestamp, stack }) => {
//         return `${timestamp} ${level}: ${stack || message}`;
//     });

//     return createLogger({
//         format: combine(
//             format.colorize(),
//             timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//             errors({ stack: true }),
//             logFormat,
//         ),
//         transports: [new transports.Console()],
//     });
// }

// const logger = buildLogger();

// export default logger;
