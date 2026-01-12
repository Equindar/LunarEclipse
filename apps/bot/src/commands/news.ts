import { ButtonBuilder, ButtonStyle, ChannelType, ContainerBuilder, EmbedBuilder, InteractionContextType, MediaGalleryBuilder, MessageCreateOptions, MessageFlags, PermissionFlagsBits, resolveColor, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, SlashCommandBuilder, TextChannel, TextDisplayBuilder, ThumbnailBuilder } from 'discord.js';
import { Command } from '../types/Command';
import { errorHandler } from '../index';
import { isServerOwner } from '../utils/isServerOwner';
import formatDateTime from '../utils/formatDateTime';

let command: Command = {
  scope: ["627529082246135808"],
  data: new SlashCommandBuilder()
    .setName('news')
    .setDescription('Führt Github Funktionen aus')
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('new')
        .setDescription('Neuigkeit als formatierte Nachricht senden')
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('Nachrichten-Ziel Kanal')
            .addChannelTypes([ChannelType.GuildAnnouncement, ChannelType.GuildText])
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    try {
      const channel = interaction.options.getChannel('channel') as TextChannel;

      if (!channel.isSendable())
        throw new Error(`Im Channel [ID: ${channel}] kann nicht gesendet werden.`);

      // DisplayComponent - Setup
      const containerComponent = new ContainerBuilder();
      const thumbNail = new ThumbnailBuilder({
        media: {
          url: "https://images.pexels.com/photos/235970/pexels-photo-235970.jpeg"
        }
      })
      // .setAccentColor(0xff0000);
      containerComponent.addSectionComponents(new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            [
              `# Vorweihnachtszeit und Advent`,
              `Ich bin zwar etwas spät dran, denn der zweite Advent ist mit dem letzten Sonntag nun auch gekommen. Die zweite Kerze - und hoffentlich nur die Kerze - brennt und stimmt euch ein wenig auf die Weihnachtszeit ein.`,
              `Für den Weihnachtsmarkt ist ein bei mir irgendwie zu warm, der Glühwein trinkt sich definitiv besser bei kälteren Außentemperaturen...

*Im Hintergrund geht die Entwicklung am Prototypen für den Kampf weiter, auch der DiscordBot bekommt seine ersten Funktionen verpasst.
Ich plane mal, abends hier im VoiceKanal "Getuschel" anwesend zu sein, falls ihr Fragen habt.*

Ich wünsche euch eine besinnliche Zeit, wenig Stress beim Einkaufen der Geschenke für eure Lieben und bleibt bei guter Gesundheit!`,
              `-# ~Equindar`
            ].join('\n'),
          ))
        .setThumbnailAccessory(thumbNail));
      containerComponent.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
      containerComponent.addMediaGalleryComponents(new MediaGalleryBuilder().addItems({
        media: {
          url: "https://c4.wallpaperflare.com/wallpaper/232/233/70/new-year-christmas-spruce-candles-wallpaper-preview.jpg"
        }
      }));

      // DisplayComponent - Send
      const message = await channel!.send({
        flags: MessageFlags.IsComponentsV2,
        components: [containerComponent]
      })
      await interaction.reply({ content: 'Erfolgreich ausgeführt', flags: MessageFlags.Ephemeral });
    } catch (error) {
      await interaction.reply({ content: 'Embbed konnte nicht versendet werden', flags: MessageFlags.Ephemeral });
      errorHandler.handle(error, this.data.name);
    }
  },
};

// Mit Decorator wrappen
command = isServerOwner(command);

export default command;
