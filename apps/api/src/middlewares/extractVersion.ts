import type { NextFunction, Request, Response } from 'express';
import logger from '../utils/apiLogger';
import UnsupportedApiVersionError from '../errors/UnsupportedAPIVersion';

/**
 * Middleware to extract the API version from the request headers.
 * It first checks the 'X-API-Version' header, and if it's not present,
 * it tries to extract the version from the 'Accept' header using a regex.
 * If no version is found, it defaults to the provided defaultVersion or '1'.
 *
 * @param {string} [defaultVersion='1'] - The default API version to use if none is found.
 * @returns {Function} A middleware function to handle version extraction.
 *
 * @example
 * app.use(extractVersion('2')); // Sets the default version to '2' if not provided
 */
export default function extractVersion(defaultVersion = '1') {
  return (req: Request, res: Response, next: NextFunction) => {
    let version = req.headers['x-api-version'];
    if (version && (!/^\d+$/.test(version as string) || version === '0')) {
      throw new UnsupportedApiVersionError({
        message: 'Invalid X-API-Version header format',
        statusCode: 400,
        code: 'ERR_API'
      });
    }

    if (!version) {
      const accept = req.get('accept') || '';
      const m = accept.match(/application\/vnd\.myapp\.v(\d+)\+json/);
      version = m ? m[1] : undefined;
    }
    req.apiVersion = (version as string) || defaultVersion;
    logger.debug(`[REQ] detected APIversion: v${req.apiVersion}`);
    next();
  };
}
