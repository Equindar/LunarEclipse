// --- Branded Type for UserID
// to ensure type safety and prevent accidental mixing with other string types.
declare const brand: unique symbol;
export type UserID = string & { [brand]: 'UserID' };

export function asUserID(value: string): UserID {
  return value as UserID;
}
