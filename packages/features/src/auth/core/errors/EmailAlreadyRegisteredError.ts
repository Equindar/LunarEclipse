export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super("An account with this email address already exists.");
    this.name = "EmailAlreadyRegisteredError";
  }
}
