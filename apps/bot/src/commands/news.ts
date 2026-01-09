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
          url: "https://img.freepik.com/free-vector/vintage-lettering-happy-new-year-2021_52683-52108.jpg"
        }
      })
      // .setAccentColor(0xff0000);
      containerComponent.addSectionComponents(new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            [
              `# 2026, Let's go together`,
              `Für das kommende Jahr wünsche ich euch Gesundheit, Erfolg, viele schöne Momente und natürlich jede Menge Spaß hier auf LunarEclipse.

Das neue Jahr bringt frische Ideen, spannende Entwicklungen und vielleicht auch die ein oder andere Überraschung mit sich.
Bleibt neugierig, offen für Neues und begleitet das Projekt mit allem, was noch kommt – es lohnt sich!

Danke, dass ihr Teil dieser Community seid. Auf ein großartiges neues Jahr mit euch allen!`,
              `-# ~Equindar`
            ].join('\n'),
          ))
        .setThumbnailAccessory(thumbNail));
      containerComponent.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
      containerComponent.addMediaGalleryComponents(new MediaGalleryBuilder().addItems({
        media: {
          url: "https://media.discordapp.net/attachments/1133333220507795486/1455875172002304061/2149539970.jpg"
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
