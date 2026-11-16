import { InvalidCredentialsError } from "../../core/errors/InvalidCredentialsError";
import { Clock } from "../ports/Clock";
import { LocalCredentialsRepository } from "../ports/LocalCredentialsRepository";
import { LoginActivityRepository } from "../ports/LoginActivityRepository";
import { PasswordHasher } from "../ports/PasswordHasher";
import { SessionRepository } from "../ports/SessionRepository";
import { TokenService } from "../ports/TokenService";
import { UserRepository } from "../ports/UserRepository";
import { UuidGenerator } from "../ports/UuidGenerator";

export interface LoginWithPasswordInput {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

export class LoginWithPassword {
  constructor(
    private readonly users: UserRepository,
    private readonly credentials: LocalCredentialsRepository,
    private readonly sessions: SessionRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
    private readonly uuidGenerator: UuidGenerator,
    private readonly activities: LoginActivityRepository,
    private readonly clock: Clock,
  ) {}

  async execute(input: LoginWithPasswordInput) {
    const user = await this.users.findByEmail(input.email);

    const credentials = user
      ? await this.credentials.findByUserId(user.id)
      : null;

    const passwordValid = credentials
      ? await this.passwordHasher.verify(
          input.password,
          credentials.passwordHash,
        )
      : false;

    if (!user || !credentials || !passwordValid || !user.isActive) {
      await this.activities.record({
        userId: user?.id ?? null,
        attemptedEmail: input.email,
        status: "failed",
        authMethod: "password",
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      });

      throw new InvalidCredentialsError();;
    }

    const sessionId = this.uuidGenerator.generate();

    const tokens = await this.tokenService.createTokenPair({
      userId: user.uuid,
      sessionId,
    });

    const now = this.clock.now();
    const expiresAt = new Date(
      now.getTime() + tokens.refreshTokenExpiresIn * 1000,
    );

    await this.sessions.createWithRefreshToken({
      sessionId,
      userId: user.id,
      refreshTokenHash: this.tokenService.hashToken(tokens.refreshToken),
      expiresAt,
      createdAt: now,
    });

    await this.activities.record({
      userId: user.id,
      attemptedEmail: input.email,
      status: "success",
      authMethod: "password",
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });

    return {
      user: {
        id: user.uuid,
        email: user.email,
      },
      ...tokens,
    };
  }
}
