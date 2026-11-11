import type { Meta, StoryObj } from "@storybook/html-vite";

import { Skeleton } from "./Skeleton";
import type { SkeletonArgs } from "./Skeleton.types";

const meta: Meta<SkeletonArgs> = {
  title: "UI-Library/Skeleton",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Platzhalter, solange Inhalte laden. Port von shadcn/ui (Base). Größe und Form werden über `class` gesteuert. Die Komponente hat keine Datastar-Logik.",
      },
    },
  },
  argTypes: {
    class: { control: "text" },
  },
  args: {
    class: "h-[20px] w-[100px] rounded-full",
  },
  render: (args) => Skeleton(args),
};

export default meta;
type Story = StoryObj<SkeletonArgs>;

export const Default: Story = {};

/** Runder Platzhalter für einen Avatar, daneben zwei Textzeilen */
export const Avatar: Story = {
  render: () =>
    `<div class="flex items-center gap-4">${Skeleton({ class: "size-10 shrink-0 rounded-full" })}<div class="grid gap-2">${[
      Skeleton({ class: "h-4 w-[150px]" }),
      Skeleton({ class: "h-4 w-[100px]" }),
    ].join("")}</div></div>`,
};

/** Platzhalter für eine Karte (die Karte selbst ist hier schlichtes Markup, da die Card-Komponente separat portiert wird) */
export const Card: Story = {
  render: () =>
    `<div class="flex w-full max-w-xs flex-col gap-4 rounded-xl border bg-card p-4 text-card-foreground"><div class="grid gap-2">${[
      Skeleton({ class: "h-4 w-2/3" }),
      Skeleton({ class: "h-4 w-1/2" }),
    ].join("")}</div>${Skeleton({ class: "aspect-video w-full" })}</div>`,
};

/** Mehrere Textzeilen unterschiedlicher Länge */
export const Text: Story = {
  render: () =>
    `<div class="grid w-62.5 gap-2">${[
      Skeleton({ class: "h-4 w-full" }),
      Skeleton({ class: "h-4 w-5/6" }),
      Skeleton({ class: "h-4 w-4/6" }),
    ].join("")}</div>`,
};

/** Platzhalter für ein Formular: Label, Eingabefeld und Button */
export const Form: Story = {
  render: () => {
    const field = (labelWidth: string): string =>
      `<div class="grid gap-2">${Skeleton({ class: `h-4 ${labelWidth}` })}${Skeleton({ class: "h-8 w-full" })}</div>`;

    return `<div class="grid w-full max-w-sm gap-6">${field("w-20")}${field("w-28")}${Skeleton({ class: "h-8 w-24" })}</div>`;
  },
};

/** Platzhalter für eine Tabelle: Kopfzeile und mehrere Datenzeilen mit je drei Spalten */
export const Table: Story = {
  render: () => {
    const row = (): string =>
      `<div class="flex gap-4">${[1, 2, 3].map(() => Skeleton({ class: "h-4 flex-1" })).join("")}</div>`;

    return `<div class="grid w-full max-w-md gap-3">${Array.from({ length: 5 }, row).join("")}</div>`;
  },
};

/** Eigene Attribute, z. B. für Screenreader: `role="status"` mit `aria-label` */
export const WithAccessibleLabel: Story = {
  render: () =>
    Skeleton({
      class: "h-4 w-[200px]",
      attributes: { role: "status", "aria-label": "Inhalt wird geladen" },
    }),
};
