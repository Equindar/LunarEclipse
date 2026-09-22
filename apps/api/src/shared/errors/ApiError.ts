export abstract class ApiError extends Error {
  /** true = erwarteter/"handled" Fehler, false = Programmierfehler/Bug */
  public readonly isOperational: boolean;

  constructor(message: string, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}
