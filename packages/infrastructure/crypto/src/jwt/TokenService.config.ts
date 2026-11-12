export const TOKEN_EXPIRATION = {
  ACCESS: 15 * 60,
  REFRESH: 30 * 24 * 60 * 60,
} as const;

export const TOKEN_ISSUER = 'lunareclipse-api';

export const TOKEN_AUDIENCE = 'lunareclipse';
