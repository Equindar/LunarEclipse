import { AddonError } from "./AddonError.js";

export class AddonConfigurationError extends AddonError {
  constructor(addontype: string, message: string) {
    super(addontype, message, false); // Config-Fehler, kein Laufzeit-"erwarteter" Fehler
  }
}
