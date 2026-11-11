import type { Meta, StoryObj } from "@storybook/html-vite";

import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../..";
import { Badge } from "../badge";
import { Button } from "../button";
import { Spinner } from "./Spinner";
import type { SpinnerArgs } from "./Spinner.types";

const meta: Meta<SpinnerArgs> = {
  title: "UI-Library/Spinner",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Zeigt eine Ladeanzeige als rotierendes Icon. Port von shadcn/ui (Base). Größe und Farbe werden über Tailwind-Klassen (`size-*`, `text-*`) gesteuert, im Button oder Badge über `data-icon`. Braucht kein Datastar.",
      },
    },
  },
  argTypes: {
    class: { control: "text" },
    label: { control: "text" },
  },
  args: {
    label: "Loading",
  },
  render: (args) => Spinner(args),
};

export default meta;
type Story = StoryObj<SpinnerArgs>;

export const Default: Story = {};

/** Die Größe wird mit `size-*` über `class` geändert */
export const Size: Story = {
  render: () =>
    `<div class="flex items-center gap-6">${["size-3", "size-4", "size-6", "size-8"]
      .map((size) => Spinner({ class: size }))
      .join("")}</div>`,
};

/** Die Farbe wird mit `text-*` über `class` geändert (das Icon nutzt `currentColor`) */
export const Color: Story = {
  render: () =>
    `<div class="flex items-center gap-6">${[
      "text-red-500",
      "text-green-500",
      "text-blue-500",
      "text-gray-500",
      "text-yellow-500",
    ]
      .map((color) => Spinner({ class: `size-6 ${color}` }))
      .join("")}</div>`,
};

/** Spinner im Button: vor dem Text mit `data-icon="inline-start"`, danach mit `data-icon="inline-end"` */
export const InButton: Story = {
  render: () =>
    `<div class="flex flex-wrap items-center gap-4">${[
      Button({
        variant: "default",
        attributes: { disabled: true },
        children: [Spinner({ attributes: { "data-icon": "inline-start" } }), "Generating"],
      }),
      Button({
        variant: "outline",
        attributes: { disabled: true },
        children: [Spinner({ attributes: { "data-icon": "inline-start" } }), "Please wait"],
      }),
      Button({
        variant: "secondary",
        attributes: { disabled: true },
        children: ["Processing", Spinner({ attributes: { "data-icon": "inline-end" } })],
      }),
    ].join("")}</div>`,
};

/** Spinner im Badge, ebenfalls mit `data-icon` */
export const InBadge: Story = {
  render: () =>
    `<div class="flex flex-wrap items-center gap-4">${[
      Badge({
        children: [Spinner({ attributes: { "data-icon": "inline-start" } }), "Syncing"],
      }),
      Badge({
        variant: "secondary",
        children: [Spinner({ attributes: { "data-icon": "inline-start" } }), "Updating"],
      }),
      Badge({
        variant: "outline",
        children: [Spinner({ attributes: { "data-icon": "inline-start" } }), "Processing"],
      }),
    ].join("")}</div>`,
};

/** Eigener Screenreader-Text über `label`, z. B. für lokalisierte Oberflächen */
export const CustomLabel: Story = {
  args: { label: "Wird geladen", class: "size-6" },
};

export const InItem: Story = {
  render: () =>
    `<div class="flex flex-wrap items-center gap-4">${
      Item({
        variant: "outline",
        children: [
          ItemMedia({ variant: "icon", children: [Spinner({ attributes: { "data-icon": "inline-start" } }), "Processing"] }),
          ItemContent({
            children: [
              ItemTitle({ children: "Security Alert" }),
              ItemDescription({ children: "New login detected from unknown device." }),
            ],
          }),
          ItemActions({ children: Button({ variant: "outline", size: "sm", children: "Review" }) }),
        ],
      })
    }</div>`,
};
