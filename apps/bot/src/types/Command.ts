import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void;
  check?: (interaction: ChatInputCommandInteraction) => Promise<boolean> | boolean;
}
