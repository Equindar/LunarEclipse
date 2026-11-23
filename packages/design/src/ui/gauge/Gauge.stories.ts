import type { Meta, StoryObj } from "@storybook/html-vite";

import { Gauge, GaugeCombined, GaugeIndicator, GaugeLabel, GaugeRange, GaugeTrack, GaugeValueText } from "./Gauge";
import type { GaugeCombinedArgs, GaugeValueTextFormatter } from "./Gauge.types";

type ValueTextFormat = "default" | "percentage" | "fraction" | "points";

type GaugeStoryArgs = Omit<GaugeCombinedArgs, "getValueText"> & {
  /** Format des angezeigten Texts (steuert getValueText) */
  valueTextFormat?: ValueTextFormat;
};

const formatters: Record<ValueTextFormat, GaugeValueTextFormatter | undefined> = {
  default: undefined,
  percentage: (value, min, max) => `${Math.round(((value - min) / (max - min)) * 100)}%`,
  fraction: (value, _min, max) => `${value}/${max}`,
  points: (value) => `${value} points`,
};

const meta: Meta<GaugeStoryArgs> = {
  title: "UI-Library/Gauge",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Zeigt einen Wert auf einem Kreis oder Teilkreis, z. B. für Dashboards und Kennzahlen. Port von Dice UI (Base), das auf shadcn/ui basiert. Rein statisch, es wird kein Datastar benötigt. Farben kommen über `currentColor` und lassen sich mit Text-Klassen setzen (Track, Range, Werttext, Label). Die Füllanimation (`stroke-dashoffset`) läuft nur, wenn sich der Wert im bestehenden DOM ändert.",
      },
    },
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    min: { control: "number" },
    max: { control: "number" },
    size: { control: { type: "range", min: 60, max: 240, step: 4 } },
    thickness: { control: { type: "range", min: 2, max: 32, step: 1 } },
    startAngle: { control: { type: "range", min: -360, max: 360, step: 5 } },
    endAngle: { control: { type: "range", min: -360, max: 720, step: 5 } },
    valueTextFormat: { control: "select", options: ["default", "percentage", "fraction", "points"] },
    label: { control: "text" },
    class: { control: "text" },
    id: { control: "text" },
  },
  args: {
    id: "gauge-playground",
    value: 75,
    size: 120,
    thickness: 8,
    startAngle: 0,
    endAngle: 360,
    valueTextFormat: "default",
    label: "Performance",
  },
  render: ({ valueTextFormat = "default", ...args }) => GaugeCombined({ ...args, getValueText: formatters[valueTextFormat] }),
};

export default meta;
type Story = StoryObj<GaugeStoryArgs>;

export const Playground: Story = {};

/** Einzelne Teile zusammengesetzt: Der Root übergibt den Context an die Children-Funktion */
export const Composition: Story = {
  render: () =>
    Gauge({
      id: "gauge-composition",
      value: 64,
      children: (context) => [
        GaugeIndicator({ context, children: [GaugeTrack({ context }), GaugeRange({ context })] }),
        GaugeValueText({ context }),
        GaugeLabel({ context, children: "Auslastung" }),
      ],
    }),
};

/** Verschiedene Grössen; die Strichstärke wird mit der Grösse angepasst */
export const Sizes: Story = {
  render: () => {
    const sizes: { size: number; thickness: number; textClass: string }[] = [
      { size: 80, thickness: 6, textClass: "text-base" },
      { size: 120, thickness: 8, textClass: "text-2xl" },
      { size: 160, thickness: 10, textClass: "text-3xl" },
      { size: 200, thickness: 12, textClass: "text-4xl" },
    ];

    return `<div class="flex flex-wrap items-end gap-8">${sizes
      .map(({ size, thickness, textClass }) =>
        Gauge({
          id: `gauge-sizes-${size}`,
          value: 70,
          size,
          thickness,
          children: (context) => [
            GaugeIndicator({ context, children: [GaugeTrack({ context }), GaugeRange({ context })] }),
            GaugeValueText({ context, class: textClass }),
            GaugeLabel({ context, children: `${size}px` }),
          ],
        }),
      )
      .join("")}</div>`;
  },
};

