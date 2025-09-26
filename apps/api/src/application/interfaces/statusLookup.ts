import { Status } from '../../types/status';

/**
 * Common Strategy: StatusLookup
 */
export interface StatusLookup {
  execute(): Promise<Status>;
}