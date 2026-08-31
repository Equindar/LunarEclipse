import { AddonError } from "./AddonError.js";

export class AddonLoadingError extends AddonError {
  constructor(
    addonType: string,
    public readonly file: string,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(addonType, message, true); // Ladefehler = Warnung, kein Abbruch
  }
}
