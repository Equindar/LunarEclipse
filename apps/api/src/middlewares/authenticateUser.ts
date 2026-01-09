import jwt, { JwtPayload } from 'jsonwebtoken';
import configuration from '../config';
import { Request, Response, NextFunction } from 'express';
import AuthenticationError from '../errors/AuthenticationError';
import { JWTPayload } from 'express-oauth2-jwt-bearer';

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader.startsWith("Bearer ")) {
    throw new AuthenticationError({
      message: "Authorization header missing or malformed",
      statusCode: 401,
      code: "ERR_AUTH",
    });
  }

  // Extract AuthHeader information
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, configuration.app.secret! as jwt.Secret);
    if (typeof decoded === "string" || !("payload" in decoded)) {
      throw new AuthenticationError({
        message: "JwtPayload incorrect",
        statusCode: 401,
        code: "ERR_AUTH",
      });
    }

    req.auth = {
      payload: decoded.payload as JwtPayload,
      token,
    };
    next();
  } catch (error) {
    throw new AuthenticationError({
      message: "You are not authorized to perform this operation",
      statusCode: 403,
      code: "ERR_AUTH",
    })
  }
};

export default authenticateUser;
