import express from 'express';
import router from './routes';
import extractVersion from './middlewares/extractVersion';
import logRequests from './middlewares/logRequests';
import handleErrors from './middlewares/handleErrors';
import logger from './utils/apiLogger';

export default function createApi(app_name: string) {
  // --- Init
  const app = express();

  try {
    logger.info(`'${app_name}' wurde gestartet.`);

    // --- Routing
    // Middlewares
    app.use(extractVersion('1'));
    app.use(logRequests);

    // Router
    app.use('/api', router);

    // Error Handling Middleware
    app.use(handleErrors);
  } catch (error) {
    logger.error('Start fehlgeschlagen', error);
  }

  return app;
}
