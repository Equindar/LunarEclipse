import type { Meta, StoryObj } from "@storybook/html-vite";

import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "./Avatar";
import { avatarSizes, BROKEN_SOURCE, plusIcon, PNG_SOURCE, WEBP_SOURCE } from "./Avatar.fixtures";
import type { AvatarGroupArgs, AvatarSize } from "./Avatar.types";

/**
 * Story-Args: AvatarGroup hat selbst nur class und attributes. Damit das Playground trotzdem alles
 * steuern kann, ersetzen `avatarCount`, `size` und `overflowText` die children.
 */
type AvatarGroupStoryArgs = Omit<AvatarGroupArgs, "children"> & {
  /** Anzahl der Avatare in der Gruppe */
  avatarCount?: number;
  /** Größe aller Avatare der Gruppe (der Zähler passt sich an) */
  size?: AvatarSize;
  /** Text des AvatarGroupCount, z. B. "+3"; leer = kein Zähler */
  overflowText?: string;
};

const members = [
  { source: PNG_SOURCE, alt: "@eins", initials: "CN" },
  { source: WEBP_SOURCE, alt: "@zwei", initials: "LR" },
  { source: BROKEN_SOURCE, alt: "@drei", initials: "ER" },
  { source: PNG_SOURCE, alt: "@vier", initials: "AB" },
  { source: WEBP_SOURCE, alt: "@fuenf", initials: "CD" },
  { source: PNG_SOURCE, alt: "@sechs", initials: "EF" },
];

function renderMember(index: number, size?: AvatarSize): string {
  const member = members[index % members.length];
  if(member)
    return Avatar({
      size,
      children: [AvatarImage({ source: member.source, alt: member.alt }), AvatarFallback({ children: member.initials })],
    });
  return ""
}

function renderGroup(args: AvatarGroupStoryArgs): string {
  const { avatarCount = 3, size, overflowText, ...groupArgs } = args;
  const children = Array.from({ length: avatarCount }, (_, index) => renderMember(index, size));
  if (overflowText) children.push(AvatarGroupCount({ children: overflowText }));
  return AvatarGroup({ ...groupArgs, children });
}

const meta: Meta<AvatarGroupStoryArgs> = {
  title: "UI-Library/Avatar/AvatarGroup",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Überlappende Avatare (`AvatarGroup`) mit optionalem Zähler oder Icon (`AvatarGroupCount`), das die Größe der Avatare übernimmt, sofern diese `size` gesetzt haben. Der Wechsel zum Fallback bei Ladefehler funktioniert nur mit geladenem Datastar.",
      },
    },
  },
  argTypes: {
    class: { control: "text", description: "Zusätzliche CSS-Klassen" },
    attributes: { control: "object", description: "Zusätzliche HTML-Attribute" },
    avatarCount: { control: { type: "range", min: 1, max: 6, step: 1 }, description: "Anzahl der Avatare" },
    size: { control: "select", options: avatarSizes, description: "Größe der Avatare" },
    overflowText: { control: "text", description: "Text des Zählers (leer = kein Zähler)" },
  },
  render: renderGroup,
};

export default meta;
type Story = StoryObj<AvatarGroupStoryArgs>;

/** Alle Args der Gruppe über die Controls einstellbar */
export const Playground: Story = {
  args: {
    avatarCount: 3,
    size: "default",
    overflowText: "+3",
    class: "",
    attributes: {},
  },
};

/** Überlappende Avatare in einer AvatarGroup */
export const Group: Story = {
  args: { avatarCount: 3 },
};

/** AvatarGroupCount zeigt, wie viele weitere Avatare es gibt */
export const GroupWithCount: Story = {
  args: { avatarCount: 3, overflowText: "+3" },
};

/** Icon statt Zahl im AvatarGroupCount */
export const GroupWithIcon: Story = {
  render: () =>
    AvatarGroup({
      children: [renderMember(0), renderMember(1), renderMember(2), AvatarGroupCount({ children: plusIcon })],
    }),
};

/** Gruppen in allen Größen: der Zähler übernimmt die Größe der Avatare (group-has-data-[size=...]) */
export const GroupSizes: Story = {
  render: () =>
    `<div class="flex flex-col gap-4">${avatarSizes
      .map((size) => renderGroup({ avatarCount: 2, size, overflowText: "+3" }))
      .join("")}</div>`,
};
