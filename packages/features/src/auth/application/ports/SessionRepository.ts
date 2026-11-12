export interface CreateSessionInput {
  sessionId: string;
  userId: number;
  refreshTokenHash: string;
  expiresAt: Date;
  createdAt: Date;
}

export type RefreshRotationResult =
  | "rotated"
  | "replayed"
  | "invalid"
  | "expired"
  | "revoked";

export interface RotateRefreshTokenInput {
  sessionId: string;
  userUuid: string;
  currentTokenHash: string;
  newTokenHash: string;
  newExpiresAt: Date;
  now: Date;
}

export interface SessionRepository {
  createWithRefreshToken(input: CreateSessionInput): Promise<void>;

  rotateRefreshToken(
    input: RotateRefreshTokenInput,
  ): Promise<RefreshRotationResult>;

  revokeSession(input: {
    sessionId: string;
    userUuid: string;
    revokedAt: Date;
  }): Promise<void>;

  revokeAllSessions(input: {
    userUuid: string;
    revokedAt: Date;
  }): Promise<void>;
}
