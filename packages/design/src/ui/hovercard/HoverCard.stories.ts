import type { Meta, StoryObj } from "@storybook/html-vite";

import { renderIcon } from "../../utils/renderIcon";
import { Button } from "../button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./HoverCard";
import type { HoverCardContentArgs, HoverCardTriggerArgs } from "./HoverCard.types";

type HoverCardStoryArgs = Omit<HoverCardContentArgs, "children" | "attributes"> &
  Pick<HoverCardTriggerArgs, "delay" | "closeDelay"> & {
    triggerLabel?: string;
    text?: string;
  };

type HoverCardOptions = Omit<HoverCardContentArgs, "id" | "children" | "class"> &
  Pick<HoverCardTriggerArgs, "delay" | "closeDelay" | "href" | "asChild"> & {
    /** Klassen des Contents */
    class?: string;
    /** Klassen des Triggers */
    triggerClass?: string;
  };

/** Hover Card aus Trigger und Content. IDs müssen pro Story eindeutig sein (die Docs-Seite rendert mehrere Stories). */
const hoverCard = (id: string, trigger: string, content: string, options: HoverCardOptions = {}): string => {
  const { delay, closeDelay, href, asChild, triggerClass, ...contentOptions } = options;

  return HoverCard({
    id,
    children: [
      HoverCardTrigger({ id, delay, closeDelay, href, asChild, class: triggerClass, children: trigger }),
      HoverCardContent({ id, ...contentOptions, children: content }),
    ],
  });
};

/** Icon "calendar-days" (Lucide) */
const calendarIcon = renderIcon(
  `<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>`,
  { class: "mr-2 size-4 opacity-70" }
);

/** Platzhalter für den Avatar (Initialen statt Bild, damit die Story ohne externe Dateien läuft) */
const avatarPlaceholder = `<span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">VC</span>`;

const profileCard = `<div class="flex justify-between gap-4">
  ${avatarPlaceholder}
  <div class="flex flex-col gap-1">
    <h4 class="text-sm font-semibold">@nextjs</h4>
    <p class="text-sm">The React Framework – created and maintained by @vercel.</p>
    <div class="flex items-center pt-2">${calendarIcon}<span class="text-xs text-muted-foreground">Joined December 2021</span></div>
  </div>
</div>`;

const meta: Meta<HoverCardStoryArgs> = {
  title: "UI-Library/HoverCard",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Eine Vorschau auf Inhalte hinter einem Link: Die Karte erscheint beim Überfahren des Triggers (nach einer Verzögerung) oder sofort bei Tastaturfokus und bleibt offen, solange sich der Zeiger darin befindet. Escape schließt sie. Funktioniert nur mit geladenem Datastar und einem Browser mit Popover API und CSS Anchor Positioning. Trigger und Content müssen dieselbe id wie die HoverCard tragen.",
      },
    },
  },
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
    align: { control: "select", options: ["start", "center", "end"] },
    sideOffset: { control: "number" },
    alignOffset: { control: "number" },
    delay: { control: "number" },
    closeDelay: { control: "number" },
    class: { control: "text" },
    triggerLabel: { control: "text" },
    text: { control: "text" },
  },
  args: {
    id: "hover-card-playground",
    side: "bottom",
    align: "center",
    sideOffset: 4,
    alignOffset: 4,
    delay: 600,
    closeDelay: 300,
    triggerLabel: "Hover Here",
    text: "The React Framework – created and maintained by @vercel.",
  },
  render: ({ id, triggerLabel, text, delay, closeDelay, ...content }) =>
    `<div class="p-24">${hoverCard(id, Button({ children: triggerLabel ?? "", variant: "link" }), `<p>${text ?? ""}</p>`, {
      ...content,
      delay,
      closeDelay,
      asChild: true,
    })}</div>`,
};

export default meta;
type Story = StoryObj<HoverCardStoryArgs>;

export const Playground: Story = {};

export const Basic: Story = {
  render: () =>
    `<div class="p-24">${hoverCard("hover-card-basic", Button({ children: "@nextjs", variant: "link" }), profileCard, {
      class: "w-80",
      asChild: true,
    })}</div>`,
};

export const Sides: Story = {
  render: () => {
    const sides = ["left", "top", "bottom", "right"] as const;

    const items = sides
      .map((side) =>
        hoverCard(`hover-card-side-${side}`, Button({ children: side, variant: "outline" }), `<p>Hover card on the ${side}.</p>`, {
          side,
          asChild: true,
        })
      )
      .join("");

    return `<div class="flex flex-wrap items-center justify-center gap-4 p-32">${items}</div>`;
  },
};

export const Alignments: Story = {
  render: () => {
    const aligns = ["start", "center", "end"] as const;

    const items = aligns
      .map((align) =>
        hoverCard(`hover-card-align-${align}`, Button({ children: `align ${align}`, variant: "outline" }), `<p>Aligned to the ${align}.</p>`, {
          side: "top",
          align,
          asChild: true,
        })
      )
      .join("");

    return `<div class="flex flex-wrap items-center justify-center gap-4 p-32">${items}</div>`;
  },
};

export const TriggerDelays: Story = {
  parameters: {
    docs: {
      description: {
        story: "Mit delay und closeDelay am Trigger lässt sich steuern, wann die Karte öffnet und schließt (hier 100 ms bzw. 200 ms).",
      },
    },
  },
  render: () =>
    `<div class="p-24">${hoverCard("hover-card-delays", Button({ children: "Hover", variant: "link" }), "<p>Content</p>", {
      delay: 100,
      closeDelay: 200,
      asChild: true,
    })}</div>`,
};

export const LinkTrigger: Story = {
  parameters: {
    docs: {
      description: {
        story: "Ohne asChild ist der Trigger ein Link (`<a>`), mit href zeigt er auf das Ziel, dessen Vorschau die Karte zeigt.",
      },
    },
  },
  render: () =>
    `<div class="p-24">${hoverCard("hover-card-link", "@nextjs", profileCard, {
      class: "w-80",
      href: "https://nextjs.org",
      triggerClass: "text-sm font-medium underline underline-offset-4",
    })}</div>`,
};
