import type { NextFunction, Request, Response } from 'express';
import logger from '../utils/apiLogger';
import configuration from '../config';
import getErrorMessage from '../utils/getErrorMessage';
import CustomError from '../types/customError';
import Joi from 'joi';
import UnsupportedApiVersionError from '../errors/UnsupportedAPIVersion';

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

  if (Joi.isError(error)) {
    const validationError: ValidationError = {
      error: {
        message: "Validation Error",
        code: "ERR_VALID",
        errors: error.details.map((item) => ({
          message: item.message,
        })),
      }
    };
    logger.debug("validation error found");
    // res.status(422).json(validationError);
    throw new UnsupportedApiVersionError({
      message: 'Invalid X-API-Version header format',
      statusCode: 400,
      code: 'ERR_API'
    });
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

  res.status(500).json({
    error: {
      message:
        getErrorMessage(error) ||
        'Ooops, an error occurred. Please view the logs for more details.',
    },
  });
}
