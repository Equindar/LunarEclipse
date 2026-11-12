export class UserNotActiveError extends Error {
  constructor() {
    super("The user account is not active.");
    this.name = "UserNotActiveError";
  }
}
