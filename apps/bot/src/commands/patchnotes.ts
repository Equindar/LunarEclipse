import { ChannelType, EmbedBuilder, InteractionContextType, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js';
import { Command } from '../types/Command';
import { errorHandler } from '../index';
import { isServerOwner } from '../utils/isServerOwner';
import logger from '../utils/logger';

let command: Command = {
  data: new SlashCommandBuilder()
    .setName('patchnotes')
    .setDescription('sendet formatierte Patchnotes')
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Kanal, in den das Embed gesendet werden soll')
        .addChannelTypes(ChannelType.PublicThread)
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName('issue')
        .setDescription('Nummer des Issues')
        .setMinValue(0)
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const channel = interaction.options.getChannel('channel') as TextChannel;
      const issue = interaction.options.getNumber('issue');

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
      await channel!.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(content.title)
            .setURL(content.html_url)
            .setDescription(content.body)
            .addFields(
              { name: 'Status', value: content.state, inline: true },
              {
                name: 'Zeitstempel',
                value: `erstellt: ${content.created_at}\ngeändert: ${content.updated_at}\ngeschlossen: ${content.closed_at ?? ''}`,
                inline: true
              },
              { name: 'Bearbeiter', value: content.assignee ?? '---', inline: true },

            )
            .setTimestamp()
            .setFooter({
              text: "--- verlinktes Issue im GitHub ---"
            }
            ),
        ],
      });
      logger.debug(content.state)

      await interaction.reply('performed patchnotes command');
    } catch (error) {
      await interaction.reply({ content: 'Embbed konnte nicht versendet werden' });
      errorHandler.handle(error, this.data.name);
    }
  },
};


// Mit Decorator wrappen
command = isServerOwner(command);

export default command;
