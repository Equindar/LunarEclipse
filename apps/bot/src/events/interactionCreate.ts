import { Events, ChatInputCommandInteraction } from 'discord.js';
import { Event } from '../types/Event.js';
import { Command } from '../types/Command.js';
import { CommandExecutionError } from '../errors/CommandExecutionError.js';

const event: Event<typeof Events.InteractionCreate> = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      throw new CommandExecutionError(interaction.commandName, `Command '${interaction.commandName}' nicht gefunden`);
    }

    try {
      if (command.check) {
        const allowed = await command.check(interaction as ChatInputCommandInteraction);
        if (!allowed) return;
      }

      await command.execute(interaction as ChatInputCommandInteraction);
    } catch (error) {
      if (interaction.isRepliable()) {
        const payload = { content: 'Beim Ausführen des Commands ist ein Fehler aufgetreten!', ephemeral: true };

        await (interaction.deferred || interaction.replied
          ? interaction.editReply(payload)
          : interaction.reply(payload)
        ).catch(() => { });
      }
      throw new CommandExecutionError(interaction.commandName, 'Fehler beim Ausführen des Commands', error);
    };
  },
};

export default event;
