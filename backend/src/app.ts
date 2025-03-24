import express, { Request, Response, NextFunction } from 'express';
import Logger from './core/Logger';
import cors from 'cors';
import routes from './routes';
import loggingMiddleware from './middlewares/LogMiddleware';

// process.on('uncaughtException', (e) => {
//   Logger.error(e);
// });

const app = express();

app.use(cors({ origin: process.env.CORS_URL, optionsSuccessStatus: 200 }));
app.use(loggingMiddleware);

// Routes
app.use('/', routes);

app.get('/', (request: Request, response: Response) => {
  response.send(request.query);
  Logger.info("here!");
});

export default app;
