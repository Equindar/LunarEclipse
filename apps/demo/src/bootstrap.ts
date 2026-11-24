import { AppError } from './errors/AppError.js';
import { initialize } from './lifecycle/initialize.js';

async function bootstrap() {
  try {
    const {
      app,
      configuration,
      logger,
    } = await initialize();

    const { serve } = await import('@hono/node-server');

    serve(
      {
        fetch: app.fetch,
        port: configuration.app.port,
      },
      (info) => {
        logger.info(
          `${configuration.app.name} listening on port ${info.port}`,
        );

        logger.info(`URL: http://localhost:${info.port}`);
      },
    );
  } catch (error) {
    if (error instanceof AppError) {
      console.error(`[Startup Error] ${error.message}`);

      if ('issues' in error && Array.isArray(error.issues)) {
        for (const issue of error.issues) {
          console.error(`- ${issue}`);
        }
      }
    } else {
      console.error('[Unexpected Startup Error]', error);
    }

    process.exitCode = 1;
  }
}

bootstrap();
