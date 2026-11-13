import type { Meta, StoryObj } from "@storybook/html-vite";

import { Switch } from "./Switch";
import type { SwitchArgs } from "./Switch.types";

type SwitchStoryArgs = SwitchArgs & { label?: string };

/**
 * Label und Field-Layout sind hier als schlichtes HTML mit den Klassen von shadcn gebaut,
 * damit die Stories ohne die Komponenten Label und Field auskommen.
 */
const labelTw = "text-sm leading-snug font-medium select-none";
const descriptionTw = "text-sm leading-normal font-normal text-muted-foreground";

const meta: Meta<SwitchStoryArgs> = {
  title: "UI-Library/Switch",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Ein Schalter, der zwischen eingeschaltet und ausgeschaltet wechselt. Port von shadcn/ui (Base). Der Zustand liegt im Datastar-Signal `$<id>.checked`; die Komponente funktioniert nur mit geladenem Datastar. Mit `name` wird eine verborgene Checkbox für Formulare mitgerendert.",
      },
    },
  },
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    size: { control: "select", options: ["default", "sm"] },
    name: { control: "text" },
    value: { control: "text" },
    class: { control: "text" },
  },
  args: {
    id: "switch-default",
    checked: false,
    disabled: false,
    invalid: false,
    size: "default",
    label: "Airplane Mode",
  },
  render: ({ label, ...args }) =>
    `<div class="flex w-fit items-center gap-2">${Switch(args)}<label for="${args.id}" class="${labelTw}">${label ?? ""}</label></div>`,
};

export default meta;
type Story = StoryObj<SwitchStoryArgs>;

export const Default: Story = {};

/** Titel mit erklärendem Text; der Switch steht rechts */
export const Description: Story = {
  render: () =>
    `<div class="flex w-full max-w-sm items-center justify-between gap-4">
      <div class="flex flex-col gap-1">
        <label for="switch-description" class="${labelTw}">Share across devices</label>
        <p class="${descriptionTw}">Focus is shared across devices, and turns off when you leave the app.</p>
      </div>
      ${Switch({ id: "switch-description" })}
    </div>`,
};

/** Karten-Auswahl: das Label umschließt die ganze Zeile und ist dadurch als Ganzes klickbar */
export const ChoiceCard: Story = {
  render: () => {
    const card = (id: string, title: string, text: string, checked = false): string =>
      `<label for="${id}" class="flex w-full items-center justify-between gap-4 rounded-lg border p-4 has-data-checked:border-primary/50 has-data-checked:bg-primary/5">
        <span class="flex flex-col gap-1">
          <span class="${labelTw}">${title}</span>
          <span class="${descriptionTw}">${text}</span>
        </span>
        ${Switch({ id, checked })}
      </label>`;

    return `<div class="flex w-full max-w-sm flex-col gap-3">${[
      card("switch-card-devices", "Share across devices", "Focus is shared across devices, and turns off when you leave the app."),
      card("switch-card-notifications", "Enable notifications", "Receive notifications when focus mode is enabled or disabled.", true),
    ].join("")}</div>`;
  },
};

/** `disabled` setzt `disabled` und `data-disabled`; der Zustand bleibt sichtbar, die Abdunklung kommt vom Switch selbst */
export const Disabled: Story = {
  render: () =>
    `<div class="flex flex-col gap-3">
      <div class="flex w-fit items-center gap-2">
        ${Switch({ id: "switch-disabled-off", disabled: true })}
        <label for="switch-disabled-off" class="${labelTw} opacity-50">Disabled</label>
      </div>
      <div class="flex w-fit items-center gap-2">
        ${Switch({ id: "switch-disabled-on", disabled: true, checked: true })}
        <label for="switch-disabled-on" class="${labelTw} opacity-50">Disabled (on)</label>
      </div>
    </div>`,
};

/** `invalid` setzt `aria-invalid="true"`; die Rahmen- und Ring-Farben kommen aus den Klassen des Switches */
export const Invalid: Story = {
  render: () =>
    `<div class="flex w-full max-w-sm items-center justify-between gap-4">
      <div class="flex flex-col gap-1">
        <label for="switch-invalid" class="${labelTw} text-destructive">Accept terms and conditions</label>
        <p class="${descriptionTw}">You must accept the terms and conditions to continue.</p>
      </div>
      ${Switch({ id: "switch-invalid", invalid: true })}
    </div>`,
};

/** Größen: `sm` und `default` */
export const Sizes: Story = {
  render: () =>
    `<div class="flex flex-col gap-3">
      <div class="flex w-fit items-center gap-2">
        ${Switch({ id: "switch-size-sm", size: "sm" })}
        <label for="switch-size-sm" class="${labelTw}">Small</label>
      </div>
      <div class="flex w-fit items-center gap-2">
        ${Switch({ id: "switch-size-default", size: "default" })}
        <label for="switch-size-default" class="${labelTw}">Default</label>
      </div>
    </div>`,
};

/** Initial eingeschaltet über `checked` */
export const Checked: Story = {
  args: { id: "switch-checked", checked: true, label: "Notifications" },
};

/** Mit `name` wird eine verborgene Checkbox gerendert; das Formular sendet den Wert nur bei eingeschaltetem Switch */
export const InForm: Story = {
  render: () =>
    `<form class="flex w-full max-w-sm flex-col gap-3" onsubmit="event.preventDefault(); this.querySelector('output').textContent = JSON.stringify(Object.fromEntries(new FormData(this)))">
      <div class="flex w-fit items-center gap-2">
        ${Switch({ id: "switch-form", name: "newsletter", value: "yes" })}
        <label for="switch-form" class="${labelTw}">Newsletter</label>
      </div>
      <button type="submit" class="w-fit rounded-md border px-3 py-1.5 text-sm font-medium">Submit</button>
      <output class="text-sm text-muted-foreground"></output>
    </form>`,
};

/** Rechts-nach-links-Layout (Arabisch). Hinweis: Die Klassen der Vorlage enthalten keine rtl:-Varianten für den Daumen */
export const Rtl: Story = {
  render: () =>
    `<div dir="rtl" class="flex w-full max-w-sm items-center justify-between gap-4">
      <div class="flex flex-col gap-1">
        <label for="switch-rtl" class="${labelTw}">المشاركة عبر الأجهزة</label>
        <p class="${descriptionTw}">يتم مشاركة التركيز عبر الأجهزة، ويتم إيقاف تشغيله عند مغادرة التطبيق.</p>
      </div>
      ${Switch({ id: "switch-rtl" })}
    </div>`,
};
