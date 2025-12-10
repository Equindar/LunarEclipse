import { ButtonBuilder, ButtonStyle, ChannelType, ContainerBuilder, EmbedBuilder, InteractionContextType, MediaGalleryBuilder, MessageCreateOptions, MessageFlags, PermissionFlagsBits, resolveColor, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, SlashCommandBuilder, TextChannel, TextDisplayBuilder } from 'discord.js';
import { Command } from '../types/Command';
import { errorHandler } from '../index';
import { isServerOwner } from '../utils/isServerOwner';
import formatDateTime from '../utils/formatDateTime';

let command: Command = {
  scope: ["627529082246135808"],
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription('Führt Github Funktionen aus')
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('issue')
        .setDescription('Github Issue als formatierte Nachricht senden')
        .addNumberOption((option) =>
          option
            .setName('id')
            .setDescription('Nummer des Issues')
            .setMinValue(0)
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('Post, in den die Nachricht gesendet wird')
            .addChannelTypes([ChannelType.PublicThread, ChannelType.GuildText])
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    try {
      const channel = interaction.options.getChannel('channel') as TextChannel;
      const issue = interaction.options.getNumber('id');

      if (!channel.isSendable())
        throw new Error(`Im Channel [ID: ${channel}] kann nicht gesendet werden.`);

      // Gather Data from, Github
      const response = await fetch(
        `https://api.github.com/repos/Equindar/LunarEclipse/issues/${issue}`,
        { headers: { 'Authorization': `Bearer ${process.env.GITHUB_PAT}` } }
      );
      if (!response.ok)
        throw new Error("Keine Daten von GitHub erhalten.")
      const content = await response.json();


      const urls = [...content.body.matchAll(/src\s*=\s*"([^"]+)"/g)]
      const images: { media: { url: string } }[] = urls.map(item => ({ media: { url: item[1] } }));
      const clearedContentBody = content.body.replace(/<img[^>]*src\s*=\s*['"][^'"]+['"][^>]*>/g, '');
      let subIssues: string | null = null;
      if (content.sub_issues_summary.total != 0)
        subIssues = `Teil-Aufgabe(n): ${content.sub_issues_summary.completed} / ${content.sub_issues_summary.total} (${content.sub_issues_summary.percent_completed}%)`
      const assignee = content.assignee ? content.assignee.login : null;


      if (!channel.isSendable())
        throw new Error(`Im Channel [ID: ${channel}] kann nicht gesendet werden.`);

      // DisplayComponent - Setup
      const containerComponent = new ContainerBuilder();
      // .setAccentColor(0xff0000);
      containerComponent.addSectionComponents(new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            [
              `# ${content.title}`,
              `-# __angelegt:__ ${formatDateTime(content.created_at)}            __abgeschlossen:__ ${formatDateTime(content.closed_at ?? '')}`
            ].join('\n'),
          ))
        .setButtonAccessory(new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel(`GitHub Issue: #${content.number}`)
          .setURL(content.html_url)
        ));
      containerComponent.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small));
      containerComponent.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          [
            clearedContentBody.trim(),
            `### Details`,
            `__Bearbeiter:__ ${assignee ?? '---'}            Kommentare: ${content.comments}            ${subIssues ?? ''}`
          ].join('\n'),
        ));
      if (content.milestone) {
        containerComponent.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
        const totalIssues = content.milestone.open_issues + content.milestone.closed_issues
        containerComponent.addSectionComponents(new SectionBuilder()
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              [
                `### ${content.milestone.title}`,
                `${content.milestone.description}`,
                `-# __Deadline:__ ${content.milestone.due_on ? formatDateTime(content.milestone.due_on) : 'noch nicht definiert'}            __abgeschlossen:__ ${content.milestone.closed_issues} / ${totalIssues} Ticket(s)`,
              ].join('\n'),
            ))
          .setButtonAccessory(new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel(`Meilenstein`)
            .setURL(content.milestone.html_url)
          ));
      }
      if (images.length > 0) {
        containerComponent.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
        containerComponent.addMediaGalleryComponents(new MediaGalleryBuilder().addItems(images));
      }
      if (content.created_at != content.updated_at) {
        containerComponent.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
        containerComponent.addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`-# __Zuletzt geändert:__ ${formatDateTime(content.updated_at)}`));
      }

      // DisplayComponent - Send
      const message = await channel!.send({
        flags: MessageFlags.IsComponentsV2,
        components: [containerComponent]
      })
      await message.pin()
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
