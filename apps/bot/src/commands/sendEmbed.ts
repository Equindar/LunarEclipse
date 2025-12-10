import { ChannelType, EmbedBuilder, InteractionContextType, InteractionResponse, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js';
import { Command } from '../types/Command';
import { errorHandler } from '..';
import { isServerOwner } from '../utils/isServerOwner';

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
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const channel = interaction.options.getChannel('channel') as TextChannel;

      if (!channel.isSendable())
        throw new Error(`Im Channel [ID: ${channel}] kann nicht gesendet werden.`);
      await channel!.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('Server Status')
            .addFields({ name: 'Status', value: 'defined', inline: true })
            .setTimestamp(),
        ],
      });
    } catch (error) {
      await interaction.reply({ content: 'Embbed konnte nicht versendet werden' });
      errorHandler.handle(error, this.data.name);
    }
  },
};

// Mit Decorator wrappen
command = isServerOwner(command);

export default command;
