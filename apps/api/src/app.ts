import express, { Application, Router } from 'express';
import cors from 'cors';
import extractVersion from './middlewares/extractVersion';
import logRequests from './middlewares/logRequests';
import handleErrors from './middlewares/handleErrors';
import logger from './utils/apiLogger';
import { v1Strategy } from './strategies/v1Strategy';
import { v2Strategy } from './strategies/v2Strategy';
import apiRouter from './routes';
import createDrizzleClient from '@infrastructure/database/client';

export type Database = Awaited<ReturnType<typeof createDrizzleClient>>;

export default class Api {
  public readonly name: string;
  public readonly app: Application;
  public database: Database | null = null;

  // --- Init
  constructor(name: string) {
    this.name = name;
    // Express Instance
    this.app = express();
  }

  public async connectDataBase() {
    this.database = await createDrizzleClient();
  }

  public init() {
    // --- Settings
    this.app.disable('x-powered-by');

    // --- Routing
    // Middlewares
    this.app
      .use(express.urlencoded({ extended: true }))
      .use(express.json())
      .use(cors())
      .use(extractVersion('1'))
      .use(logRequests)
      .use(express.static('./src/public'));


    // Router
    // Strategy setup
    const router = new apiRouter();
    if (this.database !== null || undefined) {
      router.register("1", new v1Strategy(this.database!));
      router.register("2", new v2Strategy());
    }

    this.app.use("/api", router.useVersion());

    // Error Handling Middleware
    this.app.use(handleErrors);
  }

  listen(port: number) {
    this.app.listen(port, () => {
      logger.info(`Server running on http://localhost:${port}`);
    })
  }

}
