import type { Meta, StoryObj } from "@storybook/html-vite";

import { Icon, iconNames } from "./Icon";
import type { IconName } from "./Icon.types";

type IconStoryArgs = {
  name: IconName;
  class?: string;
  label?: string;
};

const meta: Meta<IconStoryArgs> = {
  title: "UI-Library/Icon",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Inline-SVG-Icons aus den Dateien in src/svg. Der Name ist der Dateiname ohne .svg. Größe, Linienstärke, Füllung und Farbe lassen sich über Tailwind-Klassen steuern (size-*, stroke-*, fill-*, text-*), weil die Standardwerte nur Presentation Attributes sind.",
      },
    },
  },
  argTypes: {
    name: { control: "select", options: iconNames },
    class: { control: "text" },
    label: { control: "text" },
  },
  args: { name: "app-window", class: "size-6" },
  render: (args) => Icon({ name: args.name, class: args.class, label: args.label }),
};

export default meta;
type Story = StoryObj<IconStoryArgs>;

export const Default: Story = {};

/** Alle Icons im Überblick (neue Dateien in src/svg erscheinen nach dem Generieren automatisch) */
export const Alle: Story = {
  render: () =>
    `<div class="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-3">${iconNames
      .map(
        (name) =>
          `<div class="flex flex-col items-center gap-2 rounded-lg border p-3 text-xs text-muted-foreground">${Icon({ name, class: "size-6 text-foreground" })}<span>${name}</span></div>`
      )
      .join("")}</div>`,
};

/** Größe, Linienstärke, Füllung und Farbe über Klassen. Eigene Attribute ersetzen die Standardwerte. */
export const Gestaltung: Story = {
  render: () =>
    `<div class="flex items-center gap-4">${[
      Icon({ name: "code", class: "size-4" }),
      Icon({ name: "code", class: "size-8 stroke-1" }),
      Icon({ name: "code", class: "size-8 text-primary" }),
      Icon({ name: "app-window", class: "size-8 fill-primary/20 text-primary" }),
      Icon({ name: "close", class: "size-8", attributes: { "stroke-width": 3 } }),
    ].join("")}</div>`,
};

/** Mit label ist das Icon für Screenreader sichtbar (role="img"), sonst dekorativ (aria-hidden) */
export const MitLabel: Story = {
  args: { name: "close", class: "size-6", label: "Schließen" },
};
