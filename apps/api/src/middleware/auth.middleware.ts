
import { createFactory } from 'hono/factory';
import { jwt } from 'hono/jwt';
import configuration from '../config';

const factory = createFactory();

const authMiddleware = factory.createMiddleware(async (c, next) => {
    const verifyJwt = jwt({
      secret: configuration.auth.secret!,
      alg: configuration.auth.algorithm,
    });

    // // Hono übernimmt Signatur- und Ablaufprüfung
    // await verifyJwt(c, async () => {
    //   const payload = c.get('jwtPayload');

    //   // Eigene Claims validieren
    //   if (
    //     typeof payload.sub !== 'string' ||
    //     typeof payload.username !== 'string' ||
    //     payload.tokenType !== 'access'
    //   ) {
    //     return c.json(
    //       {
    //         error: 'Unauthorized',
    //         message: 'Invalid token claims',
    //       },
    //       401
    //     );
    //   }

    //   const auth: AuthClaims = {
    //     sub: payload.sub,
    //     username: payload.username,
    //     tokenType: 'access',
    //   };

    //   c.set('auth', auth);

      await next();
    });

export default authMiddleware;
