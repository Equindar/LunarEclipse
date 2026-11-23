import type { Meta, StoryObj } from "@storybook/html-vite";

import { escapeHtml } from "../../utils/escapeHtml";
import { Sortable, SortableContent, SortableItem, SortableItemHandle } from "./Sortable";
import { sortableSignals } from "./Sortable.expressions";
import type { SortableArgs, SortableOrientation } from "./Sortable.types";

type SortableStoryArgs = Omit<SortableArgs, "children">;

const orientations: SortableOrientation[] = ["vertical", "horizontal", "mixed"];

const tricks = [
  { id: "1", title: "The 900", description: "The 900 is a trick where you spin 900 degrees in the air.", difficulty: "Expert", points: 9000 },
  { id: "2", title: "Indy Backflip", description: "The Indy Backflip is a trick where you backflip in the air.", difficulty: "Advanced", points: 4000 },
  { id: "3", title: "Pizza Guy", description: "The Pizza Guy is a trick where you flip the pizza guy.", difficulty: "Intermediate", points: 1500 },
  { id: "4", title: "Rocket Air", description: "The Rocket Air is a trick where you rocket air.", difficulty: "Advanced", points: 3000 },
  { id: "5", title: "Kickflip Backflip", description: "The Kickflip Backflip is a trick where you kickflip backflip.", difficulty: "Expert", points: 5000 },
  { id: "6", title: "FS 540", description: "The FS 540 is a trick where you fs 540.", difficulty: "Intermediate", points: 2000 },
];

const gripIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg>`;

const meta: Meta<SortableStoryArgs> = {
  title: "UI-Library/Sortable",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Drag-and-drop-Sortierung zum Umordnen von Einträgen. Port von Dice UI (Base), das auf shadcn/ui aufbaut. Funktioniert nur mit geladenem Datastar. Bedienung per Maus, Touch (langes Drücken) und Tastatur (Leertaste oder Enter nimmt auf, Pfeiltasten bewegen, Escape bricht ab). Die Reihenfolge steht im Signal `order`, Änderungen lösen das Event `sortable-change` aus. Es gibt kein SortableOverlay: der gezogene Eintrag folgt dem Zeiger selbst.",
      },
    },
  },
  argTypes: {
    orientation: { control: "select", options: orientations },
    class: { control: "text" },
  },
  args: { orientation: "vertical" },
};

export default meta;
type Story = StoryObj<SortableStoryArgs>;

/** Karten in einem Raster: der ganze Eintrag ist der Griff (`asHandle`), Richtung "mixed" */
export const Default: Story = {
  args: { orientation: "mixed" },
  render: (args) => {
    const id = "sortable-default";
    const cards = tricks.map((trick) =>
      SortableItem({
        value: trick.id,
        asHandle: true,
        sortableId: id,
        class: "flex size-full flex-col gap-1 rounded-md border bg-zinc-100 p-4 text-foreground shadow-sm dark:bg-zinc-900",
        children: [
          `<div class="text-sm leading-tight font-medium sm:text-base">${escapeHtml(trick.title)}</div>`,
          `<span class="line-clamp-2 hidden text-sm text-muted-foreground sm:inline-block">${escapeHtml(trick.description)}</span>`,
        ],
      })
    );

    return Sortable({
      ...args,
      id,
      value: tricks.map((trick) => trick.id),
      children: SortableContent({ class: "grid auto-rows-fr grid-cols-3 gap-2.5", children: cards }),
    });
  },
};

/** Tabellenzeilen mit eigenem Griff (`SortableItemHandle`), `tag` setzt `tbody` und `tr` */
export const WithHandle: Story = {
  render: (args) => {
    const id = "sortable-handle";
    const th = (label: string, extra = ""): string =>
      `<th class="h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground ${extra}">${label}</th>`;
    const rows = tricks.slice(0, 4).map((trick) =>
      SortableItem({
        value: trick.id,
        tag: "tr",
        id: `${id}-row-${trick.id}`,
        class: "border-b transition-colors hover:bg-muted/50",
        children: [
          `<td class="w-12.5 p-2 align-middle">${SortableItemHandle({
            itemId: `${id}-row-${trick.id}`,
            sortableId: id,
            class: "inline-flex size-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground",
            attributes: { "aria-label": `${trick.title} verschieben` },
            children: gripIcon,
          })}</td>`,
          `<td class="p-2 align-middle font-medium whitespace-nowrap">${escapeHtml(trick.title)}</td>`,
          `<td class="p-2 align-middle whitespace-nowrap text-muted-foreground">${trick.difficulty}</td>`,
          `<td class="p-2 text-right align-middle whitespace-nowrap text-muted-foreground">${trick.points}</td>`,
        ],
      })
    );

    const table = `<table class="w-full caption-bottom rounded-none border text-sm"><thead class="[&_tr]:border-b"><tr class="border-b bg-accent/50">${th("", "w-[50px]")}${th("Trick")}${th("Difficulty")}${th("Points", "text-right")}</tr></thead>${SortableContent({
      tag: "tbody",
      children: rows,
    })}</table>`;

    return Sortable({ ...args, id, value: tricks.slice(0, 4).map((trick) => trick.id), children: table });
  },
};

/** Einfache Werte (Strings): Eintrag und `value` sind identisch */
export const PrimitiveValues: Story = {
  render: (args) => {
    const id = "sortable-primitive";
    const items = ["Item 1", "Item 2", "Item 3", "Item 4"];

    return Sortable({
      ...args,
      id,
      value: items,
      children: SortableContent({
        class: "flex flex-col gap-2",
        children: items.map((item) =>
          SortableItem({ value: item, asHandle: true, sortableId: id, class: "rounded-md border bg-card px-4 py-3 text-sm", children: escapeHtml(item) })
        ),
      }),
    });
  },
};

/** Horizontale Liste: Pfeiltasten links und rechts, Bewegung nur auf der x-Achse */
export const Horizontal: Story = {
  args: { orientation: "horizontal" },
  render: (args) => {
    const id = "sortable-horizontal";
    const items = ["Eins", "Zwei", "Drei", "Vier"];

    return Sortable({
      ...args,
      id,
      value: items,
      children: SortableContent({
        class: "flex gap-2",
        children: items.map((item) =>
          SortableItem({ value: item, asHandle: true, sortableId: id, class: "rounded-md border bg-card px-4 py-3 text-sm", children: item })
        ),
      }),
    });
  },
};

/** Ein deaktivierter Eintrag lässt sich nicht aufnehmen, wird aber von den anderen verdrängt */
export const Disabled: Story = {
  render: (args) => {
    const id = "sortable-disabled";
    const items = ["Frei", "Gesperrt", "Frei 2"];

    return Sortable({
      ...args,
      id,
      value: items,
      children: SortableContent({
        class: "flex flex-col gap-2",
        children: items.map((item) =>
          SortableItem({
            value: item,
            asHandle: true,
            disabled: item === "Gesperrt",
            sortableId: id,
            class: "rounded-md border bg-card px-4 py-3 text-sm",
            children: item,
          })
        ),
      }),
    });
  },
};

/** Zustand über Signale: `activeId` und `order` ersetzen Overlay und `onValueChange`, das Event `sortable-change` liefert die Details */
export const WithSignals: Story = {
  render: (args) => {
    const id = "sortable-signals";
    const items = ["A", "B", "C"];
    const signals = sortableSignals(id, items);

    const list = Sortable({
      ...args,
      id,
      value: items,
      children: SortableContent({
        class: "flex flex-col gap-2",
        children: items.map((item) =>
          SortableItem({ value: item, asHandle: true, sortableId: id, class: "rounded-md border bg-card px-4 py-3 text-sm", children: item })
        ),
      }),
    });

    return `${list}<p class="mt-3 text-sm text-muted-foreground">Aktiv: <span data-text="${escapeHtml(signals.signal("activeId"))}"></span> | Reihenfolge: <span data-text="${escapeHtml(signals.signal("order"))}"></span></p>`;
  },
};
