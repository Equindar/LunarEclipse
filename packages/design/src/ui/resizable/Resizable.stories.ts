import type { Meta, StoryObj } from "@storybook/html-vite";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./Resizable";
import type { ResizableOrientation, ResizablePanelGroupArgs } from "./Resizable.types";

type ResizableStoryArgs = ResizablePanelGroupArgs & {
  /** Startgrösse des ersten Panels in Prozent */
  firstSize?: number;
  /** Mindestgrösse des ersten Panels in Prozent */
  minSize?: number;
  /** Maximalgrösse des ersten Panels in Prozent */
  maxSize?: number;
  /** Zeigt den sichtbaren Griff am Handle */
  withHandle?: boolean;
};

/** Inhalt eines Panels: zentrierter Text */
const content = (label: string, heightClass = "h-full"): string =>
  `<div class="flex ${heightClass} items-center justify-center p-6"><span class="font-semibold">${label}</span></div>`;

/** Rahmen der Beispiele: feste Höhe, damit Prozentwerte und verschachtelte Gruppen sicher auflösen */
const frame = "h-[200px] max-w-md rounded-lg border md:min-w-[450px]";

const meta: Meta<ResizableStoryArgs> = {
  title: "UI-Library/Resizable",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Zugängliche Panel-Gruppen mit veränderbarer Grösse und Tastaturbedienung. Port von shadcn/ui (Base). " +
          "Die Drag-Logik ist eine eigene Datastar-Umsetzung mit Pointer Events (react-resizable-panels gibt es hier nicht): " +
          "Die Grössen liegen als flex-grow im DOM, Pfeiltasten verschieben um 10 Prozent, Home und End springen an die Grenzen. " +
          "Funktioniert nur mit geladenem Datastar; ohne Datastar bleiben die Startgrössen stehen. " +
          "Der Handle braucht die `orientation` der Gruppe, weil es keinen React-Context gibt.",
      },
    },
  },
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    firstSize: { control: { type: "number", min: 0, max: 100, step: 5 } },
    minSize: { control: { type: "number", min: 0, max: 100, step: 5 } },
    maxSize: { control: { type: "number", min: 0, max: 100, step: 5 } },
    withHandle: { control: "boolean" },
    class: { control: "text" },
  },
  args: {
    orientation: "horizontal",
    firstSize: 50,
    minSize: 10,
    maxSize: 90,
    withHandle: true,
    class: frame,
  },
  render: ({ orientation, firstSize, minSize, maxSize, withHandle, ...args }) => {
    const direction: ResizableOrientation = orientation ?? "horizontal";

    return ResizablePanelGroup({
      ...args,
      orientation: direction,
      children: [
        ResizablePanel({
          defaultSize: firstSize,
          minSize,
          maxSize,
          children: content("One"),
        }),
        ResizableHandle({ orientation: direction, withHandle }),
        ResizablePanel({ children: content("Two") }),
      ],
    });
  },
};

export default meta;
type Story = StoryObj<ResizableStoryArgs>;

/** Spielwiese mit allen Controls */
export const Playground: Story = {};

/** Horizontal mit verschachtelter vertikaler Gruppe (Beispiel der Docs) */
export const Horizontal: Story = {
  render: () =>
    ResizablePanelGroup({
      orientation: "horizontal",
      class: frame,
      children: [
        ResizablePanel({ defaultSize: 50, children: content("One") }),
        ResizableHandle({ orientation: "horizontal" }),
        ResizablePanel({
          defaultSize: 50,
          children: ResizablePanelGroup({
            orientation: "vertical",
            children: [
              ResizablePanel({ defaultSize: 25, children: content("Two") }),
              ResizableHandle({ orientation: "vertical" }),
              ResizablePanel({ defaultSize: 75, children: content("Three") }),
            ],
          }),
        }),
      ],
    }),
};

/** Vertikal: `orientation: "vertical"` an Gruppe und Handle */
export const Vertical: Story = {
  render: () =>
    ResizablePanelGroup({
      orientation: "vertical",
      class: frame,
      children: [
        ResizablePanel({ defaultSize: 25, children: content("Header") }),
        ResizableHandle({ orientation: "vertical" }),
        ResizablePanel({ defaultSize: 75, children: content("Content") }),
      ],
    }),
};

/** Sichtbarer Griff über `withHandle` */
export const WithHandle: Story = {
  render: () =>
    ResizablePanelGroup({
      orientation: "horizontal",
      class: frame,
      children: [
        ResizablePanel({ defaultSize: 25, children: content("Sidebar") }),
        ResizableHandle({ orientation: "horizontal", withHandle: true }),
        ResizablePanel({ defaultSize: 75, children: content("Content") }),
      ],
    }),
};

/** Grenzen über `minSize` und `maxSize` (hier: das erste Panel bleibt zwischen 20 und 40 Prozent) */
export const Constraints: Story = {
  render: () =>
    ResizablePanelGroup({
      orientation: "horizontal",
      class: frame,
      children: [
        ResizablePanel({ defaultSize: 30, minSize: 20, maxSize: 40, children: content("20 bis 40 %") }),
        ResizableHandle({ orientation: "horizontal", withHandle: true }),
        ResizablePanel({ children: content("Rest") }),
      ],
    }),
};

/** Panels ohne `defaultSize` teilen sich den Platz zu gleichen Teilen (Berechnung beim Laden von Datastar) */
export const EqualPanels: Story = {
  render: () =>
    ResizablePanelGroup({
      orientation: "horizontal",
      class: frame,
      children: [
        ResizablePanel({ children: content("One") }),
        ResizableHandle({ orientation: "horizontal" }),
        ResizablePanel({ children: content("Two") }),
        ResizableHandle({ orientation: "horizontal" }),
        ResizablePanel({ children: content("Three") }),
      ],
    }),
};

/** Rechts-nach-links: Die Richtung der Pfeiltasten und des Ziehens folgt `dir="rtl"` */
export const Rtl: Story = {
  render: () =>
    `<div dir="rtl">${ResizablePanelGroup({
      orientation: "horizontal",
      class: frame,
      children: [
        ResizablePanel({ defaultSize: 25, children: content("واحد") }),
        ResizableHandle({ orientation: "horizontal", withHandle: true }),
        ResizablePanel({
          defaultSize: 75,
          children: ResizablePanelGroup({
            orientation: "vertical",
            children: [
              ResizablePanel({ defaultSize: 25, children: content("اثنان") }),
              ResizableHandle({ orientation: "vertical" }),
              ResizablePanel({ defaultSize: 75, children: content("ثلاثة") }),
            ],
          }),
        }),
      ],
    })}</div>`,
};
