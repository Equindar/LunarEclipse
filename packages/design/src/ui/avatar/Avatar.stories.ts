import type { Meta, StoryObj } from "@storybook/html-vite";

import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "./Avatar";
import { avatarSizes, BROKEN_SOURCE, plusIcon, PNG_SOURCE, WEBP_SOURCE } from "./Avatar.fixtures";
import type { AvatarArgs } from "./Avatar.types";

/** Story-Args: alle AvatarArgs, `children` wird im Control als Text (`text`) bearbeitet */
type AvatarStoryArgs = Omit<AvatarArgs, "children"> & { text?: string };

const meta: Meta<AvatarStoryArgs> = {
  title: "UI-Library/Avatar/Avatar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Port von shadcn/ui (Base). Drei Varianten: Default-Avatar mit Text und Hintergrundfarbe, Kurzform mit `source` (webp oder png) oder frei zusammengesetzt aus `AvatarImage`, `AvatarFallback` und `AvatarBadge`. Gruppen: siehe AvatarGroup. Der Wechsel zum Fallback bei Ladefehler funktioniert nur mit geladenem Datastar.",
      },
    },
  },
  argTypes: {
    class: { control: "text", description: "Zusätzliche CSS-Klassen" },
    attributes: { control: "object", description: "Zusätzliche HTML-Attribute" },
    size: { control: "select", options: avatarSizes },
    backgroundColor: { control: "color" },
    textColor: { control: "color" },
    source: { control: "text", description: "Bildquelle; ersetzt Text und Farben" },
    alt: { control: "text", description: "Alternativtext (nur mit source)" },
    text: { control: "text", description: "Inhalt (children) als Text" },
  },
  render: ({ text, ...args }) => Avatar({ ...args, children: text }),
};

export default meta;
type Story = StoryObj<AvatarStoryArgs>;

/** Alle Args des Avatars über die Controls einstellbar */
export const Playground: Story = {
  args: {
    text: "JD",
    size: "default",
    backgroundColor: "#3b82f6",
    textColor: "#ffffff",
    source: "",
    alt: "",
    class: "",
    attributes: {},
  },
};

export const CustomTextColor: Story = {
  args: { text: "AB", backgroundColor: "#fde047", textColor: "#1f2937" },
};

export const BackgroundColors: Story = {
  render: () =>
    `<div class="flex items-center gap-3">${[
      ["AB", "#ef4444"],
      ["CD", "#f97316"],
      ["EF", "#22c55e"],
      ["GH", "hsl(210, 100%, 50%)"],
      ["IJ", "#8b5cf6"],
    ]
      .map(([text, color]) => Avatar({ children: text, backgroundColor: color }))
      .join("")}</div>`,
};

export const WithPngSource: Story = {
  args: { source: PNG_SOURCE, alt: "Beispiel-Avatar (PNG)" },
};

export const WithWebpSource: Story = {
  args: { source: WEBP_SOURCE, alt: "Beispiel-Avatar (WebP)" },
};

/** Mit source werden Text und Farben ignoriert */
export const SourceOverridesText: Story = {
  args: { source: PNG_SOURCE, alt: "Beispiel-Avatar", text: "JD", backgroundColor: "#ef4444" },
};

export const CustomSize: Story = {
  render: () =>
    `<div class="flex items-center gap-3">${Avatar({
      children: "SM",
      backgroundColor: "#3b82f6",
      class: "w-[24px] h-[24px] text-xs",
    })}${Avatar({ children: "MD", backgroundColor: "#3b82f6" })}${Avatar({
      source: WEBP_SOURCE,
      alt: "Großer Avatar",
      class: "w-[64px] h-[64px]",
    })}</div>`,
};

/** Bild mit Fallback (Initialen), wie in den shadcn-Docs: AvatarImage und AvatarFallback als children */
export const Basic: Story = {
  render: () =>
    Avatar({
      children: [AvatarImage({ source: PNG_SOURCE, alt: "@beispiel" }), AvatarFallback({ children: "CN" })],
    }),
};

/** Ohne Bild bleibt der Fallback sichtbar */
export const FallbackOnly: Story = {
  render: () => Avatar({ children: AvatarFallback({ children: "CN" }) }),
};

/** Schlägt das Bild fehl, blendet Datastar es aus und der Fallback wird sichtbar (nur mit geladenem Datastar) */
export const FallbackOnError: Story = {
  render: () =>
    Avatar({
      children: [AvatarImage({ source: BROKEN_SOURCE, alt: "@fehler" }), AvatarFallback({ children: "ER" })],
    }),
};

/** AvatarBadge unten rechts; Farben über `class` */
export const WithBadge: Story = {
  render: () =>
    Avatar({
      children: [
        AvatarImage({ source: PNG_SOURCE, alt: "@beispiel" }),
        AvatarFallback({ children: "CN" }),
        AvatarBadge({ class: "bg-green-600 dark:bg-green-800" }),
      ],
    }),
};

/** Icon im AvatarBadge; bei Größe "sm" wird das Icon automatisch ausgeblendet */
export const BadgeWithIcon: Story = {
  render: () =>
    Avatar({
      children: [AvatarFallback({ children: "PP" }), AvatarBadge({ children: plusIcon })],
    }),
};

/** `size` setzt data-size; Badge und Fallback-Text passen sich an */
export const Sizes: Story = {
  render: () =>
    `<div class="flex items-center gap-4">${avatarSizes
      .map((size) =>
        Avatar({
          size,
          children: [
            AvatarImage({ source: PNG_SOURCE, alt: `Größe ${size}` }),
            AvatarFallback({ children: "CN" }),
            AvatarBadge({ class: "bg-green-600 dark:bg-green-800" }),
          ],
        }),
      )
      .join("")}</div>`,
};
