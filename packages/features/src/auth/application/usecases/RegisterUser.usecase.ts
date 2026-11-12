import { EmailAlreadyRegisteredError } from "../../core/errors/EmailAlreadyRegisteredError.js";
import { Clock } from "../ports/Clock.js";
import { PasswordHasher } from "../ports/PasswordHasher.js";
import { RegistrationRepository } from "../ports/RegistrationRepository.js";

export interface RegisterUserInput {
  email: string;
  displayName: string | null;
  password: string;
}

export class RegisterUser {
  constructor(
    private readonly registration: RegistrationRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly clock: Clock,
  ) {}

  async execute(input: RegisterUserInput) {
    const passwordHash = await this.passwordHasher.hash(input.password);
    const now = this.clock.now();

    const result = await this.registration.register({
      email: input.email,
      displayName: input.displayName,
      passwordHash,
      passwordAlgorithm: "argon2id",
      createdAt: now,
    });

    if (result.status === "email-taken") {
      throw new EmailAlreadyRegisteredError();
    }

    return {
      user: {
        id: result.user.uuid,
        email: result.user.email,
        displayName: input.displayName,
      },
    };
  }
}
