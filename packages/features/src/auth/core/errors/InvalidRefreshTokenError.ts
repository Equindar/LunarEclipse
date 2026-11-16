export class InvalidRefreshTokenError extends Error {
  constructor() {
    super("The refresh token is invalid or expired.");
    this.name = "InvalidRefreshTokenError";
  }
}
