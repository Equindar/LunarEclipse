import type { Meta, StoryObj } from "@storybook/html-vite";

import { Button } from "../button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./Dialog";

type DialogStoryArgs = {
  /** IDs müssen pro Story eindeutig sein (die Docs-Seite rendert mehrere Stories gleichzeitig) */
  id: string;
  open?: boolean;
  showCloseButton?: boolean;
  triggerLabel?: string;
  title?: string;
  description?: string;
};

const inputTw =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const paragraphs = (count: number): string =>
  Array.from(
    { length: count },
    (_, i) =>
      `<p class="text-sm text-muted-foreground">Absatz ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`
  ).join("");

const meta: Meta<DialogStoryArgs> = {
  title: "UI-Library/Dialog",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Ein Fenster, das über der Seite liegt und den Inhalt darunter inert macht. Nutzt das native dialog-Element (showModal) und funktioniert nur mit geladenem Datastar. Escape und Klick auf den Hintergrund schließen den Dialog.",
      },
    },
  },
  argTypes: {
    open: { control: "boolean" },
    showCloseButton: { control: "boolean" },
  },
  args: {
    id: "dialog-default",
    open: false,
    showCloseButton: true,
    triggerLabel: "Open Dialog",
    title: "Are you absolutely sure?",
    description:
      "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
  },
  render: (args) =>
    Dialog({
      id: args.id,
      open: args.open,
      children: [
        DialogTrigger({ dialogId: args.id, children: Button({ children: args.triggerLabel ?? "Open", variant: "outline" }) }),
        DialogContent({
          id: args.id,
          showCloseButton: args.showCloseButton,
          children: [
            DialogHeader({
              children: [
                DialogTitle({ dialogId: args.id, children: args.title ?? "" }),
                DialogDescription({ dialogId: args.id, children: args.description ?? "" }),
              ],
            }),
            DialogFooter({ showCloseButton: true, children: Button({ children: "Continue" }) }),
          ],
        }),
      ],
    }),
};

export default meta;
type Story = StoryObj<DialogStoryArgs>;

export const Default: Story = {};

/** Eigener Schließen-Button statt des Standard-Kreuzes: DialogClose umschließt beliebiges Markup */
export const CustomCloseButton: Story = {
  render: () => {
    const id = "dialog-custom-close";

    return Dialog({
      id,
      children: [
        DialogTrigger({ dialogId: id, children: Button({ children: "Share", variant: "outline" }) }),
        DialogContent({
          id,
          showCloseButton: false,
          class: "sm:max-w-md",
          children: [
            DialogHeader({
              children: [
                DialogTitle({ dialogId: id, children: "Share link" }),
                DialogDescription({ dialogId: id, children: "Anyone who has this link will be able to view this." }),
              ],
            }),
            `<input class="${inputTw}" value="https://example.com/share/abc123" readonly aria-label="Link" />`,
            DialogFooter({
              class: "sm:justify-start",
              children: DialogClose({ children: Button({ children: "Close", variant: "secondary" }) }),
            }),
          ],
        }),
      ],
    });
  },
};

export const NoCloseButton: Story = {
  args: { id: "dialog-no-close", showCloseButton: false, triggerLabel: "No Close Button" },
};

/** Kopf und Fußzeile bleiben sichtbar, der Mittelteil scrollt */
export const StickyFooter: Story = {
  render: () => {
    const id = "dialog-sticky-footer";

    return Dialog({
      id,
      children: [
        DialogTrigger({ dialogId: id, children: Button({ children: "Sticky Footer", variant: "outline" }) }),
        DialogContent({
          id,
          class: "max-h-[80vh] grid-rows-[auto_minmax(0,1fr)_auto]",
          children: [
            DialogHeader({
              children: [
                DialogTitle({ dialogId: id, children: "Terms of service" }),
                DialogDescription({ dialogId: id, children: "Bitte lesen und bestätigen." }),
              ],
            }),
            `<div class="flex min-h-0 flex-col gap-4 overflow-y-auto">${paragraphs(10)}</div>`,
            DialogFooter({
              showCloseButton: true,
              children: Button({ children: "Accept" }),
            }),
          ],
        }),
      ],
    });
  },
};

/** Der Kopf bleibt im Blick, der lange Inhalt scrollt */
export const ScrollableContent: Story = {
  render: () => {
    const id = "dialog-scrollable";

    return Dialog({
      id,
      children: [
        DialogTrigger({ dialogId: id, children: Button({ children: "Scrollable Content", variant: "outline" }) }),
        DialogContent({
          id,
          class: "max-h-[80vh] grid-rows-[auto_minmax(0,1fr)]",
          children: [
            DialogHeader({
              children: [
                DialogTitle({ dialogId: id, children: "Scrollable content" }),
                DialogDescription({ dialogId: id, children: "Long content can scroll while the header stays in view." }),
              ],
            }),
            `<div class="flex min-h-0 flex-col gap-4 overflow-y-auto pr-1">${paragraphs(14)}</div>`,
          ],
        }),
      ],
    });
  },
};
