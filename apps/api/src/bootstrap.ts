import { ApiError } from './errors/ApiError.js';

async function bootstrap() {
  try {
    // 1. Konfiguration laden und validieren
    const { default: configuration } = await import('./config/index.js');

    // 2. Infrastruktur laden
    const [{ default: logger }, { default: api }] = await Promise.all([
      import('./utils/logger.js'),
      import('./api.js'),
    ]);

    // 3. HTTP-Server starten
    const { serve } = await import('@hono/node-server');

    serve(
      {
        fetch: api.fetch,
        port: configuration.app.port,
      },
      (info) => {
        logger.info(
          `${configuration.app.name} listening on port ${info.port}`
        );
        logger.info(
          `URL: http://localhost:${info.port}`
        );

      }
    );

  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`[Startup Error] ${error.message}`);

      if ('issues' in error && Array.isArray(error.issues)) {
        for (const issue of error.issues) {
          console.error(`- ${issue}`);
        }
      }
    } else {
      console.error('[Unexpected Startup Error]', error);
    }

    process.exit(1);
  }
}

bootstrap();
