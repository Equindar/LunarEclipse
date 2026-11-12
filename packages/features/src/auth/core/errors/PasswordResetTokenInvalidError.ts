export class PasswordResetTokenInvalidError extends Error {
  constructor() {
    super("The password reset token is invalid or expired.");
    this.name = "PasswordResetTokenInvalidError";
  }
}
