import type { Meta, StoryObj } from "@storybook/html-vite";

import { escapeHtml } from "../../utils/escapeHtml";
import { Input } from "../input";
import { Label } from "../label";
import { Slider } from "./Slider";
import { sliderSignals } from "./Slider.expressions";
import type { SliderArgs } from "./Slider.types";

/** Schmaler Container, damit horizontale Slider nicht die ganze Docs-Seite füllen */
const wrap = (inner: string): string => `<div class="mx-auto w-full max-w-xs">${inner}</div>`;
const frame = (inner: string): string => `<div class="w-64">${inner}</div>`;

const meta: Meta<SliderArgs> = {
  title: "UI-Library/Slider",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Ein Eingabeelement, mit dem ein Wert oder ein Bereich aus einem Intervall gewählt wird. Port von shadcn/ui (Base). Ein Wert in `defaultValue` ergibt einen Thumb, zwei Werte einen Bereich, mehr Werte mehrere Thumbs. Ziehen und Tastatur funktionieren nur mit geladenem Datastar; die aktuellen Werte liegen im Signal `$<id>.values` (Bindestriche der ID werden zu Unterstrichen).",
      },
    },
  },
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    disabled: { control: "boolean" },
    dir: { control: "select", options: [undefined, "ltr", "rtl"] },
    class: { control: "text" },
  },
  args: {
    id: "slider-default",
    defaultValue: [33],
    min: 0,
    max: 100,
    step: 1,
    ariaLabel: "Wert",
  },
  render: (args) => frame(Slider(args)),
};

export default meta;
type Story = StoryObj<SliderArgs>;

export const Default: Story = {};

/** Zwei Werte ergeben einen Bereich */
export const Range: Story = {
  args: { id: "slider-range", defaultValue: [25, 50], ariaLabel: "Bereich" },
  render: (args) => frame(Slider(args))
};

/** Mehrere Werte ergeben mehrere Thumbs; sie laufen nicht aneinander vorbei */
export const MultipleThumbs: Story = {
  args: { id: "slider-multiple", defaultValue: [10, 20, 70], ariaLabel: "Wert" },
};

/** `orientation: "vertical"`; die Höhe kommt vom Container (Root nutzt die volle Höhe, mindestens 10rem) */
export const Vertical: Story = {
  args: {
    orientation: "vertical",
    defaultValue: [50]
  },
  render: (args) =>
    `<div class="mx-auto flex h-40 w-full max-w-xs items-center justify-center gap-6">${[
      Slider({ id: "slider-vertical-a", defaultValue: args.defaultValue, orientation: args.orientation, ariaLabel: "Lautstärke", ...args }),
      Slider({ id: "slider-vertical-b", defaultValue: [25], orientation: args.orientation, ariaLabel: "Bass" }),
    ].join("")}</div>`,
};

/** Die Werte stehen im Signal und lassen sich per `data-text` an anderer Stelle anzeigen */
export const Controlled: Story = {
  render: () => {
    const id = "slider-controlled";
    const values = sliderSignals(id).signal("values");

    return wrap(`<div class="grid gap-3">
  <div class="flex items-center justify-between gap-2">
    <label id="${id}-label" class="text-sm font-medium">Temperature</label>
    <span class="text-sm text-muted-foreground" data-text="${escapeHtml(`${values}.join(', ')`)}">0.3, 0.7</span>
  </div>
  ${Slider({ id, defaultValue: [0.3, 0.7], min: 0, max: 1, step: 0.1, ariaLabelledby: `${id}-label` })}
</div>`);
  },
};

/** Schrittweite: der Wert rastet auf Vielfache von `step` ein (PageUp/PageDown bewegen um 10 Schritte) */
export const Steps: Story = {
  args: { id: "slider-steps", defaultValue: [50], step: 10, ariaLabel: "Wert in 10er-Schritten" },
};

/** Deaktiviert: kein Ziehen, kein Fokus */
export const Disabled: Story = {
  args: { id: "slider-disabled", defaultValue: [50], disabled: true, ariaLabel: "Wert" },
};


/** Deaktiviert: kein Ziehen, kein Fokus */
export const Example: Story = {
  args: { id: "slider-example", defaultValue: [50], ariaLabel: "Wert" },
  render: (args) => {
    return `
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-col gap-2">
        ${Label({ for: "label-input-slider", children: "Label" })}
        ${Slider({ id: "label-input-slider", ...args})}
      </div>
      ${Input({ type: "number", value: "45"})}
    </div>
    `
  }
};

/** Mit `name` wird je Thumb ein verstecktes Input gerendert, das mit dem Formular abgeschickt wird */
export const InForm: Story = {
  render: () =>
    wrap(
      `<form onsubmit="return false;" class="grid gap-3">${Slider({
        id: "slider-form",
        name: "preis",
        defaultValue: [20, 80],
        ariaLabel: "Preis",
      })}</form>`
    ),
};

/** RTL: `dir: "rtl"` kehrt die Richtung eines horizontalen Sliders um (Pfeiltasten und Ziehen) */
export const Rtl: Story = {
  render: () =>
    `<div dir="rtl" class="mx-auto grid w-full max-w-xs gap-3">
  <label id="slider-rtl-label" class="text-sm font-medium">درجة الحرارة</label>
  ${Slider({ id: "slider-rtl", dir: "rtl", defaultValue: [30, 70], ariaLabelledby: "slider-rtl-label" })}
</div>`,
};
