import type { Meta, StoryObj } from "@storybook/html-vite";

import { Badge } from "../badge";
import { BadgeOverflow } from "./BadgeOverflow";

type BadgeOverflowStoryArgs = {
  /** Anzahl der angezeigten Zeilen */
  lineCount?: number;
  /** Anzahl der Einträge (aus der Technologie-Liste, bei mehr als 20 wiederholt) */
  itemCount?: number;
  /** Zusätzliche CSS-Klassen für das Wurzelelement */
  class?: string;
};

const technologies = [
  "React",
  "TypeScript",
  "Next.js",
  "Tailwind CSS",
  "Shadcn UI",
  "Radix UI",
  "Zustand",
  "React Query",
  "Prisma",
  "PostgreSQL",
  "Node.js",
  "Vite",
  "Storybook",
  "Turborepo",
  "Hono",
  "Datastar",
  "Playwright",
  "Vitest",
  "ESLint",
  "Biome",
];

/** Liste mit `count` Einträgen; ab dem 21. Eintrag mit Nummer, damit alle Labels verschieden sind */
const makeItems = (count: number): string[] =>
  Array.from({ length: count }, (_, i) => {
    const base = technologies[i % technologies.length] ?? "Item";
    return i < technologies.length ? base : `${base} ${Math.floor(i / technologies.length) + 1}`;
  });

const renderBadge = (_item: unknown, label: string): string => Badge({ children: label });

const meta: Meta<BadgeOverflowStoryArgs> = {
  title: "UI-Library/BadgeOverflow",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Zeigt nur so viele Badges, wie in die gewählte Zeilenanzahl passen, und dahinter einen Indikator mit der Anzahl der ausgeblendeten Einträge. Port von Dice UI (Base). Das Ausblenden und die Messung laufen in `data-init` und bei jeder Breitenänderung per ResizeObserver, die Komponente funktioniert deshalb nur mit geladenem Datastar. Das Wurzelelement braucht eine definierte Breite. Ohne Datastar bleibt die Höhe auf die erste Zeilenanzahl begrenzt und der Indikator unsichtbar.",
      },
    },
  },
  argTypes: {
    lineCount: { control: { type: "number", min: 1, max: 6, step: 1 } },
    itemCount: { control: { type: "range", min: 0, max: 40, step: 1 } },
    class: { control: "text" },
  },
  args: {
    lineCount: 1,
    itemCount: 20,
    class: "",
  },
  render: ({ lineCount, itemCount, class: className }) =>
    `<div class="w-96 max-w-full">${BadgeOverflow({
      items: makeItems(itemCount ?? 20),
      lineCount,
      class: className,
      renderBadge,
    })}</div>`,
};

export default meta;
type Story = StoryObj<BadgeOverflowStoryArgs>;

export const Playground: Story = {};

/** Primitive Arrays: `getBadgeLabel` ist optional, der Eintrag selbst ist das Label */
export const WithPrimitiveArray: Story = {
  render: () =>
    `<div class="w-96 max-w-full">${BadgeOverflow({
      items: ["React", "TypeScript", "Next.js"],
      renderBadge,
    })}</div>`,
};

/** Arrays von Objekten: `getBadgeLabel` ist erforderlich */
export const WithObjectArray: Story = {
  render: () =>
    `<div class="w-96 max-w-full">${BadgeOverflow({
      items: technologies.map((name, id) => ({ id, name })),
      getBadgeLabel: (item) => item.name,
      renderBadge: (_item, label) => Badge({ variant: "secondary", children: label }),
    })}</div>`,
};

/** Mehrere Zeilen über `lineCount` */
export const MultiLine: Story = {
  render: () =>
    `<div class="w-96 max-w-full">${BadgeOverflow({
      items: makeItems(40),
      lineCount: 3,
      renderBadge,
    })}</div>`,
};

/** Eigener Indikator über `renderOverflow`. Der Zähler (`count`) muss genau einmal im Markup stehen */
export const CustomOverflow: Story = {
  render: () =>
    `<div class="w-96 max-w-full">${BadgeOverflow({
      items: makeItems(40),
      lineCount: 2,
      renderBadge: (_item, label) => Badge({ variant: "outline", children: label }),
      renderOverflow: (count) => Badge({ variant: "secondary", children: ["+", count, " weitere"] }),
    })}</div>`,
};

/** Mit Padding und Rahmen über `class`: das Padding zählt nicht zur verfügbaren Breite */
export const WithPaddingAndBorder: Story = {
  render: () =>
    `<div class="w-96 max-w-full">${BadgeOverflow({
      items: makeItems(20),
      lineCount: 2,
      class: "rounded-lg border p-2",
      renderBadge,
    })}</div>`,
};

/** Container per Maus in der Breite ziehen (unten rechts): die Anzahl sichtbarer Badges folgt der Breite */
export const ResizableContainer: Story = {
  render: () =>
    `<div class="w-96 max-w-full resize-x overflow-auto rounded-lg border p-2">${BadgeOverflow({
      items: makeItems(20),
      lineCount: 2,
      renderBadge,
    })}</div>`,
};
