import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../types/Command';
import { errorHandler } from '../index';

const command: Command = {
  data: new SlashCommandBuilder().setName('fail').setDescription('Simuliert einen Fehler'),

  async execute(interaction) {
    try {
      throw new Error('Testfehler 🚨');
    } catch (error) {
      await interaction.reply({ content: 'Es ist ein Fehler aufgetreten!' });
      await errorHandler.handle(error, this.data.name);
    }
  },
};

export default command;
