export interface AuthUser {
  id: number;
  uuid: string;
  email: string;
  emailVerified: boolean;
  isActive: boolean;
}

export interface UserRepository {
  findByEmail(email: string): Promise<AuthUser | null>;
  findByUuid(uuid: string): Promise<AuthUser | null>;
  create(input: {
    email: string;
    displayName: string | null;
  }): Promise<AuthUser>;
}
