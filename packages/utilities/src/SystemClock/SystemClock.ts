import { Clock } from '@lunareclipse/crypto';

export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}
