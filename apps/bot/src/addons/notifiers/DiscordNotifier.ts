import { Client, RESTJSONErrorCodes, TextChannel } from 'discord.js';
import { Notifier, NotifierFactory } from '../../types/Notifier.js';
import { AddonConfigurationError } from '../../errors/AddonConfigurationError.js';
import logger from '../../utils/logger.js';
import configuration from '../../config.js';

const addonLogger = logger.child({ addon: 'Notifier' });

class DiscordNotifier implements Notifier {
  private client: Client;
  private channelId: string;
  private resolvedChannel: TextChannel | null = null;
  private resolvedChannelPromise: Promise<TextChannel> | null = null;
  name: string;

  constructor(client: Client, channelId: string) {
    this.client = client;
    this.channelId = channelId;
    this.name = 'DiscordNotifier';
  }

  async init(): Promise<void> {
    await this.getResolvedChannel();
  }

  private async getResolvedChannel(): Promise<TextChannel | null> {
    // If the channel has already been resolved, return it (to avoid unnecessary API calls)
    if (this.resolvedChannel) {
      return this.resolvedChannel;
    }

    // If a resolution is already in progress, return the existing promise
    if (!this.resolvedChannelPromise) {
      this.resolvedChannelPromise = this.resolveChannel();
    }

    // Wait for the resolution to complete and return the resolved channel
    try {
      this.resolvedChannel = await this.resolvedChannelPromise;
      return this.resolvedChannel;
    } finally {
      // Reset the promise after resolution
      this.resolvedChannelPromise = null;
    }
  }

  private async resolveChannel(): Promise<TextChannel> {
    let channel;
    try {
      channel = await this.client.channels.fetch(this.channelId);
    } catch (error) {
      const discordError = error as { code?: number };
      if (discordError.code === RESTJSONErrorCodes.MissingAccess) {
        throw new AddonConfigurationError(
          'Notifier',
          `Discord-Channel [ID: ${this.channelId}] ist nicht zugänglich (fehlende Berechtigung).`,
        );
      }
      if (discordError.code === RESTJSONErrorCodes.UnknownChannel) {
        throw new AddonConfigurationError(
          'Notifier',
          `Discord-Channel [ID: ${this.channelId}] existiert nicht (falsche ID oder gelöscht).`,
        );
      }
      throw new AddonConfigurationError(
        'Notifier',
        `Discord-Channel [ID: ${this.channelId}] konnte nicht abgerufen werden.`,
      );
    }

    if (!channel) {
      throw new AddonConfigurationError('Notifier', `Discord-Channel [ID: ${this.channelId}] wurde nicht gefunden.`);
    }

    if (!channel.isTextBased()) {
      throw new AddonConfigurationError('Notifier', `Discord-Channel [ID: ${this.channelId}] ist kein Text-Channel.`);
    }

    if (!channel.isSendable()) {
      throw new AddonConfigurationError('Notifier', `Discord-Channel [ID: ${this.channelId}] ist nicht sendbar.`);
    }

    return channel as TextChannel;
  }



  async notify(message: string, error?: unknown): Promise<void> {
    let channel: TextChannel | null = null;

    try {
      channel = await this.getResolvedChannel();
    } catch (resolveError) {
      // Cache bleibt null, damit beim nächsten notify erneut versucht wird, den Channel aufzulösen
      addonLogger.error('Fehler beim Auflösen des Discord-Channels:', resolveError);
      return;
    }

    try {
      if (channel) {
        await channel.send(message);
      }
    } catch (sendError) {
      // Reset the resolved channel to force re-resolution on next notify
      this.resolvedChannel = null;
      addonLogger.error('Nachricht konnte nicht gesendet werden:', sendError);
    }
  }
}

const createDiscordNotifier: NotifierFactory = (client) =>
  new DiscordNotifier(client, configuration.notifiers.discord.channelId);

export default createDiscordNotifier;
