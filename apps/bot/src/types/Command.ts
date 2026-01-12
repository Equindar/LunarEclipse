import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';

export interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
  scope?: string[];

  execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void;
  check?: (interaction: ChatInputCommandInteraction) => Promise<boolean> | boolean;
}
