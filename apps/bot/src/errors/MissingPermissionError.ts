import { BotError } from "./BotError.js";

export class MissingPermissionsError extends BotError {
  constructor(public readonly requiredPermission: string) {
    super(`Fehlende Berechtigung: ${requiredPermission}`);
  }
}
