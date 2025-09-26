import { Status } from '../types/status';
import { StatusLookup } from './interfaces/statusLookup';

export class StatusLookupV2 implements StatusLookup {
  async execute(): Promise<Status> {
    let value: number = Math.floor(Math.random() * 100);
    return { online: true, latency: value };
  }
}
