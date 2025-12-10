import dotenv from 'dotenv';
import Api from './app';
import logger from './utils/apiLogger';


async function server() {
  // --- Init
  dotenv.config();
  const { PORT, API_NAME } = process.env;

  if (!PORT || !API_NAME) {
    throw new Error('Missing enviroment variables');
  }

  logger.debug(`detected env: ${process.env.NODE_ENV}`);
  logger.info(`Logger assigned level: ${logger.level}`);

  // Start API
  const app = new Api(API_NAME);
  await app.connectDataBase();
  app.init();

  // Mapping to Port
  app!.listen(parseInt(PORT));

  // --- Error-Handling: unhandled Rejection/Exceptions
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
  });

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
  });
}

server();

