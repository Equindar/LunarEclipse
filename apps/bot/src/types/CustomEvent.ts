import { ClientEvents } from 'discord.js';

export interface CustomEvent<K extends keyof ClientEvents | string = string> {
  name: K;
  once?: boolean;
  execute: (...args: any[]) => void | Promise<void>;
}
