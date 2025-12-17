import jwt from 'jsonwebtoken';
import configuration from '../config';
import { Request, Response, NextFunction } from 'express';
import AuthenticationError from '../errors/AuthenticationError';
import logger from '../utils/apiLogger';

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  logger.debug("Middleware: authenticateUser.ts");
  logger.debug(req.headers.authorization);

  const authHeader = req.headers.authorization;

  // Check AuthHeader information
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthenticationError({
      message: "Authorization header missing or malformed",
      statusCode: 401,
      code: "ERR_AUTH",
    });
  }

  // Extract AuthHeader information
  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    configuration.auth.accessTokenSecret,
    (error, decoded) => {
      if (error)
        throw new AuthenticationError({
          message: "You are not authorized to perform this operation",
          statusCode: 403,
          code: "ERR_AUTH",
        });
      logger.debug(req.auth)
      logger.debug(decoded);
      next();
    });
};

export default authenticateUser;
