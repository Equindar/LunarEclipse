import { REST, Routes } from "discord.js";
import configuration from "../config.js";
import { CommandDeploymentError } from "../errors/CommandDeploymentError.js";
import { loadCommands } from "../handlers/commandHandler.js";
import logger from "../utils/logger.js";
import { CommandLoadingError } from "../errors/CommandLoadingError.js";
import { errorHandler } from "../index.js";

// Module-Logger
const commandLogger = logger.child({ module: "Commands" });

async function deployCommands(): Promise<void> {
  logger.info("Deploy-Script gestartet...");
  const commands = await loadCommands('./commands');
  const commandsData = [...commands.values()].map((cmd) => cmd.data.toJSON());

  const rest = new REST({ version: '10' }).setToken(configuration.app.secret);

  try {
    commandLogger.info('Slash Commands werden deployed...');
    if (process.env.NODE_ENV === 'production') {
      commandLogger.debug('production-mode');
      await rest.put(Routes.applicationCommands(configuration.app.clientId!), { body: commandsData });
    } else {
      await rest.put(
        Routes.applicationGuildCommands(
          configuration.app.clientId!,
          process.env.DISCORD_SERVER_ID || ''
        ),
        { body: commandsData },
      );
    }
    commandLogger.info(`Slash Commands erfolgreich deployed (${commandsData.length} Commands)`);
  } catch (error) {
    throw new CommandDeploymentError(`Fehler beim Deployment der Commands: ${error}`);
  }
}

deployCommands().catch(async (error) => {
  // Läuft als eigenständiges Script (nicht als Teil vom laufenden Bot) → eigener Top-Level-Catch
  if (error instanceof CommandLoadingError || error instanceof CommandDeploymentError) {
    await errorHandler.handle(error, 'Deploy-Script: ');
  } else {
    await errorHandler.handle(error, 'Deploy-Script (unerwartet): ');
  }
  process.exit(1);
});
