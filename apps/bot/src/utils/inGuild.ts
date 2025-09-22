import { ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../types/Command';
import { logger } from './logger';

export function inGuild(command: Command): Command {
  return {
    ...command,
    async execute(interaction: ChatInputCommandInteraction) {
      if (!interaction.guild) {
        await interaction.reply({
          content: 'Dieser Command ist nur innerhalb eines Servers nutzbar.',
          ephemeral: true,
        });
        logger.warn(`Command ${command.data.name} darf nur auf einem Server genutzt werden.`);
        return;
      }

      return command.execute(interaction);
    },
  };
}
