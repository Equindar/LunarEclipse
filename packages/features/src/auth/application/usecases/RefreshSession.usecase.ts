import { InvalidRefreshTokenError } from "../../core/errors/InvalidRefreshTokenError.js";
import { Clock } from "../ports/Clock.js";
import { SessionRepository } from "../ports/SessionRepository.js";
import { TokenService } from "../ports/TokenService.js";

export class RefreshSession {
  constructor(
    private readonly sessions: SessionRepository,
    private readonly tokenService: TokenService,
    private readonly clock: Clock,
  ) {}

  async execute(refreshToken: string) {
    const claims = await this.tokenService.verifyRefreshToken(refreshToken);

    if (!claims) {
      throw new InvalidRefreshTokenError();
    }

    const tokens = await this.tokenService.createTokenPair({
      userId: claims.userId,
      sessionId: claims.sessionId,
    });

    const now = this.clock.now();

    const result = await this.sessions.rotateRefreshToken({
      sessionId: claims.sessionId,
      userUuid: claims.userId,
      currentTokenHash: this.tokenService.hashToken(refreshToken),
      newTokenHash: this.tokenService.hashToken(tokens.refreshToken),
      newExpiresAt: new Date(
        now.getTime() + tokens.refreshTokenExpiresIn * 1000,
      ),
      now,
    });

    if (result !== "rotated") {
      throw new InvalidRefreshTokenError();
    }

    return tokens;
  }
}
