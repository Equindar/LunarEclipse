import type { Meta, StoryObj } from "@storybook/html-vite";

import { Button } from "../button";
import { InputGroupAddon } from "../inputgroup";
import {
    Combobox,
    ComboboxChip,
    comboboxChipPlaceholder,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxCollection,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxLabel,
    ComboboxList,
    ComboboxSeparator,
    comboboxTriggerAttributes,
    comboboxTriggerIcon,
    ComboboxValue,
} from "./Combobox";

interface ComboboxStoryArgs {
  id: string;
  placeholder?: string;
  autoHighlight?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  showClear?: boolean;
  showTrigger?: boolean;
}

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"];

/** Liste der Frameworks als Items. IDs müssen pro Story eindeutig sein (die Docs-Seite rendert mehrere Stories). */
const frameworkItems = (id: string): string => frameworks.map((name) => ComboboxItem({ id, value: name, children: name })).join("");

/** Popup mit Leer-Hinweis und flacher Liste */
const flatContent = (id: string, items: string = frameworkItems(id), extra: { chips?: boolean } = {}): string =>
  ComboboxContent({
    id,
    chips: extra.chips,
    children: [ComboboxEmpty({ children: "No items found." }), ComboboxList({ id, children: items })],
  });

const wrapper = (inner: string): string => `<div class="w-64">${inner}</div>`;

const meta: Meta<ComboboxStoryArgs> = {
  title: "UI-Library/Combobox",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Eingabefeld mit Vorschlagsliste (Port von shadcn/ui, Base). Filtern, Auswahl, Tastatursteuerung und Chips laufen über Datastar und funktionieren nur mit geladenem Datastar. Das Popup wird per CSS Anchor Positioning am Eingabefeld ausgerichtet.",
      },
    },
  },
  argTypes: {
    placeholder: { control: "text" },
    autoHighlight: { control: "boolean" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    showClear: { control: "boolean" },
    showTrigger: { control: "boolean" },
  },
  args: {
    id: "combobox-default",
    placeholder: "Select a framework",
    autoHighlight: false,
    disabled: false,
    invalid: false,
    showClear: false,
    showTrigger: true,
  },
  render: (args) =>
    wrapper(
      Combobox({
        id: args.id,
        autoHighlight: args.autoHighlight,
        children: [
          ComboboxInput({
            id: args.id,
            placeholder: args.placeholder,
            disabled: args.disabled,
            invalid: args.invalid,
            showClear: args.showClear,
            showTrigger: args.showTrigger,
          }),
          flatContent(args.id),
        ],
      })
    ),
};

export default meta;
type Story = StoryObj<ComboboxStoryArgs>;

/** Einfache Combobox mit flacher Liste */
export const Basic: Story = {};

/** Mehrfachauswahl mit Chips (`multiple`). Die Chip-Vorlage wird im Browser je ausgewähltem Wert gerendert. */
export const Multiple: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Mit `multiple` und `ComboboxChips`. `ComboboxValue` bekommt eine Chip-Vorlage (`chip`) mit den Platzhaltern aus `comboboxChipPlaceholder`. Backspace im leeren Feld entfernt den letzten Chip.",
      },
    },
  },
  render: () => {
    const id = "combobox-multiple";
    const chip = ComboboxChip({
      id,
      value: comboboxChipPlaceholder.value,
      children: comboboxChipPlaceholder.label,
    });

    return wrapper(
      Combobox({
        id,
        multiple: true,
        values: ["Next.js"],
        children: [
          ComboboxChips({
            id,
            children: [ComboboxValue({ id, chip }), ComboboxChipsInput({ id, placeholder: "Add framework" })],
          }),
          flatContent(id, frameworkItems(id), { chips: true }),
        ],
      })
    );
  },
};

/** Clear-Button (`showClear`): löscht die Auswahl, solange eine ausgewählt ist */
export const ClearButton: Story = {
  render: () => {
    const id = "combobox-clear";
    return wrapper(
      Combobox({
        id,
        value: "Next.js",
        children: [ComboboxInput({ id, placeholder: "Select a framework", showClear: true }), flatContent(id)],
      })
    );
  },
};

const groups: Record<string, string[]> = {
  Fruits: ["Apple", "Banana", "Orange", "Mango"],
  Vegetables: ["Carrot", "Broccoli", "Spinach"],
};

