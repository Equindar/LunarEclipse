import {
  ChannelType,
  EmbedBuilder,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../types/Command.js';
import { isServerOwner } from '../utils/isServerOwner.js';
import { ChannelNotSendableError } from '../errors/ChannelNotSendableError.js';

let command: Command = {
  data: new SlashCommandBuilder()
    .setName('sendmyembed')
    .setDescription('Sendet ein Embed')
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Kanal, in den das Embed gesendet werden soll')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true),
    ),

  async execute(interaction) {
    try {
      const channel = interaction.options.getChannel('channel', true, [ChannelType.GuildText]);

      if (channel.type !== ChannelType.GuildText) {
        throw new ChannelNotSendableError(channel.id, channel.name);
      }

      if (!channel.isSendable())
        throw new ChannelNotSendableError(channel.id, channel.name);

      await channel!.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('Server Status')
            .addFields({ name: 'Status', value: 'defined', inline: true })
            .setTimestamp(),
        ],
      });
    } catch (error) {
      await interaction.reply({ content: 'Embbed konnte nicht versendet werden', flags: MessageFlags.Ephemeral });
      await interaction.client.errorHandler.handle(error, this.data.name);
    }
  },
};

// Mit Decorator wrappen
command = isServerOwner(command);

export default command;
