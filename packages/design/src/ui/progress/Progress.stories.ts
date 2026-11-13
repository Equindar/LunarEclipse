import type { Meta, StoryObj } from "@storybook/html-vite";

import { renderAttributes } from "../../utils/renderHtmlAttributes";
import { createSignals } from "../../utils/SignalManager";
import { Progress, ProgressLabel, ProgressValue } from "./Progress";
import type { ProgressArgs } from "./Progress.types";

interface ProgressStorySignals {
  value: number;
}

const meta: Meta<ProgressArgs> = {
  title: "UI-Library/Progress",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Zeigt den Fortschritt einer Aufgabe. Port von shadcn/ui (Base). Statisch über `value`; mit `valueSignal` folgen Breite, ARIA-Werte und Anzeige einem Datastar-Signal (funktioniert nur mit geladenem Datastar). Label und Wertanzeige sind eigene Teile (`ProgressLabel`, `ProgressValue`) und bekommen Wert und Bereich ebenfalls übergeben.",
      },
    },
  },
  argTypes: {
    value: { control: "number" },
    min: { control: "number" },
    max: { control: "number" },
    class: { control: "text" },
  },
  args: {
    value: 33,
    class: "w-[60%]",
    attributes: { "aria-label": "Fortschritt" },
  },
  render: (args) => Progress(args),
};

export default meta;
type Story = StoryObj<ProgressArgs>;

export const Default: Story = {};

/** Mit Label und Wertanzeige: Root mit `hasLabel`, Label mit derselben `id` */
export const WithLabel: Story = {
  render: () =>
    Progress({
      id: "progress-label",
      hasLabel: true,
      value: 56,
      class: "w-full max-w-sm",
      children: [
        ProgressLabel({ id: "progress-label", value: 56, children: "Upload progress" }),
        ProgressValue({ value: 56 }),
      ],
    }),
};

/** Gesteuert über ein Signal; der Regler ist ein nativer Range-Input (das Design-System hat noch keinen Slider) */
export const Controlled: Story = {
  render: () => {
    const signals = createSignals<ProgressStorySignals>("progress-controlled", { value: 50 });

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

    return `<div class="flex w-full max-w-sm flex-col gap-4"${renderAttributes({ "data-signals": signals.dataSignals })}>${Progress({
      value: 50,
      valueSignal: signals.signal("value"),
      class: "w-full",
      attributes: { "aria-label": "Fortschritt" },
    })}<input${input}></div>`;
  },
};

/** Der Wert wechselt nach 500 ms von 13 auf 66; die Breite animiert über `transition-all` */
export const Animated: Story = {
  render: () => {
    const signals = createSignals<ProgressStorySignals>("progress-animated", { value: 13 });

    const wrapper = renderAttributes({
      "data-signals": signals.dataSignals,
      "data-init": `setTimeout(() => (${signals.set("value", "66")}), 500)`,
    });

    return `<div class="w-[60%]"${wrapper}>${Progress({
      value: 13,
      valueSignal: signals.signal("value"),
      class: "w-full",
      attributes: { "aria-label": "Fortschritt" },
    })}</div>`;
  },
};

/** Ohne `value` ist der Fortschritt unbestimmt (data-indeterminate, keine Breite) */
export const Indeterminate: Story = {
  args: { value: undefined },
};

/** Eigener Wertebereich: Schritt 3 von 5; die Anzeige wird über `children` überschrieben */
export const CustomRange: Story = {
  render: () =>
    Progress({
      id: "progress-custom-range",
      hasLabel: true,
      value: 3,
      min: 0,
      max: 5,
      class: "w-full max-w-sm",
      children: [
        ProgressLabel({ id: "progress-custom-range", value: 3, max: 5, children: "Schritte" }),
        ProgressValue({ value: 3, max: 5, children: "3 von 5" }),
      ],
    }),
};

/** Die Höhe wird am Track gesetzt (data-slot="progress-track") */
export const Sizes: Story = {
  render: () =>
    `<div class="flex w-full max-w-sm flex-col gap-6">${[
      Progress({ value: 50, class: "[&_[data-slot=progress-track]]:h-1", attributes: { "aria-label": "Klein" } }),
      Progress({ value: 50, attributes: { "aria-label": "Standard" } }),
      Progress({ value: 50, class: "[&_[data-slot=progress-track]]:h-3", attributes: { "aria-label": "Groß" } }),
    ].join("")}</div>`,
};

/** Rechts-nach-links mit arabischer Locale für die Wertanzeige */
export const Rtl: Story = {
  render: () =>
    `<div dir="rtl" class="w-full max-w-sm">${Progress({
      id: "progress-rtl",
      hasLabel: true,
      value: 56,
      locale: "ar-EG",
      class: "w-full",
      children: [
        ProgressLabel({ id: "progress-rtl", value: 56, children: "تقدم الرفع" }),
        ProgressValue({ value: 56, locale: "ar-EG" }),
      ],
    })}</div>`,
};
