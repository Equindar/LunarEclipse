export interface TokenPayload {
  userId: string;
  sessionId: string;
}

export interface AccessTokenClaims {
  userId: string;
  sessionId: string;
}

export interface RefreshTokenClaims {
  userId: string;
  sessionId: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export interface TokenService {
  createTokenPair(payload: TokenPayload): Promise<TokenPair>;

  verifyAccessToken(
    token: string,
  ): Promise<AccessTokenClaims | null>;

  verifyRefreshToken(
    token: string,
  ): Promise<RefreshTokenClaims | null>;

  hashToken(token: string): string;
}
