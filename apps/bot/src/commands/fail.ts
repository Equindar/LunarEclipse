import { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Command } from '../types/Command.js';
import { errorHandler } from '../index.js';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('fail')
    .setDescription('Simuliert einen Fehler')
    .setContexts(InteractionContextType.BotDM)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

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
