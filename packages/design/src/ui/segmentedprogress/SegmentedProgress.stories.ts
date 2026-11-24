import type { Meta, StoryObj } from "@storybook/html-vite";

import { renderAttributes } from "../../utils/renderHtmlAttributes";
import { createSignals } from "../../utils/SignalManager";
import { ProgressLabel, ProgressValue } from "../progress";
import { SegmentedProgress } from "./SegmentedProgress";
import type { SegmentedProgressArgs } from "./SegmentedProgress.types";

const frame = (inner: string): string => `<div class="w-64">${inner}</div>`;

interface SegmentedProgressStorySignals {
  value: number;
}

const meta: Meta<SegmentedProgressArgs> = {
  title: "UI-Library/Progress/SegmentedProgress",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Fortschrittsanzeige aus gleich breiten Segmenten, abgerundet (`rounded`) oder als nach rechts geneigte Parallelogramme (`slanted`). Die Segmente vor dem aktuellen Wert sind voll, das aktuelle ist teilweise gefüllt. Für einen durchgehenden Balken (z. B. Ladebalken) gibt es das primitive `Progress`. Label und Wertanzeige kommen von `ProgressLabel` und `ProgressValue`. Mit `valueSignal` folgt die Füllung einem Datastar-Signal (funktioniert nur mit geladenem Datastar).",
      },
    },
  },
  argTypes: {
    value: { control: { type: "range", min: 1, max: 100, step: 1 }, description: "Wert" },
    min: { control: "number" },
    max: { control: "number" },
    segments: { control: { type: "number", min: 1, max: 100, step: 1 } },
    shape: { control: "inline-radio", options: ["rounded", "slanted"] },
    class: { control: "text" },
  },
  args: {
    value: 60,
    segments: 10,
    shape: "rounded",
    attributes: { "aria-label": "Fortschritt" },
  },
  render: (args) => frame(SegmentedProgress(args)),
};

export default meta;
type Story = StoryObj<SegmentedProgressArgs>;

export const Playground: Story = {};

/** Nach rechts geneigte Parallelogramme */
export const Slanted: Story = {
  args: { shape: "slanted" },
};

/** Weniger Segmente, der Wert liegt zwischen zwei Segmenten: das aktuelle ist teilweise gefüllt */
export const FewSegments: Story = {
  args: { segments: 5, value: 50 },
  render: (args) =>
    SegmentedProgress({
      segments: args.segments,
      value: args.value
    }),
};

/** Mit Label und Wertanzeige: Root mit `hasLabel`, Label mit derselben `id` */
export const WithLabel: Story = {
  render: (args) =>
    SegmentedProgress({
      id: "segmented-progress-label",
      hasLabel: true,
      value: args.value,
      shape: "slanted",
      class: "w-full max-w-sm",
      children: [
        ProgressLabel({ id: "segmented-progress-label", value: args.value, children: "Upload progress" }),
        ProgressValue({ value: args.value }),
      ],
    }),
};

/** Gesteuert über ein Signal; der Regler ist ein nativer Range-Input */
export const Controlled: Story = {
  render: () => {
    const signals = createSignals<SegmentedProgressStorySignals>("segmented-progress-controlled", { value: 50 });

    const input = renderAttributes({
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      value: 50,
      class: "w-full accent-primary",
      "aria-label": "Wert einstellen",
      "data-on:input": signals.set("value", "Number(el.value)"),
    });

    return `<div class="flex w-full max-w-sm flex-col gap-4"${renderAttributes({ "data-signals": signals.dataSignals })}>${SegmentedProgress({
      value: 50,
      valueSignal: signals.signal("value"),
      shape: "slanted",
      class: "w-full",
      attributes: { "aria-label": "Fortschritt" },
    })}<input${input}></div>`;
  },
};

/** Ohne `value` ist der Fortschritt unbestimmt: alle Segmente leer */
export const Indeterminate: Story = {
  args: { value: undefined },
};

/** Die Höhe wird am Track gesetzt (data-slot="segmented-progress-track") */
export const Sizes: Story = {
  render: () =>
    `<div class="flex w-full max-w-sm flex-col gap-6">${[
      SegmentedProgress({ value: 60, shape: "slanted", class: "[&_[data-slot=segmented-progress-track]]:h-1", attributes: { "aria-label": "Klein" } }),
      SegmentedProgress({ value: 60, shape: "slanted", attributes: { "aria-label": "Standard" } }),
      SegmentedProgress({ value: 60, shape: "slanted", class: "[&_[data-slot=segmented-progress-track]]:h-4", attributes: { "aria-label": "Groß" } }),
    ].join("")}</div>`,
};
