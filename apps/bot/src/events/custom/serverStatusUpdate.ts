import { CustomEvent } from '../../types/CustomEvent';
import { EmbedBuilder, TextChannel } from 'discord.js';

interface ServerStatusData {
  online: boolean;
  latency: number;
}

const event: CustomEvent<'serverStatusUpdate'> = {
  name: 'serverStatusUpdate',
  async execute(channel: TextChannel, data: ServerStatusData) {
    // Bestehende Nachricht holen oder neu senden
    const messages = await channel.messages.fetch({ limit: 10 });
    const statusMessage = messages.find(
      (m) => m.embeds.length && m.embeds[0].title === 'Server Status',
    );

    const embed = new EmbedBuilder()
      .setTitle('Server Status')
      .setColor(data.online ? 0x00ff00 : 0xff0000)
      .addFields(
        { name: 'Status', value: data.online ? '🟢 Online' : '🔴 Offline', inline: true },
        { name: 'Antwortzeit', value: `${data.latency} ms`, inline: true },
      )
      .setTimestamp();

    if (statusMessage) {
      await statusMessage.edit({ embeds: [embed] });
    } else {
      await channel.send({ embeds: [embed] });
    }
  },
};

export default event;
