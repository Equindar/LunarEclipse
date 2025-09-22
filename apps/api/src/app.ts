import express from 'express';
import logger from './utils/apiLogger';
import router from './routes';
import dotenv from 'dotenv';
import morganMiddleware from './middlewares/morganMiddleware';

// --- Init
dotenv.config();
const app = express();

try {
    const { API_NAME } = process.env;

    logger.info(`'${API_NAME}' wurde gestartet.`);

    app.use(morganMiddleware);
    app.use(router);

    app.get('/', async (_req, res) => {
        res.json({ hello: 'world' });
    });

} catch (error) {
    logger.error("Start fehlgeschlagen", error);
}

export default app;
