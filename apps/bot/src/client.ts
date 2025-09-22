import { Client, GatewayIntentBits, Collection, Partials } from 'discord.js';
import { Command } from './types/Command';

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, Command>;
    }
}


export default function createClient(): Client {
    return new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessageReactions,
        ],
        partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    });
};
