import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../types/Command.js';

const command: Command = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Antwortet mit Pong!'),

  async execute(interaction) {
    try {
      await interaction.reply('Pong!');
    } catch (error) {
      await interaction.client.errorHandler.handle(error, this.data.name);
    }
  },
};

export default command;
