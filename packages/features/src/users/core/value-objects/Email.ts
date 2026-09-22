import { InvalidEmailError } from '../errors/InvalidEmailError';

// --- Branded Type for Email
// to ensure type safety and prevent accidental mixing with other string types.
declare const brand: unique symbol;
export type Email = string & { readonly [brand]: 'Email' };

// Regular expression pattern for validating email addresses
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function asEmail(value: string): Email {
  const normalized = value.trim().toLowerCase();

  if (!EMAIL_PATTERN.test(normalized)) {
    throw new InvalidEmailError(value);
  }

  return normalized as Email;
}

export function isEmail(value: string): value is Email {
  return EMAIL_PATTERN.test(value.trim().toLowerCase());
}
