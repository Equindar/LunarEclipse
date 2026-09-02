import { Client } from "discord.js";
import { Addon } from "./Addon.js";

export interface Notifier extends Addon {
  notify(message: string, error?: unknown): Promise<void>;
}

export type NotifierFactory = (client: Client) => Notifier;
