import { InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Command } from '../types/Command.js';
import logger from '../utils/logger.js';
import { CommandExecutionError } from '../errors/CommandExecutionError.js';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('fail')
    .setDescription('Simuliert einen Fehler')
    .setContexts(InteractionContextType.BotDM)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    logger.info(`Simulierter Fehler durch ${interaction.user.tag} (${interaction.user.id})`);
    try {
      throw new CommandExecutionError(interaction.commandName, 'Dies ist ein simuliertes Fehlerereignis für Testzwecke.');
    } catch (error) {
      await interaction.client.errorHandler.handle(error, 'Simulierter Fehler durch /fail');
      if (interaction.isRepliable()) {
        await interaction.reply({ content: 'Ein simuliertes Fehlerereignis wurde ausgelöst und protokolliert.', flags: MessageFlags.Ephemeral });
      }
    }
  }
};

export default command;
