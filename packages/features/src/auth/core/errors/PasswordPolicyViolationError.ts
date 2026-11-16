export class PasswordPolicyViolationError extends Error {
  constructor(reason: string) {
    super(`The password does not meet the requirements: ${reason}`);
    this.name = "PasswordPolicyViolationError";
  }
}
