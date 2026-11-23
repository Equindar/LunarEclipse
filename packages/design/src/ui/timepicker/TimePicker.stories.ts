import type { Meta, StoryObj } from "@storybook/html-vite";

import { Button } from "../button";
import {
    TimePicker,
    TimePickerClear,
    TimePickerContent,
    TimePickerHour,
    TimePickerInput,
    TimePickerInputGroup,
    TimePickerLabel,
    TimePickerMinute,
    TimePickerPeriod,
    TimePickerSecond,
    TimePickerSeparator,
    TimePickerTrigger,
} from "./TimePicker";
import { timePickerSignals } from "./TimePicker.expressions";
import type { TimePickerArgs } from "./TimePicker.types";

type TimePickerStoryArgs = Omit<TimePickerArgs, "children" | "attributes"> & {
  label?: string;
};

/**
 * Zeitfeld komponieren: Label, Segmente, Trigger und Spalten.
 * IDs müssen pro Story eindeutig sein (die Docs-Seite rendert mehrere Stories gleichzeitig).
 */
const timePicker = (args: TimePickerStoryArgs & { id: string }): string => {
  const { label, id, ...root } = args;
  const showSeconds = root.showSeconds ?? false;

  const segments = [
    TimePickerInput({ id, segment: "hour" }),
    TimePickerSeparator(),
    TimePickerInput({ id, segment: "minute" }),
    ...(showSeconds ? [TimePickerSeparator(), TimePickerInput({ id, segment: "second" })] : []),
    TimePickerInput({ id, segment: "period" }),
    TimePickerTrigger({ id }),
  ];

  const columns = [
    TimePickerHour({ id }),
    TimePickerMinute({ id }),
    ...(showSeconds ? [TimePickerSecond({ id })] : []),
    TimePickerPeriod({ id }),
    TimePickerClear({ id }),
  ];

  return TimePicker({
    ...root,
    id,
    children: [
      TimePickerLabel({ id, children: label ?? "Uhrzeit" }),
      TimePickerInputGroup({ id, class: "mt-2", children: segments }),
      TimePickerContent({ id, children: columns }),
    ],
  });
};

/** Container mit Platz für den geöffneten Inhalt */
const frame = (content: string): string => `<div class="min-h-80 w-72 p-4">${content}</div>`;

const meta: Meta<TimePickerStoryArgs> = {
  title: "UI-Library/TimePicker",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Zeitfeld mit Inline-Bearbeitung der Segmente und Auswahl per Popover. Das Format (12 oder 24 Stunden) richtet sich nach der Locale. Der Wert liegt immer im 24-Stunden-Format vor. Funktioniert nur mit geladenem Datastar und braucht Popover API sowie CSS Anchor Positioning (Firefox ggf. mit Polyfill).",
      },
    },
  },
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    defaultValue: { control: "text" },
    defaultOpen: { control: "boolean" },
    showSeconds: { control: "boolean" },
    locale: { control: "select", options: [undefined, "en-US", "de-DE", "en-GB"] },
    hourStep: { control: "number" },
    minuteStep: { control: "number" },
    secondStep: { control: "number" },
    openOnFocus: { control: "boolean" },
    inputGroupClickAction: { control: "select", options: ["focus", "open"] },
    segmentPlaceholder: { control: "text" },
    name: { control: "text" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
  },
  args: {
    id: "time-picker-playground",
    label: "Uhrzeit",
    showSeconds: false,
    openOnFocus: false,
    inputGroupClickAction: "focus",
    disabled: false,
    invalid: false,
    readOnly: false,
    required: false,
  },
  render: (args) => frame(timePicker({ ...args, id: args.id ?? "time-picker-playground" })),
};

export default meta;
type Story = StoryObj<TimePickerStoryArgs>;

export const Playground: Story = {};

export const Default: Story = {
  render: () => frame(timePicker({ id: "time-picker-default", locale: "en-US" })),
};

export const Format24Hour: Story = {
  parameters: { docs: { description: { story: "Mit 24-Stunden-Locale entfallen die Period-Eingabe und die AM/PM-Spalte." } } },
  render: () => frame(timePicker({ id: "time-picker-24h", locale: "de-DE", defaultValue: "14:30" })),
};

export const WithStep: Story = {
  parameters: { docs: { description: { story: "Mit hourStep, minuteStep und secondStep lassen sich die Intervalle der Spalten festlegen." } } },
  render: () =>
    frame(
      timePicker({
        id: "time-picker-step",
        locale: "en-US",
        showSeconds: true,
        hourStep: 2,
        minuteStep: 15,
        secondStep: 30,
      })
    ),
};

export const WithSeconds: Story = {
  render: () => frame(timePicker({ id: "time-picker-seconds", locale: "en-US", showSeconds: true, defaultValue: "09:15:30" })),
};

export const CustomPlaceholders: Story = {
  render: () =>
    frame(
      timePicker({
        id: "time-picker-placeholder",
        locale: "en-US",
        segmentPlaceholder: { hour: "hh", minute: "mm", period: "AM/PM" },
      })
    ),
};

export const OpenOnFocus: Story = {
  render: () => frame(timePicker({ id: "time-picker-open-on-focus", locale: "en-US", openOnFocus: true })),
};

export const InputGroupClickAction: Story = {
  parameters: { docs: { description: { story: "Ein Klick auf freie Fläche der Eingabegruppe öffnet den Inhalt statt das erste Segment zu fokussieren." } } },
  render: () => frame(timePicker({ id: "time-picker-click-action", locale: "en-US", inputGroupClickAction: "open" })),
};

export const ControlledState: Story = {
  parameters: {
    docs: {
      description: {
        story: "Kontrollierter Zustand entsteht über die Signale: `$<id>.value` lässt sich lesen und setzen (ID mit \"_\" statt \"-\").",
      },
    },
  },
  render: () => {
    const id = "time-picker-controlled";
    const value = timePickerSignals(id).signal("value");

    return frame(
      timePicker({ id, locale: "en-US", defaultValue: "10:00" }) +
        `<p class="mt-4 text-sm">Wert: <span data-text="${value} || '(leer)'"></span></p>` +
        `<div class="mt-2 flex gap-2">${Button({
          children: "Auf 12:00 setzen",
          variant: "outline",
          attributes: { "data-on:click": `${value} = '12:00'` },
        })}${Button({
          children: "Zurücksetzen",
          variant: "outline",
          attributes: { "data-on:click": `${value} = ''` },
        })}</div>`
    );
  },
};

export const WithForm: Story = {
  parameters: { docs: { description: { story: "Mit `name` rendert der Root ein verstecktes Formularfeld, das den 24-Stunden-Wert enthält." } } },
  render: () => {
    const id = "time-picker-form";
    const value = timePickerSignals(id).signal("value");

    return frame(
      `<form class="flex flex-col gap-4" onsubmit="return false;">` +
        timePicker({ id, locale: "en-US", name: "time", required: true }) +
        `<p class="text-sm">Wert im Formular: <span data-text="${value} || '(leer)'"></span></p>` +
        Button({ children: "Absenden", variant: "default", attributes: { type: "submit" } }) +
        `</form>`
    );
  },
};

export const Disabled: Story = {
  render: () => frame(timePicker({ id: "time-picker-disabled", locale: "en-US", disabled: true, defaultValue: "08:45" })),
};

export const Invalid: Story = {
  render: () => frame(timePicker({ id: "time-picker-invalid", locale: "en-US", invalid: true })),
};
