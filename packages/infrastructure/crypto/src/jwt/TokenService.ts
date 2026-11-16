
import { sign, verify } from 'hono/jwt';
import { createHash } from 'node:crypto';

import type {
    AccessTokenClaims,
    RefreshTokenClaims,
    TokenPair,
    TokenPayload,
    TokenService,
} from '@lunareclipse/features/auth';

import { Clock } from '../types/Clock.js';
import {
    TOKEN_AUDIENCE,
    TOKEN_EXPIRATION,
    TOKEN_ISSUER,
} from './TokenService.config.js';

type JwtAlgorithm = 'HS256' | 'HS384' | 'HS512';

export interface JwtTokenServiceOptions {
  accessSecret: string;
  refreshSecret: string;
  algorithm: JwtAlgorithm;
}

interface JwtPayload {
  [key: string]: unknown;

  sub: string;
  tokenType: 'access' | 'refresh';
  iss: string;
  aud: string;
  iat: number;
  exp: number;
  jti?: string;
}

export class JSONWebTokenService implements TokenService {

  constructor(
    private readonly options: JwtTokenServiceOptions,
    private readonly clock: Clock,
  ) {
    this.validateOptions();
  }

  async createTokenPair(
    payload: TokenPayload,
  ): Promise<TokenPair> {

    const now = Math.floor(this.clock.now().getTime() / 1000);

    const accessTokenExpiresIn = TOKEN_EXPIRATION.ACCESS;
    const refreshTokenExpiresIn = TOKEN_EXPIRATION.REFRESH;

    const accessPayload: JwtPayload = {
      sub: payload.userId,
      tokenType: 'access',
      iss: TOKEN_ISSUER,
      aud: TOKEN_AUDIENCE,
      iat: now,
      exp: now + accessTokenExpiresIn,
    };

    const refreshPayload: JwtPayload = {
      sub: payload.userId,
      jti: payload.sessionId,
      tokenType: 'refresh',
      iss: TOKEN_ISSUER,
      aud: TOKEN_AUDIENCE,
      iat: now,
      exp: now + refreshTokenExpiresIn,
    };

    const [accessToken, refreshToken] = await Promise.all([
      sign(
        accessPayload,
        this.options.accessSecret,
        this.options.algorithm,
      ),
      sign(
        refreshPayload,
        this.options.refreshSecret,
        this.options.algorithm,
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    };
  }

  async verifyAccessToken(
    token: string,
  ): Promise<AccessTokenClaims | null> {

    try {
      const payload = await verify(
        token,
        this.options.accessSecret,
        {
          alg: this.options.algorithm,
          iss: TOKEN_ISSUER,
          aud: TOKEN_AUDIENCE,
        },
      );

      if (
        payload.tokenType !== 'access' ||
        typeof payload.sub !== 'string'
      ) {
        return null;
      }

      return {
        userId: payload.sub,
        sessionId: payload.jti as string ?? '',
      };
    } catch {
      return null;
    }
  }

  async verifyRefreshToken(
    token: string,
  ): Promise<RefreshTokenClaims | null> {

    try {
      const payload = await verify(
        token,
        this.options.refreshSecret,
        {
          alg: this.options.algorithm,
          iss: TOKEN_ISSUER,
          aud: TOKEN_AUDIENCE,
        },
      );

      if (
        payload.tokenType !== 'refresh' ||
        typeof payload.sub !== 'string' ||
        typeof payload.jti !== 'string'
      ) {
        return null;
      }

      return {
        userId: payload.sub,
        sessionId: payload.jti,
      };
    } catch {
      return null;
    }
  }

  hashToken(token: string): string {
    return createHash('sha256')
      .update(token)
      .digest('hex');
  }

  private validateOptions(): void {
    const { accessSecret, refreshSecret } = this.options;

    if (accessSecret.length < 32) {
      throw new Error(
        'AUTH_ACCESS_SECRET must be at least 32 characters long.',
      );
    }

    if (refreshSecret.length < 32) {
      throw new Error(
        'AUTH_REFRESH_SECRET must be at least 32 characters long.',
      );
    }

    if (accessSecret === refreshSecret) {
      throw new Error(
        'Access and refresh secrets must be different.',
      );
    }
  }
}
