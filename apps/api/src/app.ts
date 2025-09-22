import express from 'express';
import logger from './utils/apiLogger';
import router from './routes';
import configuration from './config';
import morganMiddleware from './middlewares/morganMiddleware';
import { apiVersion } from './types/common';
import { apiVersionMiddleware } from './middlewares/apiVersionMiddleware';

// --- Init
const app = express();

const supportedVersions: apiVersion = ["1.0"];

try {
    logger.info(`'${configuration.app.name}' wurde gestartet.`);

    // --- Routing
    // Middlewares
    // app.use(apiVersionMiddleware(supportedVersions));
    app.use(morganMiddleware);
    // Router
    app.use(router);
    // Error Handling Middleware
    app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
        logger.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    });



} catch (error) {
    logger.error("Start fehlgeschlagen", error);
}

export default app;
