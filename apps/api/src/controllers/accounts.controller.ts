import { NextFunction, Request, Response, Router } from 'express';
import logger from '../utils/apiLogger';
import configuration from '../config';
import AuthenticationError from '../errors/AuthenticationError';
import { sign, verify } from 'jsonwebtoken';

export default class AccountsController {
  // UseCase in Feature/application
  public onLogin = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("onLogin");
    try {
      const { user, password } = req.body;
      logger.debug(req.body);

      if (!user || !password)
        throw new AuthenticationError({
          message: "Authorization header missing or malformed",
          statusCode: 400,
          code: "ERR_AUTH"
        });
      const me = user == 'Equindar' && password == 'dresden'
      if (!me)
        throw new AuthenticationError({
          message: "Authorization failed, user/password combination wrong",
          statusCode: 401,
          code: "ERR_AUTH"
        });

      const accessToken = sign(
        { "sub": user },
        configuration.auth.accessTokenSecret,
        { expiresIn: '1m' }
      );
      const refreshToken = sign(
        { "sub": user },
        configuration.auth.refreshTokenSecret,
        { expiresIn: '1d' }
      );

      // RefreshToken muss in die Datenbank wandern
      // RefreshToken wird bei Logout rausgelöscht

      // Returned accessToken wird in httpOnly Cookie gespeichert
      res.cookie('userLogin', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
      res.json({ accessToken });
    }
    catch (error) {
      next(error);
    }
  };

  public onToken = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("onToken");
    try {
      const cookies = req.cookies;
      if (!cookies?.userLogin)
        throw new AuthenticationError({
          message: "Authorization cookie missing or malformed",
          statusCode: 401,
          code: "ERR_AUTH"
        });
      logger.debug(cookies.userLogin);
      const refreshToken = cookies.userLogin;

      // RefreshToken aus der Datenbank mit User vergleichen
      const me = true;
      if (!me)
        throw new AuthenticationError({
          message: "Authorization failed, user/password combination wrong",
          statusCode: 403,
          code: "ERR_AUTH"
        });

      verify(
        refreshToken,
        configuration.auth.refreshTokenSecret,
        (error, decoded) => {
          if (error || decoded.sub !== "Equindar")
            throw new AuthenticationError({
              message: "Authorization failed, Cookie information invalid",
              statusCode: 403,
              code: "ERR_AUTH"
            });
          const accessToken = sign(
            { "sub": decoded.sub },
            configuration.auth.accessTokenSecret,
            { expiresIn: '1m' }
          )
          res.json({ accessToken });
        });
    }
    catch (error) {
      next(error);
    }
  };
}
