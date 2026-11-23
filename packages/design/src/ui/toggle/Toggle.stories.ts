import type { Meta, StoryObj } from "@storybook/html-vite";

import { renderIcon } from "../../utils/renderIcon";
import { Icon } from "../icon";
import { Toggle } from "./Toggle";
import type { ToggleArgs, ToggleSize, ToggleVariant } from "./Toggle.types";

type ToggleStoryArgs = ToggleArgs & { text?: string };

const variants: ToggleVariant[] = ["default", "outline"];
const sizes: ToggleSize[] = ["sm", "default", "lg"];

/** Icon-Inhalte (Lucide), als Inneres eines 24x24-SVGs */
const boldPaths = `<path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"></path>`;
const italicPaths = `<line x1="19" x2="10" y1="4" y2="4"></line><line x1="14" x2="5" y1="20" y2="20"></line><line x1="15" x2="9" y1="4" y2="20"></line>`;

const row = (items: string[]): string => `<div class="flex flex-wrap items-center gap-2">${items.join("")}</div>`;

const meta: Meta<ToggleStoryArgs> = {
  title: "UI-Library/Toggle",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Zweistufiger Button, der ein- oder ausgeschaltet sein kann. Port von shadcn/ui (Base). Der Zustand liegt in einem Datastar-Signal (`$<id>.pressed`), das Umschalten funktioniert nur mit geladenem Datastar. Ohne Datastar bleibt der Anfangszustand (`defaultPressed`) stehen.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "select", options: sizes },
    defaultPressed: { control: "boolean" },
    disabled: { control: "boolean" },
    onPressedChange: { control: "text" },
    class: { control: "text" },
    id: { control: "text" },
  },
  args: {
    variant: "default",
    size: "default",
    defaultPressed: false,
    disabled: false,
    text: "Toggle",
  },
  render: ({ text, ...args }) => Toggle({ ...args, id: args.id || "toggle-playground", children: text }),
};

export default meta;
type Story = StoryObj<ToggleStoryArgs>;

/** Alle Controls auf einen Blick */
export const Playground: Story = {};

/** Icon mit Text; ein gedrückter Toggle färbt das Icon über `aria-pressed` */
export const Default: Story = {
  render: () =>
    Toggle({
      id: "toggle-default",
      variant: "outline",
      size: "sm",
      class: "aria-pressed:bg-transparent aria-pressed:*:[svg]:fill-blue-500 aria-pressed:*:[svg]:stroke-blue-500",
      attributes: { "aria-label": "Toggle bookmark" },
      children: [
        Icon({ name: "bookmark"}), "Bookmark"],
    }),
};

/** `variant: "outline"` für einen Rahmen */
export const Outline: Story = {
  render: () =>
    row([
      Toggle({
        id: "toggle-outline-italic",
        variant: "outline",
        attributes: { "aria-label": "Toggle italic" },
        children: renderIcon(italicPaths),
      }),
      Toggle({
        id: "toggle-outline-bold",
        variant: "outline",
        attributes: { "aria-label": "Toggle bold" },
        children: renderIcon(boldPaths),
      }),
    ]),
};

/** Icon mit Text */
export const WithText: Story = {
  render: () =>
    Toggle({
      id: "toggle-with-text",
      attributes: { "aria-label": "Toggle italic" },
      children: [renderIcon(italicPaths), "Italic"],
    }),
};

/** Grössen über `size` */
export const Sizes: Story = {
  render: () =>
    row(
      sizes.map((size) =>
        Toggle({
          id: `toggle-size-${size}`,
          variant: "outline",
          size,
          children: size === "sm" ? "Small" : size === "lg" ? "Large" : "Default",
        })
      )
    ),
};

/** Deaktiviert (nicht klickbar, halbtransparent) */
export const Disabled: Story = {
  render: () =>
    row([
      Toggle({ id: "toggle-disabled-default", disabled: true, children: "Disabled" }),
      Toggle({ id: "toggle-disabled-outline", variant: "outline", disabled: true, children: "Disabled" }),
    ]),
};

/** Anfangszustand eingeschaltet über `defaultPressed` */
export const DefaultPressed: Story = {
  render: () =>
    row(
      variants.map((variant) =>
        Toggle({ id: `toggle-pressed-${variant}`, variant, defaultPressed: true, children: `Pressed (${variant})` })
      )
    ),
};

/** Der Zustand ist als Signal `$toggle_state_demo.pressed` lesbar, hier per `data-text` */
export const WithSignalState: Story = {
  render: () =>
    row([
      Toggle({ id: "toggle-state-demo", variant: "outline", children: "Benachrichtigungen" }),
      `<span class="text-sm text-muted-foreground">Status: <span data-text="$toggle_state_demo.pressed ? 'an' : 'aus'">aus</span></span>`,
    ]),
};

/** Rechts-nach-links-Layout; Icon und Text wechseln die Seite über `dir="rtl"` */
export const Rtl: Story = {
  render: () =>
    `<div dir="rtl">${Toggle({
      id: "toggle-rtl",
      variant: "outline",
      attributes: { "aria-label": "إشارة مرجعية" },
      children: [
        Icon({ name: "bookmark"}), "إشارة مرجعية"],
    })}</div>`,
};
