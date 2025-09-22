import { ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../types/Command';
import { logger } from './logger';

export function hasRole(roleIdOrName: string) {
  return (command: Command): Command => ({
    ...command,
    async execute(interaction: ChatInputCommandInteraction) {
      if (!interaction.guild) {
        await interaction.reply({
          content: 'Dieser Command kann nur auf einem Server genutzt werden.',
          ephemeral: true,
        });
        logger.warn(`Command ${command.data.name} darf nur auf einem Server genutzt werden.`);
        return;
      }

      const member = await interaction.guild.members.fetch(interaction.user.id);
      const hasRole =
        member.roles.cache.has(roleIdOrName) ||
        member.roles.cache.some((r) => r.name === roleIdOrName);

      if (!hasRole) {
        await interaction.reply({
          content: `Du benötigst die Rolle **${roleIdOrName}**, um diesen Command auszuführen.`,
          ephemeral: true,
        });
        logger.warn(`Command ${command.data.name} darf nur von der Rolle '${roleIdOrName}' genutzt werden.`);
        return;
      }

      return command.execute(interaction);
    },
  });
}
