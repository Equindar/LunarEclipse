export type CompletePasswordResetResult =
  | "reset"
  | "invalid"
  | "expired"
  | "already-used";

export interface PasswordResetRepository {
  createReplacingActive(input: {
    userId: number;
    tokenHash: string;
    expiresAt: Date;
    createdAt: Date;
  }): Promise<void>;

  complete(input: {
    tokenHash: string;
    newPasswordHash: string;
    passwordAlgorithm: "argon2id";
    now: Date;
  }): Promise<CompletePasswordResetResult>;
}
