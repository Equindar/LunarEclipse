import type { NextFunction, Request, Response } from 'express';
import logger from '../utils/apiLogger';
import configuration from '../config';
import getErrorMessage from '../utils/getErrorMessage';
import CustomError from '../types/customError';
import { UnauthorizedError } from 'express-oauth2-jwt-bearer';

export default function handleErrors(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent || configuration.logging.level === 'debug') {
    next(error);
    return;
  }

  if (error instanceof CustomError) {
    logger.error(error.message);
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code,
      },
    });
    return;
  }

  if (error instanceof UnauthorizedError) {
    logger.error(error.message);
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: "code" in error ? error.code : "ERR_AUTH",
      },
    });
    return;
  }

  res.status(500).json({
    error: {
      message:
        getErrorMessage(error) ||
        'Ooops, an error occurred. Please view the logs for more details.',
    },
  });
}
