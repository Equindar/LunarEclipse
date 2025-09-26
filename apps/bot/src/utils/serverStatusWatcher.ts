import { Client, TextChannel, EmbedBuilder } from 'discord.js';
import logger from './logger';

interface ServerStatusData {
  data: {
    online: boolean;
    latency: number;
  }
}

let lastData: ServerStatusData | null = null;
let performance: number[] = [25];
let statusMessageId: string | undefined = process.env.STATUS_MESSAGE_ID;

export async function startServerStatusWatcher(client: Client) {
  const channel = (await client.channels.fetch(process.env.STATUS_CHANNEL_ID!)) as TextChannel;
  if (!channel) throw new Error('Channel nicht gefunden');

  setInterval(async () => {
    try {
      const response = await fetch(process.env.SERVER_STATUS_API_ENDPOINT!);
      const result: ServerStatusData = await response.json();

      // nur triggern, wenn sich etwas geändert hat
      if (!lastData || result.data.online !== lastData.data.online || result.data.latency !== lastData.data.latency) {
        lastData = result;

        if (performance.length >= 60) {
          performance.shift();
        }
        let avg = performance.reduce((a, b) => a + b) / performance.length;

        const embed = new EmbedBuilder()
          .setTitle('LunarEclipse Server')
          .setColor(result.data.online ? 0x00ff00 : 0xff0000)
          .addFields(
            { name: 'Status', value: result.data.online ? '🟢 Online' : '🔴 Offline', inline: true },
            { name: 'Latenz', value: `${result.data.latency} ms`, inline: true },
            { name: '\u200B', value: `ø ${Math.round(avg * 10) / 10} ms`, inline: true },
          )
          .setTimestamp()
          .setFooter({ text: '--- Server Status ---' });

        if (statusMessageId) {
          try {
            const msg = await channel.messages.fetch(statusMessageId);
            await msg.edit({ embeds: [embed] });
            logger.debug(
              `Status-Nachricht editiert: [Status: ${result.data.online ? 'Online' : 'Offline'}, Latency: ${result.data.latency}ms (${Math.round(avg * 10) / 10}ms)]`,
            );
          } catch (err) {
            logger.error('Konnte bestehende Status-Nachricht nicht updaten:', err);
          }
        } else {
          const newMsg = await channel.send({ embeds: [embed] });
        }
      }
      performance.push(result.data.latency);
    } catch (err) {
      logger.error('Fehler beim Abrufen des Serverstatus:', err);
    }
  }, 60_000); // alle 60 Sekunden
}
