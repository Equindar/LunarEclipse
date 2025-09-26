import express from 'express';
import router from './routes';
import cors from 'cors';
import extractVersion from './middlewares/extractVersion';
import logRequests from './middlewares/logRequests';
import handleErrors from './middlewares/handleErrors';
import logger from './utils/apiLogger';

export default function createApi(app_name: string) {

  try {
    // --- Init
    const app = express();
    logger.info(`'${app_name}' wurde gestartet.`);

    app.disable('x-powered-by');


    // --- Routing
    // Middlewares
    app
      .use(express.urlencoded({ extended: true }))
      .use(express.json())
      .use(cors())
      .use(extractVersion('1'))
      .use(logRequests);

    // Router
    app.use('/api', router);

    // Error Handling Middleware
    app.use(handleErrors);

    return app;
  } catch (error) {
    logger.error('Start fehlgeschlagen', error);
  }

}