/** Farben über Text-Klassen an Track, Range, Werttext und Label */
export const Colors: Story = {
  render: () => {
    const colors: { id: string; label: string; value: number; track: string; range: string; text: string }[] = [
      { id: "cpu", label: "CPU", value: 42, track: "text-green-200 dark:text-green-950", range: "text-green-500", text: "text-green-700 dark:text-green-300" },
      { id: "memory", label: "Speicher", value: 68, track: "text-blue-200 dark:text-blue-950", range: "text-blue-500", text: "text-blue-700 dark:text-blue-300" },
      { id: "disk", label: "Datenträger", value: 83, track: "text-amber-200 dark:text-amber-950", range: "text-amber-500", text: "text-amber-700 dark:text-amber-300" },
      { id: "temperature", label: "Temperatur", value: 94, track: "text-red-200 dark:text-red-950", range: "text-red-500", text: "text-red-700 dark:text-red-300" },
    ];

    return `<div class="flex flex-wrap items-start gap-8">${colors
      .map((color) =>
        Gauge({
          id: `gauge-colors-${color.id}`,
          value: color.value,
          children: (context) => [
            GaugeIndicator({
              context,
              children: [GaugeTrack({ context, class: color.track }), GaugeRange({ context, class: color.range })],
            }),
            GaugeValueText({ context, class: color.text }),
            GaugeLabel({ context, class: color.text, children: color.label }),
          ],
        }),
      )
      .join("")}</div>`;
  },
};

/** Bogen-Varianten über startAngle und endAngle (0 Grad liegt oben, im Uhrzeigersinn) */
export const Variants: Story = {
  render: () => {
    const variants: { id: string; label: string; startAngle: number; endAngle: number }[] = [
      { id: "semi", label: "Halbkreis", startAngle: -90, endAngle: 90 },
      { id: "three-quarter", label: "Dreiviertelkreis", startAngle: -135, endAngle: 135 },
      { id: "full", label: "Vollkreis", startAngle: 0, endAngle: 360 },
    ];

    return `<div class="flex flex-wrap items-start gap-8">${variants
      .map(({ id, label, startAngle, endAngle }) =>
        GaugeCombined({ id: `gauge-variants-${id}`, value: 75, startAngle, endAngle, label }),
      )
      .join("")}</div>`;
  },
};

/** Text über `getValueText`: Prozent, Bruch oder eigener Text */
export const ValueTextFormatting: Story = {
  render: () => {
    const formats: { format: ValueTextFormat; label: string; value: number }[] = [
      { format: "percentage", label: "Prozent", value: 85 },
      { format: "fraction", label: "Bruch", value: 75 },
      { format: "points", label: "Eigener Text", value: 75 },
    ];

    return `<div class="flex flex-wrap items-start gap-8">${formats
      .map(({ format, label, value }) =>
        GaugeCombined({
          id: `gauge-format-${format}`,
          value,
          size: 140,
          getValueText: formatters[format],
          label,
          attributes: { "data-format": format },
        }),
      )
      .join("")}</div>`;
  },
};

/** Ohne Wert (`null`): Zustand "indeterminate", aria-valuenow entfällt. Der Range wird wie in der Vorlage vollständig gezeichnet */
export const Indeterminate: Story = {
  render: () =>
    Gauge({
      id: "gauge-indeterminate",
      value: null,
      children: (context) => [
        GaugeIndicator({ context, children: [GaugeTrack({ context }), GaugeRange({ context })] }),
        GaugeValueText({ context, children: "..." }),
        GaugeLabel({ context, children: "Wird geladen" }),
      ],
    }),
};

/** Werte ausserhalb von min und max werden begrenzt; bei value === max gilt der Zustand "complete" */
export const Clamping: Story = {
  render: () =>
    `<div class="flex flex-wrap items-start gap-8">${[
      { id: "below", value: -20, label: "-20 wird 0" },
      { id: "inside", value: 50, label: "50" },
      { id: "above", value: 140, label: "140 wird 100 (complete)" },
    ]
      .map(({ id, value, label }) => GaugeCombined({ id: `gauge-clamping-${id}`, value, label }))
      .join("")}</div>`,
};

/** Eigener Wertebereich mit min und max (hier Temperatur von -20 bis 40) */
export const CustomRange: Story = {
  render: () =>
    GaugeCombined({
      id: "gauge-custom-range",
      value: 18,
      min: -20,
      max: 40,
      size: 140,
      startAngle: -135,
      endAngle: 135,
      getValueText: (value) => `${value} °C`,
      label: "Temperatur",
    }),
};
