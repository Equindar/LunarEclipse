import { type Clock } from '@lunareclipse/features/auth';

export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}
