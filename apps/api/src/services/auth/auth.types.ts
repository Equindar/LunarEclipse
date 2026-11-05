export interface AuthClaims {
  sub: string;
  username: string;
  tokenType: 'access';
}

export type AppEnv = {
  Variables: {
    auth: AuthClaims;
  };
};
