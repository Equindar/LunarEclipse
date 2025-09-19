import Logger from './core/Logger';
import { port, environment } from './config';
import app from './app';

Logger.debug(`detected env: ${process.env.NODE_ENV}`);
Logger.debug(`set env: ${environment}`);
Logger.debug(`logger assigned level: ${Logger.level}`);

/**
 * @summary Just another API you can talk to.
 */
app
  .listen(3001, () => {
    Logger.info(`server running on port: ${port}`);
  })
  .on('error', (e) => {
    Logger.error(e);
  });
