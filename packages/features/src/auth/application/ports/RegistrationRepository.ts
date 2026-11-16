import type { AuthUser } from "./UserRepository.js";

export type RegisterUserResult =
  | {
      status: "created";
      user: AuthUser;
    }
  | {
      status: "email-taken";
    };

export interface RegistrationRepository {
  register(input: {
    email: string;
    displayName: string | null;
    passwordHash: string;
    passwordAlgorithm: "argon2id";
    createdAt: Date;
  }): Promise<RegisterUserResult>;
}
