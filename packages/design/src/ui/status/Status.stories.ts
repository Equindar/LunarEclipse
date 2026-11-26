import type { Meta, StoryObj } from "@storybook/html-vite";

import { escapeHtml } from "../../utils/escapeHtml";
import { Status, StatusIndicator, StatusLabel } from "./Status";
import type { StatusArgs, StatusVariant } from "./Status.types";

type StatusStoryArgs = StatusArgs & { text?: string; showIndicator?: boolean; pulse?: boolean };

const variants: StatusVariant[] = ["default", "success", "error", "warning", "info"];

const meta: Meta<StatusStoryArgs> = {
  title: "UI-Library/Status",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Statusanzeige im Badge-Stil mit animiertem Indikator und fünf Farbvarianten, z. B. für Systemzustände, Anwesenheit oder Servicegesundheit. Port von Dice UI (Base). Aufbau: `Status`, darin `StatusIndicator` und `StatusLabel`. Mit `href` wird der Status als Link gerendert.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: variants },
    class: { control: "text" },
    href: { control: "text" },
    text: { control: "text" },
    showIndicator: { control: "boolean" },
    pulse: { control: "boolean" },
  },
  args: {
    variant: "success",
    text: "Online",
    showIndicator: true,
    pulse: true,
  },
  render: ({ text, showIndicator, pulse, ...args }) =>
    Status({
      ...args,
      children: [...(showIndicator ? [StatusIndicator({ pulse })] : []), StatusLabel({ children: escapeHtml(text ?? "") })],
    }),
};

export default meta;
type Story = StoryObj<StatusStoryArgs>;

export const Playground: Story = {};

/** Fünf Farbvarianten; der Indikator übernimmt die Farbe der Variante */
export const Variants: Story = {
  render: () => {
    const items: [StatusVariant, string][] = [
      ["success", "Online"],
      ["error", "Offline"],
      ["warning", "Away"],
      ["info", "Idle"],
      ["default", "Unknown"],
    ];

    return `<div class="flex flex-wrap items-center gap-2">${items
      .map(([variant, label]) =>
        Status({ variant, children: [StatusIndicator(), StatusLabel({ children: label })] }),
      )
      .join("")}</div>`;
  },
};

/** Ohne `StatusIndicator()` entsteht eine einfache Textvariante */
export const TextOnly: Story = {
  render: () => {
    const items: [StatusVariant, string][] = [
      ["success", "Online"],
      ["error", "Offline"],
      ["warning", "Away"],
      ["info", "Idle"],
      ["default", "Unknown"],
    ];

    return `<div class="flex flex-wrap items-center gap-2">${items
      .map(([variant, label]) => Status({ variant, children: StatusLabel({ children: label }) }))
      .join("")}</div>`;
  },
};

/** Mehrere Status in einer Liste, z. B. für ein Dashboard zur Servicegesundheit */
export const ServiceStatusList: Story = {
  render: () => {
    const services: [string, StatusVariant, string][] = [
      ["API", "success", "Betriebsbereit"],
      ["Datenbank", "success", "Betriebsbereit"],
      ["Authentifizierung", "warning", "Eingeschränkt"],
      ["Dateispeicher", "error", "Gestört"],
      ["E-Mail-Versand", "info", "Wartung"],
      ["Webhooks", "default", "Unbekannt"],
    ];

    return `<div class="flex w-full max-w-sm flex-col divide-y rounded-lg border">${services
      .map(
        ([name, variant, label]) =>
          `<div class="flex items-center justify-between gap-4 px-4 py-3"><span class="text-sm font-medium">${name}</span>${Status(
            { variant, children: [StatusIndicator(), StatusLabel({ children: label })] },
          )}</div>`,
      )
      .join("")}</div>`;
  },
};

/** Mit `href` wird der Status als Link (`<a>`) gerendert (Ersatz für `render`/`asChild` der Quelle) */
export const AsLink: Story = {
  render: () =>
    Status({
      variant: "success",
      href: "#status-page",
      children: [StatusIndicator(), StatusLabel({ children: "Alle Systeme laufen" })],
    }),
};

/** Mit `pulse: false` blinkt der Indikator nicht (ruhiger Punkt) */
export const StaticIndicator: Story = {
  render: () =>
    `<div class="flex flex-wrap items-center gap-2">${(["success", "error", "warning", "info", "default"] as StatusVariant[])
      .map((variant) =>
        Status({ variant, children: [StatusIndicator({ pulse: false }), StatusLabel({ children: variant })] }),
      )
      .join("")}</div>`,
};

/** `id`, eigener `data-slot` und Datastar-Attribute laufen über `attributes` */
export const WithAttributes: Story = {
  render: () =>
    Status({
      variant: "success",
      attributes: {
        id: "status-live",
        "data-slot": "log-card-live",
        "data-signals": "{statusLive: true}",
        "data-show": "$statusLive",
      },
      children: [StatusIndicator(), StatusLabel({ children: "Live" })],
    }),
};
