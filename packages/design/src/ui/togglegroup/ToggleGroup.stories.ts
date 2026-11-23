import type { Meta, StoryObj } from "@storybook/html-vite";

import { renderIcon } from "../../utils/renderIcon";
import { ToggleGroup, ToggleGroupItem } from "./ToggleGroup";
import { toggleGroupSignals } from "./ToggleGroup.expressions";
import type { ToggleGroupArgs } from "./ToggleGroup.types";

type ToggleGroupStoryArgs = Omit<ToggleGroupArgs, "children" | "attributes" | "onValueChange">;

/**
 * Icon-Inhalte (lucide, 24x24), hier direkt eingebettet, damit die Stories ohne zentralen Icon-Ordner laufen.
 * Mit dem Icon-Lookup des Design-Systems lassen sie sich später durch Namen ersetzen.
 */
const iconBodies = {
  bold: `<path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/>`,
  italic: `<line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/>`,
  underline: `<path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/>`,
  bookmark: `<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>`,
  heart: `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>`,
  star: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
} as const;

const icon = (name: keyof typeof iconBodies, iconClass = ""): string =>
  renderIcon(iconBodies[name], iconClass ? { class: iconClass } : {});

interface StoryItem {
  value: string;
  /** Sichtbarer Text; bei reinen Icon-Items stattdessen aria-label setzen */
  label?: string;
  icon?: keyof typeof iconBodies;
  iconClass?: string;
  ariaLabel?: string;
  disabled?: boolean;
  class?: string;
}

/**
 * Gruppe samt Items rendern. variant, size und spacing werden an die Items weitergereicht,
 * damit sie mit der Gruppe übereinstimmen (React übernimmt das über den Kontext).
 */
const group = (
  id: string,
  items: StoryItem[],
  options: Omit<ToggleGroupArgs, "id" | "children"> = {},
): string =>
  ToggleGroup({
    id,
    ...options,
    children: items.map((item) =>
      ToggleGroupItem({
        groupId: id,
        value: item.value,
        variant: options.variant,
        size: options.size,
        spacing: options.spacing,
        disabled: item.disabled,
        class: item.class,
        attributes: item.ariaLabel ? { "aria-label": item.ariaLabel } : undefined,
        children: `${item.icon ? icon(item.icon, item.iconClass) : ""}${item.label ?? ""}`,
      }),
    ),
  });

const formatItems: StoryItem[] = [
  { value: "bold", icon: "bold", ariaLabel: "Fett" },
  { value: "italic", icon: "italic", ariaLabel: "Kursiv" },
  { value: "underline", icon: "underline", ariaLabel: "Unterstrichen" },
];

const sideItems: StoryItem[] = [
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
];

const meta: Meta<ToggleGroupStoryArgs> = {
  title: "UI-Library/ToggleGroup",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Eine Gruppe von Zwei-Zustands-Buttons mit gemeinsamem Wert, einfach oder mehrfach wählbar. Auswahl und Tastatur-Navigation funktionieren nur mit geladenem Datastar. Der Wert steht im Signal `$<id>.value` (Array der gedrückten Item-Werte). variant, size und spacing müssen an Gruppe und Items übereinstimmen.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["default", "sm", "lg"] },
    spacing: { control: "number" },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
    loop: { control: "boolean" },
    class: { control: "text" },
  },
  args: {
    id: "toggle-group-playground",
    variant: "default",
    size: "default",
    spacing: 2,
    orientation: "horizontal",
    multiple: false,
    disabled: false,
    loop: true,
  },
  render: (args) =>
    `<div class="p-8">${group(
      args.id ?? "toggle-group-playground",
      [
        { value: "a", label: "A" },
        { value: "b", label: "B" },
        { value: "c", label: "C" },
      ],
      args,
    )}</div>`,
};

export default meta;
type Story = StoryObj<ToggleGroupStoryArgs>;

export const Playground: Story = {};

export const Default: Story = {
  render: () =>
    `<div class="p-8">${group("toggle-group-default", formatItems, { multiple: true, variant: "outline", spacing: 0 })}</div>`,
};

