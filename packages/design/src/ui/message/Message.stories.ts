import type { Meta, StoryObj } from "@storybook/html-vite";

import {
    Message,
    MessageAvatar,
    MessageContent,
    MessageFooter,
    MessageGroup,
    MessageHeader,
} from "./Message";
import type { MessageArgs } from "./Message.types";

type MessageStoryArgs = MessageArgs & { text?: string; header?: string; footer?: string };

/**
 * Platzhalter für die Nachrichtenfläche (shadcn rendert hier eine Bubble, die noch nicht portiert ist).
 * data-slot="bubble" wird gebraucht, damit `*:data-slot:self-end` im Content greift.
 */
const bubble = (text: string, own = false): string =>
  `<div data-slot="bubble" class="w-fit max-w-[85%] rounded-2xl px-3 py-2 ${
    own ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
  }">${text}</div>`;

/** Platzhalter-Avatar mit Initialen (der portierte Avatar wird hier bewusst nicht eingebunden) */
const avatar = (initials: string): string =>
  `<span data-slot="avatar" class="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">${initials}</span>`;

const iconButton = (label: string, paths: string): string =>
  `<button type="button" aria-label="${label}" class="inline-flex size-7 items-center justify-center rounded-md hover:bg-muted"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true">${paths}</svg></button>`;

const copyPaths = `<rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>`;
const retryPaths = `<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path>`;

const frame = (inner: string): string => `<div class="flex w-full max-w-sm flex-col gap-6 py-4">${inner}</div>`;

const meta: Meta<MessageStoryArgs> = {
  title: "UI-Library/Message",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Layout einer einzelnen Nachricht in einer Unterhaltung: Avatar, Ausrichtung, Header und Footer um die Nachrichtenfläche. Port von shadcn/ui (Base). Die Nachrichtenfläche (in shadcn eine Bubble) und der Avatar sind in den Stories Platzhalter. Besteht aus Message, MessageGroup, MessageAvatar, MessageContent, MessageHeader und MessageFooter.",
      },
    },
  },
  argTypes: {
    align: { control: "inline-radio", options: ["start", "end"] },
    class: { control: "text" },
    text: { control: "text" },
    header: { control: "text" },
    footer: { control: "text" },
  },
  args: {
    align: "start",
    text: "How can I help you today?",
    header: "",
    footer: "",
  },
  render: ({ text, header, footer, ...args }) =>
    frame(
      Message({
        ...args,
        children: [
          MessageAvatar({ children: avatar("CN") }),
          MessageContent({
            children: [
              header ? MessageHeader({ children: header }) : "",
              bubble(text ?? "", args.align === "end"),
              footer ? MessageFooter({ children: footer }) : "",
            ],
          }),
        ],
      })
    ),
};

export default meta;
type Story = StoryObj<MessageStoryArgs>;

export const Playground: Story = {};

/** Mit `align: "end"` wird die Zeile umgedreht: Avatar rechts, Nachricht rechtsbündig */
export const Alignment: Story = {
  render: () =>
    frame(
      [
        Message({
          children: [
            MessageAvatar({ children: avatar("R") }),
            MessageContent({ children: bubble("The build failed during dependency installation.") }),
          ],
        }),
        Message({
          align: "end",
          children: [
            MessageAvatar({ children: avatar("ME") }),
            MessageContent({ children: bubble("Can you share the exact error?", true) }),
          ],
        }),
      ].join("")
    ),
};

/** Aufeinanderfolgende Nachrichten desselben Absenders. Ein leerer MessageAvatar hält die Spalte frei */
export const Group: Story = {
  render: () =>
    frame(
      MessageGroup({
        children: [
          Message({
            children: [MessageAvatar(), MessageContent({ children: bubble("I checked the registry addresses.") })],
          }),
          Message({
            children: [
              MessageAvatar(),
              MessageContent({ children: bubble("The component and example JSON now live under the UI registry.") }),
            ],
          }),
          Message({
            children: [
              MessageAvatar({ children: avatar("OL") }),
              MessageContent({ children: bubble("Let me know if the install still fails.") }),
            ],
          }),
        ],
      })
    ),
};

/** Header für den Absendernamen, Footer für Status oder Zeitangabe (folgt der Ausrichtung) */
export const HeaderAndFooter: Story = {
  render: () =>
    frame(
      [
        Message({
          children: [
            MessageAvatar({ children: avatar("OL") }),
            MessageContent({
              children: [
                MessageHeader({ children: "Olivia" }),
                bubble("I already checked the logs."),
                MessageFooter({ children: "Yesterday" }),
              ],
            }),
          ],
        }),
        Message({
          align: "end",
          children: [
            MessageAvatar({ children: avatar("ME") }),
            MessageContent({
              children: [
                bubble("Send the report to the team.", true),
                MessageFooter({ children: "Read Yesterday" }),
              ],
            }),
          ],
        }),
      ].join("")
    ),
};

/** Aktionen im Footer, z. B. Kopieren und Wiederholen. Jeder Icon-Button braucht einen zugänglichen Namen */
export const Actions: Story = {
  render: () =>
    frame(
      Message({
        children: [
          MessageAvatar({ children: avatar("AI") }),
          MessageContent({
            children: [
              bubble("Here is the summary of the deployment."),
              MessageFooter({
                class: "gap-1 px-0",
                children: [iconButton("Copy", copyPaths), iconButton("Retry", retryPaths)],
              }),
            ],
          }),
        ],
      })
    ),
};

/** Eigene Klassen und Attribute: `class` wird mit den Standard-Klassen zusammengeführt */
export const CustomClass: Story = {
  render: () =>
    frame(
      Message({
        class: "text-base",
        attributes: { id: "message-custom-class", "aria-label": "Nachricht von Olivia" },
        children: [
          MessageAvatar({ children: avatar("OL") }),
          MessageContent({ children: bubble("Eigene Klasse und eigene Attribute an der Zeile.") }),
        ],
      })
    ),
};
