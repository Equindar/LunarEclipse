export class SessionNotFoundError extends Error {
  constructor() {
    super("The requested session could not be found.");
    this.name = "SessionNotFoundError";
  }
}
