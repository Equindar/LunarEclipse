import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../types/Command';
import { isServerOwner } from '../utils/isServerOwner';
import { logger } from '../utils/logger';
import { errorHandler } from '..';

let shutdownCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('shutdown')
    .setDescription('Stoppt den Bot (nur Server-Owner)'),
  async execute(interaction) {
    try {
      await interaction.reply('Bot wird heruntergefahren...');
      logger.info("Shutdown wird durchgeführt.");
      process.exit(0);
    }
    catch (error) {
      await interaction.reply({ content: 'Berunterfahren fehlgeschlagen' });
      errorHandler.handle(error, this.data.name);
    }
  },
};

// Mit Decorator wrappen
shutdownCommand = isServerOwner(shutdownCommand);

export default shutdownCommand;
