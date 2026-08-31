import { InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { errorHandler } from '../index.js';
import { Command } from '../types/Command.js';
import { isServerOwner } from '../utils/isServerOwner.js';
import logger from '../utils/logger.js';

let shutdownCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('shutdown')
    .setDescription('Stoppt den Bot (nur Server-Owner)')
    .setContexts(InteractionContextType.BotDM)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    try {
      await interaction.reply('Bot wird heruntergefahren...');
      logger.info('Shutdown wird durchgeführt.');
      process.exit(0);
    } catch (error) {
      await interaction.reply({ content: 'Herunterfahren fehlgeschlagen', flags: MessageFlags.Ephemeral });
      errorHandler.handle(error, this.data.name);
    }
  },
};

// Mit Decorator wrappen
shutdownCommand = isServerOwner(shutdownCommand);

export default shutdownCommand;
