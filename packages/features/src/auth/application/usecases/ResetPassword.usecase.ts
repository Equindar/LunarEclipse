import type { Clock } from "../ports/Clock.js";
import type { PasswordHasher } from "../ports/PasswordHasher.js";
import type { PasswordResetRepository } from "../ports/PasswordResetRepository.js";
import type { TokenService } from "../ports/TokenService.js";

import { PasswordResetTokenInvalidError } from "../../core/errors/PasswordResetTokenInvalidError.js";

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export class ResetPassword {
  constructor(
    private readonly resetTokens: PasswordResetRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
    private readonly clock: Clock,
  ) {}

  async execute(input: ResetPasswordInput): Promise<void> {
    const newPasswordHash = await this.passwordHasher.hash(
      input.newPassword,
    );

    const result = await this.resetTokens.complete({
      tokenHash: this.tokenService.hashToken(input.token),
      newPasswordHash,
      passwordAlgorithm: "argon2id",
      now: this.clock.now(),
    });

    if (result !== "reset") {
      throw new PasswordResetTokenInvalidError();
    }
  }
}
