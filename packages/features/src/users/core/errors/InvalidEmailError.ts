export class InvalidEmailError extends Error {
  constructor(value: string) {
    super(`"${value}" is not a valid email address.`);
    this.name = 'InvalidEmailError';
  }
}
