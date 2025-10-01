import dotenv from 'dotenv';
import createApi from './app';
import logger from './utils/apiLogger';

// --- Init
dotenv.config();
const { PORT, API_NAME } = process.env;

if (!PORT || !API_NAME) {
  throw new Error('Missing enviroment variables');
}

logger.debug(`detected env: ${process.env.NODE_ENV}`);
logger.info(`Logger assigned level: ${logger.level}`);

// Start API
const app = createApi(API_NAME);
// Mapping to Port
app!.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

// --- Error-Handling: unhandled Rejection/Exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
