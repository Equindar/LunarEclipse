import {
    InteractionContextType,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from 'discord.js';

import { shutdown } from '../lifecycle/shutdown.js';
import { Command } from '../types/Command.js';
import { isServerOwner } from '../utils/isServerOwner.js';

let shutdownCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('shutdown')
    .setDescription('Stoppt den Bot (nur Server-Owner)')
    .setContexts(InteractionContextType.BotDM)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    try {
      await interaction.reply({
        content: 'Bot wird heruntergefahren...',
        flags: MessageFlags.Ephemeral,
      });

      await shutdown(
        interaction.client,
        'Shutdown durch Discord-Command',
      );

    } catch (error) {
      await interaction.client.errorHandler.handle(
        error,
        this.data.name,
      );
    }
  },
};

shutdownCommand = isServerOwner(shutdownCommand);

export default shutdownCommand;