export const Outline: Story = {
  render: () =>
    `<div class="p-8">${group(
      "toggle-group-outline",
      [
        { value: "all", label: "All" },
        { value: "missed", label: "Missed" },
      ],
      { variant: "outline", value: ["all"] },
    )}</div>`,
};

export const Size: Story = {
  render: () =>
    `<div class="flex flex-col items-start gap-4 p-8">${(["sm", "default", "lg"] as const)
      .map((size) => group(`toggle-group-size-${size}`, sideItems, { variant: "outline", size, value: ["top"] }))
      .join("")}</div>`,
};

export const Spacing: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Mit spacing = 0 sind die Items verbunden, ein höherer Wert setzt einen Abstand dazwischen. Die gedrückten Items färben ihr Icon über Klassen am Item.",
      },
    },
  },
  render: () =>
    `<div class="flex flex-col items-start gap-4 p-8">${[
      group(
        "toggle-group-spacing-two",
        [
          {
            value: "bookmark",
            label: "Bookmark",
            icon: "bookmark",
            class: "data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500",
          },
          {
            value: "heart",
            label: "Heart",
            icon: "heart",
            class: "data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500",
          },
          {
            value: "star",
            label: "Star",
            icon: "star",
            class: "data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500",
          },
        ],
        { multiple: true, variant: "outline", size: "sm", spacing: 2 },
      ),
      group("toggle-group-spacing-zero", sideItems, { variant: "outline", size: "sm", spacing: 0 }),
    ].join("")}</div>`,
};

export const Vertical: Story = {
  render: () =>
    `<div class="p-8">${group("toggle-group-vertical", formatItems, {
      multiple: true,
      variant: "outline",
      orientation: "vertical",
      spacing: 0,
    })}</div>`,
};

export const Disabled: Story = {
  render: () =>
    `<div class="p-8">${group("toggle-group-disabled", formatItems, { multiple: true, disabled: true })}</div>`,
};

export const Custom: Story = {
  parameters: {
    docs: {
      description: {
        story: "Eigene Items mit Vorschau der Schriftstärke. Die Schriftstärke wird über Klassen am Item gesetzt.",
      },
    },
  },
  render: () => {
    const weights: StoryItem[] = [
      { value: "light", label: "Aa Light", class: "font-light" },
      { value: "normal", label: "Aa Normal", class: "font-normal" },
      { value: "medium", label: "Aa Medium", class: "font-medium" },
      { value: "bold", label: "Aa Bold", class: "font-bold" },
    ];

    return `<div class="flex flex-col gap-2 p-8">
  <span class="text-sm font-medium">Font Weight</span>
  ${group("toggle-group-custom", weights, { variant: "outline", spacing: 0, value: ["normal"] })}
  <p class="text-sm text-muted-foreground">Use font-normal to set the font weight.</p>
</div>`;
  },
};

export const ValueChange: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Der gewählte Wert liegt im Signal `$<id>.value` und lässt sich z. B. mit data-text anzeigen. Über `onValueChange` kann zusätzlich eine Datastar-Aktion bei jeder Änderung laufen (hier ein Signal-Update).",
      },
    },
  },
  render: () => {
    const id = "toggle-group-value-change";
    const s = toggleGroupSignals(id);

    return `<div class="flex flex-col items-start gap-3 p-8" data-signals="{&quot;changes&quot;: 0}">
  ${group(id, formatItems, { multiple: true, variant: "outline", value: ["bold"], onValueChange: "$changes = $changes + 1" })}
  <p class="text-sm text-muted-foreground">Gewählt: <span data-text="${s.signal("value")}.join(', ') || 'nichts'"></span></p>
  <p class="text-sm text-muted-foreground">Änderungen: <span data-text="$changes"></span></p>
</div>`;
  },
};

export const RightToLeft: Story = {
  parameters: {
    docs: {
      description: {
        story: "Mit dir=\"rtl\" am Container kehrt sich auch die Pfeiltasten-Navigation um.",
      },
    },
  },
  render: () =>
    `<div dir="rtl" class="p-8">${group(
      "toggle-group-rtl",
      [
        { value: "list", label: "قائمة" },
        { value: "grid", label: "شبكة" },
        { value: "cards", label: "بطاقات" },
      ],
      { variant: "outline", spacing: 0, value: ["list"] },
    )}</div>`,
};