/** Gruppen mit Überschrift und Trennlinie. Gruppen ohne Treffer blenden sich beim Filtern aus. */
export const Groups: Story = {
  render: () => {
    const id = "combobox-groups";

    const entries = Object.entries(groups);
    const list = entries
      .map(([label, names], index) => {
        const group = ComboboxGroup({
          children: [
            ComboboxLabel({ children: label }),
            ComboboxCollection({
              children: names.map((name) => ComboboxItem({ id, value: name, children: name })),
            }),
          ],
        });
        return index < entries.length - 1 ? group + ComboboxSeparator() : group;
      })
      .join("");

    return wrapper(
      Combobox({
        id,
        children: [ComboboxInput({ id, placeholder: "Select a food" }), flatContent(id, list)],
      })
    );
  },
};

const countries = [
  { code: "de", name: "Germany", region: "Europe" },
  { code: "fr", name: "France", region: "Europe" },
  { code: "jp", name: "Japan", region: "Asia" },
  { code: "br", name: "Brazil", region: "South America" },
];

/** Eigene Inhalte im Item. `label` bestimmt Filter und Eingabetext (entspricht `itemToStringValue`). */
export const CustomItems: Story = {
  render: () => {
    const id = "combobox-custom-items";

    const items = countries
      .map((country) =>
        ComboboxItem({
          id,
          value: country.code,
          label: country.name,
          children: `<div class="flex flex-col"><span class="font-medium">${country.name}</span><span class="text-muted-foreground text-xs">${country.region}</span></div>`,
        })
      )
      .join("");

    return wrapper(
      Combobox({
        id,
        children: [ComboboxInput({ id, placeholder: "Select a country" }), flatContent(id, items)],
      })
    );
  },
};

/** Ungültiger Zustand (`aria-invalid`) */
export const Invalid: Story = {
  args: { id: "combobox-invalid", invalid: true },
};

/** Deaktiviert */
export const Disabled: Story = {
  args: { id: "combobox-disabled", disabled: true },
};

/** `autoHighlight`: hebt beim Filtern den ersten Treffer hervor, Enter wählt ihn aus */
export const AutoHighlight: Story = {
  args: { id: "combobox-auto-highlight", autoHighlight: true },
};

/** Popup-Muster: Trigger als Button, das Suchfeld liegt im Popup */
export const Popup: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Der Button trägt die Attribute aus `comboboxTriggerAttributes(id, true)` und dient als Anchor. Das `ComboboxInput` im Popup wird mit `anchor: false` und ohne Trigger gerendert.",
      },
    },
  },
  render: () => {
    const id = "combobox-popup";

    const trigger = Button({
      variant: "outline",
      class: "w-64 justify-between font-normal",
      attributes: { type: "button", ...comboboxTriggerAttributes(id, true) },
      children: [ComboboxValue({ id, placeholder: "Select country" }), comboboxTriggerIcon()],
    });

    const content = ComboboxContent({
      id,
      children: [
        ComboboxInput({ id, placeholder: "Search country", showTrigger: false, anchor: false }),
        ComboboxEmpty({ children: "No items found." }),
        ComboboxList({
          id,
          children: countries.map((country) => ComboboxItem({ id, value: country.code, label: country.name, children: country.name })),
        }),
      ],
    });

    return wrapper(Combobox({ id, children: [trigger, content] }));
  },
};

const globeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`;

/** Addon in der Input-Group (hier ein Globus-Icon vor dem Eingabefeld) */
export const InputGroup: Story = {
  render: () => {
    const id = "combobox-input-group";
    return wrapper(
      Combobox({
        id,
        children: [
          ComboboxInput({
            id,
            placeholder: "Select a timezone",
            children: InputGroupAddon({ children: globeIcon }),
          }),
          flatContent(id, ["Europe/Berlin", "Asia/Tokyo", "America/New_York"].map((zone) => ComboboxItem({ id, value: zone, children: zone })).join("")),
        ],
      })
    );
  },
};

/** Formularfeld: `name` rendert ein verstecktes Input mit dem ausgewählten Wert */
export const FormField: Story = {
  render: () => {
    const id = "combobox-form";
    return wrapper(
      `<form class="flex flex-col gap-2" onsubmit="return false;">${Combobox({
        id,
        children: [ComboboxInput({ id, name: "framework", placeholder: "Select a framework" }), flatContent(id)],
      })}</form>`
    );
  },
};
