import type { Clock } from "../ports/Clock.js";
import type { OpaqueTokenGenerator } from "../ports/OpaqueTokenGenerator.js";
import type { PasswordResetNotifier } from "../ports/PasswordResetNotifier.js";
import type { PasswordResetRepository } from "../ports/PasswordResetRepository.js";
import type { TokenService } from "../ports/TokenService.js";
import type { UserRepository } from "../ports/UserRepository.js";

const PASSWORD_RESET_TOKEN_TTL_SECONDS = 30 * 60;

export class RequestPasswordReset {
  constructor(
    private readonly users: UserRepository,
    private readonly resetTokens: PasswordResetRepository,
    private readonly tokenGenerator: OpaqueTokenGenerator,
    private readonly tokenService: TokenService,
    private readonly notifier: PasswordResetNotifier,
    private readonly clock: Clock,
  ) {}

  async execute(input: { email: string }): Promise<void> {
    const user = await this.users.findByEmail(input.email);

    if (!user || !user.isActive) {
      return;
    }

    const token = this.tokenGenerator.generate();
    const now = this.clock.now();

    const expiresAt = new Date(
      now.getTime() + PASSWORD_RESET_TOKEN_TTL_SECONDS * 1000,
    );

    await this.resetTokens.createReplacingActive({
      userId: user.id,
      tokenHash: this.tokenService.hashToken(token),
      expiresAt,
      createdAt: now,
    });

    await this.notifier.sendPasswordReset({
      email: user.email,
      token,
      expiresAt,
    });
  }
}
