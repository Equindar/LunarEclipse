import { SlashCommandBuilder } from 'discord.js';
import { errorHandler } from '../index.js';
import { Command } from '../types/Command.js';

const command: Command = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Antwortet mit Pong!'),

  async execute(interaction) {
    try {
      await interaction.reply('Pong!');
    } catch (error) {
      errorHandler.handle(error, this.data.name);
    }
  },
};

export default command;
