import {
  Client,
  GatewayIntentBits,
  Partials,
  ActivitiesOptions,
} from 'discord.js';

export default function createClient(): Client | undefined {
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

}

export function updateActivity(client: Client, message: string, activity: ActivitiesOptions): void {
  if (!client.user) {
    throw new Error('Client-Benutzer ist nicht verfügbar.');
  }
  client.user.setActivity(message, activity);
}
