import { Events, ChatInputCommandInteraction } from 'discord.js';
import { Event } from '../types/Event';
import { Command } from '../types/Command';
import { logger } from '../utils/logger';

const event: Event<typeof Events.InteractionCreate> = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName) as Command | undefined;

    if (!command) {
      throw new Error(`Command '${interaction.commandName}' not found`);
    }

    try {
      if (command.check) {
        const allowed = await command.check(interaction as ChatInputCommandInteraction);
        if (!allowed) return;
      }

      await command.execute(interaction as ChatInputCommandInteraction);
    } catch (error) {
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply('Beim Ausführen des Commands ist ein Fehler aufgetreten!');
      } else {
        await interaction.reply({ content: 'Fehler beim Command!', ephemeral: true });
      }
    }
  },
};

export default event;
