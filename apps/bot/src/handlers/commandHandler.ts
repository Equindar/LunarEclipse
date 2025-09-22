import { Client, Collection, REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import path = require("path");
import { Command } from '../types/Command';
import { logger } from '../utils/logger';




export async function loadCommands(client: Client) {
  const commandsPath = path.join(__dirname, '..', 'commands');
  const commandFiles = readdirSync(commandsPath).filter(
    (file) => file.endsWith('.ts') || file.endsWith('.js'),
  );

  const commands: Command[] = [];
  client.commands = new Collection();

  logger.info('Slash Commands werden geladen...');
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command: Command = (await import(filePath)).default;

    client.commands.set(command.data.name, command);
    commands.push(command);
    logger.debug(`Command geladen: ${command.data.name}`);
  }

  // Registriere die Commands bei Discord (global oder für eine Guild)
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

  try {
    logger.info('Slash Commands werden registriert...');

    if (process.env.NODE_ENV === "production") {
      await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
        { body: commands.map(cmd => cmd.data.toJSON()) }
      );
    } else {
      await rest.put(
        Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID!, process.env.DISCORD_SERVER_ID!),
        { body: commands.map(cmd => cmd.data.toJSON()) }
      );
    }

    logger.info('Slash Commands erfolgreich registriert.');
  } catch (error) {
    logger.error('Registrierung: fehlgeschlagen: ', error);
  }
}
