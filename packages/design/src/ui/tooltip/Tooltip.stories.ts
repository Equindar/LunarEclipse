import type { Meta, StoryObj } from "@storybook/html-vite";

import { Button } from "../button";
import { TooltipContent, TooltipTrigger } from "./Tooltip";
import type { TooltipContentArgs } from "./Tooltip.types";

type TooltipStoryArgs = Omit<TooltipContentArgs, "children"> & {
  delayDuration?: number;
  triggerLabel?: string;
  text?: string;
};

/** Trigger + Content als Paar rendern. IDs müssen pro Story eindeutig sein (die Docs-Seite rendert mehrere Stories). */
const tooltip = (
  id: string,
  trigger: string,
  text: string,
  options: Omit<TooltipContentArgs, "id" | "children"> & { delayDuration?: number } = {
    useAnchor: true,
    side: "top",
  }
): string => {
  const { delayDuration, ...contentOptions } = options;

  return (
    TooltipTrigger({ tooltipId: id, delayDuration, children: trigger }) +
    TooltipContent({ id, children: `<p>${text}</p>`, ...contentOptions })
  );
};

const meta: Meta<TooltipStoryArgs> = {
  title: "UI-Library/Tooltip",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Ein Popup mit Zusatzinfos zu einem Element, das bei Tastaturfokus oder Mouse-Hover erscheint (auf Touch-Geräten per Touch-and-hold).",
      },
    },
  },
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
    align: { control: "select", options: ["start", "center", "end"] },
    sideOffset: { control: "number" },
    delayDuration: { control: "number" },
    useAnchor: { control: "boolean" },
  },
  args: {
    id: "tooltip-default",
    useAnchor: true,
    side: "top",
    delayDuration: 700,
    triggerLabel: "Hover me",
    text: "Add to library",
  },
  render: ({ triggerLabel, text, ...args }) =>
    `<div class="p-16">${tooltip(args.id, Button({ children: triggerLabel, variant: "outline" }), text ?? "", args)}</div>`,
};

export default meta;
type Story = StoryObj<TooltipStoryArgs>;

export const Default: Story = {};

export const Positioning: Story = {
  render: () => {
    const sides = ["top", "bottom", "left", "right"] as const;

    const items = sides
      .map((side) => {
        const label = side.charAt(0).toUpperCase() + side.slice(1);
        return tooltip(`tooltip-side-${side}`, Button({ children: label, variant: "outline" }), `Tooltip on ${side}`, {
          useAnchor: true,
          side,
        });
      })
      .join("");

    return `<div class="flex flex-wrap items-center justify-center gap-4 p-24">${items}</div>`;
  },
};

export const CustomDelay: Story = {
  render: () =>
    `<div class="p-16">${tooltip(
      "tooltip-custom-delay",
      Button({ children: "Fast (100ms)", variant: "outline" }),
      "Shows quickly!",
      { useAnchor: true, side: "top", delayDuration: 100 }
    )}</div>`,
};

export const TextTrigger: Story = {
  render: () =>
    `<div class="p-16">${tooltip(
      "tooltip-text-trigger",
      `<span class="underline decoration-dotted underline-offset-4">Hover over this text</span>`,
      "This is helpful information!",
      { useAnchor: true, side: "top" }
    )}</div>`,
};
