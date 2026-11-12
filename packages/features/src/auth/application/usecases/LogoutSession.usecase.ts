import type { Clock } from "../ports/Clock.js";
import type { SessionRepository } from "../ports/SessionRepository.js";

export class LogoutSession {
  constructor(
    private readonly sessions: SessionRepository,
    private readonly clock: Clock,
  ) {}

  async execute(input: {
    userId: string;
    sessionId: string;
  }): Promise<void> {
    await this.sessions.revokeSession({
      sessionId: input.sessionId,
      userUuid: input.userId,
      revokedAt: this.clock.now(),
    });
  }
}
