import {
  BaseChannel,
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../types/Command.js';
import { isServerOwner } from '../utils/isServerOwner.js';

let command: Command = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('erhalte Channel-Informationen (nur Server-Owner)')
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    try {
      const channel = (await interaction.channel) as BaseChannel;

      await interaction.reply('hab ich gehört, hier im Post: ' + channel.id);

      // await interaction.client.user.send({
      //   embeds: [
      //     new EmbedBuilder()
      //       .setTitle('Channel-Informationen')
      //       .setDescription(`ID: \`${channel.id}\`\nTyp: \`${channel.type.toString()}\``)
      //       .setTimestamp(),
      //   ],
      // });
    } catch (error) {
      await interaction.reply({ content: 'Embbed konnte nicht versendet werden' });
      await interaction.client.errorHandler.handle(error, this.data.name);
    }
  },
};

// Mit Decorator wrappen
command = isServerOwner(command);

export default command;
