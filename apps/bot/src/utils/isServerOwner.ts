import { Command } from '../types/Command.js';
import { ChatInputCommandInteraction } from 'discord.js';
import logger from './logger.js';

export function isServerOwner(command: Command): Command {
  return {
    ...command,
    async execute(interaction: ChatInputCommandInteraction) {
      if (!interaction.guild) {
        await interaction.reply({
          content: 'Dieser Command kann nur innerhalb eines Servers genutzt werden.',
          ephemeral: true,
        });
        logger.warn(`Command ${command.data.name} darf nur auf einem Server genutzt werden.`);
        return;
      }

      const isOwner = interaction.user.id === interaction.guild.ownerId;
      if (!isOwner) {
        await interaction.reply({
          content: 'Nur der Server-Owner darf diesen Command ausführen.',
          ephemeral: true,
        });
        logger.warn(`Command ${command.data.name} darf nur von einem ServerOwner genutzt werden.`);
        return;
      }

      return command.execute(interaction);
    },
  };
}
