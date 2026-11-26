import type { Meta, StoryObj } from "@storybook/html-vite";

import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { Scroller } from "./Scroller";
import type { ScrollerArgs, ScrollerOrientation, ScrollTriggerMode } from "./Scroller.types";

type ScrollerStoryArgs = Omit<ScrollerArgs, "children" | "attributes">;

/** Einfache Karte als Inhalt (eigenes Markup, damit die Stories nicht von der Card-Komponente abhängen) */
const card = (title: string, text: string, extraClass = ""): string =>
  `<div class="${cn("rounded-xl border bg-card p-4 text-card-foreground", extraClass)}"><div class="text-sm font-medium">${escapeHtml(title)}</div><p class="text-sm text-muted-foreground">${escapeHtml(text)}</p></div>`;

const cards = (count: number, extraClass = ""): string[] =>
  Array.from({ length: count }, (_, index) =>
    card(`Karte ${index + 1}`, "Das ist eine Kartenbeschreibung.", extraClass)
  );

/** Layout je Orientierung: Klassen für den Scroller und für die Karten */
const layout: Record<ScrollerOrientation, { scroller: string; card: string }> = {
  vertical: { scroller: "h-72 w-full max-w-sm space-y-3", card: "" },
  horizontal: { scroller: "flex w-full max-w-lg gap-3", card: "w-48 shrink-0" },
};

/** Scroller mit Karten passend zur Orientierung */
const cardScroller = (args: ScrollerStoryArgs, count = 30): string => {
  const orientation = args.orientation ?? "vertical";
  const { scroller, card: cardClass } = layout[orientation];

  return Scroller({ ...args, class: cn(scroller, args.class), children: cards(count, cardClass) });
};

const triggerModes: ScrollTriggerMode[] = ["press", "hover", "click"];

const meta: Meta<ScrollerStoryArgs> = {
  title: "UI-Library/Scroller",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Ein scrollbarer Container mit Scroll-Schatten an den Rändern und optionalen Navigationsbuttons. Port von Dice UI (Base). Die Schatten und die Buttons werden von Datastar gesteuert und funktionieren nur mit geladenem Datastar; ohne Datastar scrollt der Container normal, zeigt aber weder Schatten noch Buttons.",
      },
    },
  },
  argTypes: {
    orientation: { control: "select", options: ["vertical", "horizontal"] },
    hideScrollbar: { control: "boolean" },
    size: { control: "number" },
    offset: { control: "number" },
    withNavigation: { control: "boolean" },
    scrollStep: { control: "number" },
    scrollTriggerMode: { control: "select", options: triggerModes },
    class: { control: "text" },
  },
  args: {
    id: "scroller-playground",
    orientation: "vertical",
    hideScrollbar: false,
    size: 40,
    offset: 0,
    withNavigation: false,
    scrollStep: 40,
    scrollTriggerMode: "press",
  },
  render: (args) => `<div class="p-4">${cardScroller(args)}</div>`,
};

export default meta;
type Story = StoryObj<ScrollerStoryArgs>;

export const Playground: Story = {};

/** Standard: vertikales Scrollen, die Schatten erscheinen an den Rändern, zu denen noch Inhalt vorhanden ist */
export const Vertical: Story = {
  render: () => `<div class="p-4">${cardScroller({}, 50)}</div>`,
};

/** `orientation: "horizontal"` aktiviert das horizontale Scrollen */
export const Horizontal: Story = {
  render: () => `<div class="p-4">${cardScroller({ orientation: "horizontal" })}</div>`,
};

/** `hideScrollbar: true` blendet die Scrollbar aus, das Scrollen bleibt möglich */
export const HiddenScrollbar: Story = {
  render: () => `<div class="p-4">${cardScroller({ hideScrollbar: true })}</div>`,
};

/** `withNavigation: true` zeigt Buttons, solange in die Richtung gescrollt werden kann (Standard-Auslöser: gedrückt halten) */
export const WithNavigation: Story = {
  render: () => `<div class="p-4">${cardScroller({ id: "scroller-navigation-vertical", withNavigation: true })}</div>`,
};

export const WithNavigationHorizontal: Story = {
  render: () =>
    `<div class="p-4">${cardScroller({ id: "scroller-navigation-horizontal", orientation: "horizontal", withNavigation: true })}</div>`,
};

/** `scrollTriggerMode`: "press" (gedrückt halten), "hover" (Mauszeiger darüber) und "click" (ein Schritt pro Klick) */
export const TriggerModes: Story = {
  render: () =>
    `<div class="flex flex-col gap-6 p-4">${triggerModes
      .map(
        (mode) =>
          `<div class="space-y-2"><div class="text-sm font-medium">${escapeHtml(mode)}</div>${cardScroller({
            id: `scroller-trigger-${mode}`,
            orientation: "horizontal",
            withNavigation: true,
            scrollTriggerMode: mode,
            scrollStep: mode === "click" ? 160 : 40,
          })}</div>`
      )
      .join("")}</div>`,
};

/** `size` legt die Breite des Schattens fest (Pixel) */
export const ShadowSize: Story = {
  render: () =>
    `<div class="flex flex-wrap gap-6 p-4">${[16, 40, 80]
      .map(
        (size) =>
          `<div class="space-y-2"><div class="text-sm font-medium">size: ${size}</div>${cardScroller({ size }, 20)}</div>`
      )
      .join("")}</div>`,
};
