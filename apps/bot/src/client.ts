import {
  Client,
  GatewayIntentBits,
  Partials,
  ActivitiesOptions,
} from 'discord.js';
import { errorHandler } from './index.js';


export default function createClient(): Client | undefined {
  try {
    return new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresences,
      ],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    });
  } catch (error) {
    errorHandler.handle(error, 'Fehler beim Erstellen des Discord-Clients:');
  }
}

export function updateActivity(client: Client, message: string, activity: ActivitiesOptions): void {
  try {
    if (!client.user) {
      throw new Error('Client-Benutzer ist nicht verfügbar.');
    }
    client.user.setActivity(message, activity);
  } catch (error) {
    errorHandler.handle(error, 'Fehler beim Aktualisieren der Aktivität:');
  }
}
