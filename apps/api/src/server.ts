import dotenv from 'dotenv';
import logger from './utils/apiLogger';
import app from './app';

// --- Init
dotenv.config();
const { PORT } = process.env;

if (!PORT) {
  throw new Error('Missing enviroment variables');
}

app.listen(PORT, () => {
  logger.info(`'Server running on http://localhost:${PORT}`);
});

logger.debug(`detected env: ${process.env.NODE_ENV}`);
logger.info(`logger assigned level: ${logger.level}`);

// --- Error-Handling: unhandled Rejection/Exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
