import type { Meta, StoryObj } from "@storybook/html-vite";

import { DarkModeToggle } from "./DarkModeToggle";
import type { DarkModeToggleArgs } from "./DarkModeToggle.types";

const meta: Meta<DarkModeToggleArgs> = {
  title: "Components/DarkModeToggle",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Button für die AppBar, der 'data-theme' am 'html'-Element zwischen 'light' und 'dark' wechselt. Funktioniert nur mit geladenem Datastar. Den Initialwert setzt das Inline-Script im 'head' der App. In Storybook wirkt der Klick auf das 'html'-Element der Vorschau und kann mit dem Farbmodus-Umschalter der Toolbar kollidieren.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["sm", "default", "lg"] },
    label: { control: "text" },
    class: { control: "text" },
  },
  args: {
    variant: "default",
    size: "default",
  },
  render: (args) => DarkModeToggle(args),
};

export default meta;
type Story = StoryObj<DarkModeToggleArgs>;

/** Alle Controls auf einen Blick */
export const Playground: Story = {};

/** Mit Rahmen (`variant: "outline"`) */
export const Outline: Story = {
  render: () => DarkModeToggle({ variant: "outline" }),
};

/** Einbindung rechts in einer AppBar (Titel links, Toggle oben rechts) */
export const InAppBar: Story = {
  render: () =>
    `<header class="flex h-14 items-center justify-between border-b bg-background px-4 text-foreground"><span class="text-sm font-medium">LunarEclipse</span><div class="flex items-center gap-2">${DarkModeToggle({ id: "dark-mode-toggle-appbar" })}</div></header>`,
};
