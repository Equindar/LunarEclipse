import { MessageAnalyzer } from '../../types/MessageAnalyzer.js';
import logger from '../../utils/logger.js';
import { processAudio } from '../voice-to-text/processAudio.js';

export const voiceMessageAnalyzer: MessageAnalyzer = {
  name: 'voiceMessageAnalyzer',
  async analyze(message) {
    const attachment = message.attachments.first();
    if (!attachment) return;
    if (!attachment.contentType?.startsWith('audio')) return;

    try {
      const result = await processAudio(attachment.url);

      await message.reply(`**Zusammenfassung:**\n\n${result}`);
    } catch (err) {
      if (isRateLimitError(err)) {
        const reply = await message.reply(
          '⚠️ RateLimit erreicht.\nReagiere mit 🔄, um die Analyse erneut zu starten.',
        );

        await reply.react('🔄');

        pendingRetries.set(reply.id, {
          audioUrl: attachment.url,
          userId: message.author.id,
        });
      } else {
        console.error(err);
        await message.reply('❌ Fehler bei der Verarbeitung.');
      }
    }

    logger.debug(
      `Sprachnachricht "${attachment.id}" erkannt in Server "${message.guild?.name}" (${message.guildId}) von User ${message.author.tag}`,
    );
  },
};
