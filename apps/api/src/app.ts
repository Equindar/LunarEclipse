import express from 'express';
import cors from 'cors';
import extractVersion from './middlewares/extractVersion';
import logRequests from './middlewares/logRequests';
import handleErrors from './middlewares/handleErrors';
import logger from './utils/apiLogger';
import { v1Strategy } from './strategies/v1Strategy';
import { v2Strategy } from './strategies/v2Strategy';
import apiRouter from './routes';

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
    // Strategy setup
    const router = new apiRouter();
    router.register("1", new v1Strategy());
    router.register("2", new v2Strategy());

    app.use("/api", router.useVersion());

    // Error Handling Middleware
    app.use(handleErrors);

    return app;
  } catch (error) {
    logger.error('Start fehlgeschlagen', error);
  }

}
