import { ChannelType, EmbedBuilder, InteractionContextType, MessageFlags, PermissionFlagsBits, resolveColor, SlashCommandBuilder, TextChannel } from 'discord.js';
import { Command } from '../types/Command';
import { errorHandler } from '../index';
import { isServerOwner } from '../utils/isServerOwner';
import logger from '../utils/logger';
import formatDateTime from '../utils/formatDateTime';

let command: Command = {
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription('Führt Github Funktionen aus')
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('issue')
        .setDescription('Github Issue als formatierte Nachricht senden')
        .addNumberOption((option) =>
          option
            .setName('id')
            .setDescription('Nummer des Issues')
            .setMinValue(0)
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('Post, in den die Nachricht gesendet wird')
            .addChannelTypes(ChannelType.PublicThread)
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    try {
      const channel = interaction.options.getChannel('channel') as TextChannel;
      const issue = interaction.options.getNumber('id');

      if (!channel.isSendable())
        throw new Error(`Im Channel [ID: ${channel}] kann nicht gesendet werden.`);

      // Gather Data from, Github
      const response = await fetch(
        `https://api.github.com/repos/Equindar/LunarEclipse/issues/${issue}`,
        { headers: { 'Authorization': `Bearer ${process.env.GITHUB_PAT}` } }
      );
      if (!response.ok)
        throw new Error("Keine Daten von GitHub erhalten.")
      const content = await response.json();

      if (!channel.isSendable())
        throw new Error(`Im Channel [ID: ${channel}] kann nicht gesendet werden.`);
      const data = await channel!.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(content.title)
            .setURL(content.html_url)
            .setDescription(content.body)
            .setColor(`#${content.labels[0].color}`)
            .addFields(
              { name: 'Status', value: content.state, inline: true },
              {
                name: 'Zeitstempel',
                value: `erstellt: ${formatDateTime(content.created_at)}\ngeändert: ${formatDateTime(content.updated_at)}\ngeschlossen: ${formatDateTime(content.closed_at ?? '')}`,
                inline: true
              },
              { name: 'Bearbeiter', value: content.assignee ?? '---', inline: true },

            )
            .setTimestamp()
            .setFooter({
              text: `--- GitHub-Verlinkung: Issue #${issue} ---`
            }
            ),
        ],
      });
      await data.pin()
      logger.debug(data.id);

      await interaction.reply({ content: 'Erfolgreich ausgeführt', flags: MessageFlags.Ephemeral });
    } catch (error) {
      await interaction.reply({ content: 'Embbed konnte nicht versendet werden', flags: MessageFlags.Ephemeral });
      errorHandler.handle(error, this.data.name);
    }
  },
};

// Mit Decorator wrappen
command = isServerOwner(command);

export default command;
