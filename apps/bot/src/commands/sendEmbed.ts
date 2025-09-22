import { EmbedBuilder, SlashCommandBuilder, TextChannel } from 'discord.js';
import { Command } from '../types/Command';
import { errorHandler } from '..';
import { isServerOwner } from '../utils/isServerOwner';


let command: Command = {
    data: new SlashCommandBuilder()
        .setName("blabla")
        .setDescription('Sendet ein Embed (nur Server-Owner)'),
    async execute(interaction) {
        try {

            const channel = (await interaction.client.channels.fetch(
                process.env.STATUS_CHANNEL_ID!
            )) as TextChannel;

            if (!channel) {
                throw new Error(`TextChannel (ID: ${process.env.STATUS_CHANNEL_ID} nicht gefunden`);
            }

            await channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Server Status')
                        .addFields({ name: 'Status', value: 'undefined', inline: true })
                        .setTimestamp()
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
