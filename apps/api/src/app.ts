import express from 'express';
import logger from './utils/apiLogger';
import router from './routes';
import logRequests from './middlewares/logRequests';
import { extractVersion } from './middlewares/extractVersion';

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
        app.use(router);
        // Error Handling Middleware
        app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
            logger.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        });

    } catch (error) {
        logger.error("Start fehlgeschlagen", error);
    }

    return app;
}
