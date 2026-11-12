export interface LocalCredentials {
  userId: number;
  passwordHash: string;
  passwordAlgorithm: string;
}

export interface LocalCredentialsRepository {
  findByUserId(userId: number): Promise<LocalCredentials | null>;

  create(input: {
    userId: number;
    passwordHash: string;
    passwordAlgorithm: string;
  }): Promise<void>;

  updatePassword(input: {
    userId: number;
    passwordHash: string;
    passwordAlgorithm: string;
  }): Promise<void>;
}
