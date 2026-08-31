import { AddonError } from './AddonError.js';

export class AddonExecutionError extends AddonError {
  constructor(
    addonType: string,
    public readonly addonName: string,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(addonType, message);
  }
}
