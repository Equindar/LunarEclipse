import { BotError } from "./BotError.js";

export class CommandDeploymentError extends BotError {
  constructor(message: string, public readonly cause?: unknown) {
    super(message, /* isOperational */ false); // Config-/Infrastruktur-Fehler, kein "erwarteter" Fehler
  }
}
