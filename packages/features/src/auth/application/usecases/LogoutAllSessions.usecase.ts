import type { Clock } from "../ports/Clock.js";
import type { SessionRepository } from "../ports/SessionRepository.js";

export class LogoutAllSessions {
  constructor(
    private readonly sessions: SessionRepository,
    private readonly clock: Clock,
  ) {}

  async execute(userId: string): Promise<void> {
    await this.sessions.revokeAllSessions({
      userUuid: userId,
      revokedAt: this.clock.now(),
    });
  }
}
