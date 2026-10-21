import type { Meta, StoryObj } from "@storybook/html-vite";

import { Button } from "../button";
import { Form, FormDescription, FormItem, FormLabel } from "../form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "./Select";
import type { SelectArgs } from "./Select.types";

/** Verhindert in Storybook den nativen Submit (Seiten-Reload), da die Stories keine action haben */
const noSubmit = { onsubmit: "return false;" };

const meta: Meta<SelectArgs> = {
  title: "UI-Library/Select",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Zeigt eine Liste von Optionen zur Auswahl, ausgelöst über einen Button. Mit `options` wird die komplette UI automatisch gerendert, sonst per manueller Komposition aus SelectTrigger, SelectValue, SelectContent und SelectItem. Öffnen und Auswählen funktionieren nur, wenn Datastar geladen ist.",
      },
    },
  },
  argTypes: {
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    placeholder: { control: "text" },
    defaultValue: { control: "text" },
  },
  args: {
    id: "select-default",
    placeholder: "Select a theme...",
    options: [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
      { value: "system", label: "System" },
    ],
  },
  render: (args) => `<div class="w-64">${Select(args)}</div>`,
};

export default meta;
type Story = StoryObj<SelectArgs>;

export const SimpleOptions: Story = {};

export const GroupedOptions: Story = {
  args: {
    id: "select-grouped",
    placeholder: "Select a language...",
    options: [
      { value: "en", label: "English", group: "Popular" },
      { value: "es", label: "Spanish", group: "Popular" },
      { value: "fr", label: "French", group: "Popular" },
      { value: "de", label: "German", group: "Other" },
      { value: "it", label: "Italian", group: "Other" },
      { value: "pt", label: "Portuguese", group: "Other" },
    ],
  },
};

export const WithDisabledOptions: Story = {
  args: {
    id: "select-disabled-options",
    placeholder: "Choose account type...",
    options: [
      { value: "free", label: "Free" },
      { value: "pro", label: "Pro" },
      { value: "enterprise", label: "Enterprise (Contact Sales)", disabled: true },
    ],
  },
};

export const PreSelectedValue: Story = {
  args: {
    id: "select-preselected",
    placeholder: "Select priority...",
    defaultValue: "medium",
    options: [
      { value: "low", label: "Low Priority" },
      { value: "medium", label: "Medium Priority" },
      { value: "high", label: "High Priority" },
    ],
  },
};

export const Disabled: Story = {
  args: { id: "select-disabled", disabled: true },
};

/** Select in einem Formular: mit `name` wird ein verstecktes Input für die Übertragung gerendert */
export const FormIntegration: Story = {
  render: () =>
    Form({
      id: "form-select",
      class: "w-80 space-y-6",
      attributes: noSubmit,
      children: [
        FormItem({
          children: [
            FormLabel({ children: "Theme Preference" }),
            Select({
              id: "form-select-theme",
              name: "theme",
              placeholder: "Choose your preferred theme",
              options: [
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
                { value: "system", label: "System" },
              ],
            }),
            FormDescription({ children: "Select the theme that best suits your preference." }),
          ],
        }),
        FormItem({
          children: [
            FormLabel({ children: "Language" }),
            Select({
              id: "form-select-language",
              name: "language",
              placeholder: "Select a language",
              options: [
                { value: "en", label: "English", group: "Popular" },
                { value: "es", label: "Spanish", group: "Popular" },
                { value: "fr", label: "French", group: "Popular" },
                { value: "de", label: "German", group: "Other" },
                { value: "it", label: "Italian", group: "Other" },
                { value: "pt", label: "Portuguese", group: "Other" },
              ],
            }),
            FormDescription({ children: "Choose your preferred language for the interface." }),
          ],
        }),
        FormItem({
          children: [
            FormLabel({ children: "Timezone" }),
            Select({
              id: "form-select-timezone",
              name: "timezone",
              placeholder: "Select timezone",
              options: [
                { value: "est", label: "Eastern Standard Time (EST)", group: "North America" },
                { value: "cst", label: "Central Standard Time (CST)", group: "North America" },
                { value: "mst", label: "Mountain Standard Time (MST)", group: "North America" },
                { value: "pst", label: "Pacific Standard Time (PST)", group: "North America" },
                { value: "gmt", label: "Greenwich Mean Time (GMT)", group: "Europe" },
                { value: "cet", label: "Central European Time (CET)", group: "Europe" },
              ],
            }),
            FormDescription({ children: "Your timezone will be used for scheduling and notifications." }),
          ],
        }),
        FormItem({
          children: [
            FormLabel({ children: "Account Type" }),
            Select({
              id: "form-select-account",
              name: "account",
              required: true,
              placeholder: "Choose account type",
              options: [
                { value: "free", label: "Free" },
                { value: "pro", label: "Pro" },
                { value: "enterprise", label: "Enterprise (Contact Sales)", disabled: true },
              ],
            }),
            FormDescription({ children: "Select the account type that best fits your needs." }),
          ],
        }),
        Button({ children: "Save Profile" }),
      ],
    }),
};

/** Manuelle Komposition mit langer Liste: `class` am SelectContent setzt die maximale Höhe (Scrollen) */
export const Scrollable: Story = {
  render: () => {
    const id = "select-scrollable";
    const regions: Record<string, string[]> = {
      "North America": ["United States", "Canada", "Mexico"],
      Europe: ["United Kingdom", "France", "Germany", "Spain", "Italy", "Netherlands", "Belgium", "Sweden", "Norway", "Denmark", "Finland"],
      Asia: ["Japan", "China", "South Korea", "India", "Singapore", "Thailand", "Vietnam", "Indonesia"],
      Oceania: ["Australia", "New Zealand"],
      "South America": ["Brazil", "Argentina", "Chile", "Colombia", "Peru"],
    };

    // Globaler Index über alle Gruppen (für die Tastaturnavigation)
    let index = 0;
    const groups = Object.entries(regions).map(([region, countries]) =>
      [
        index > 0 ? SelectSeparator() : "",
        SelectGroup({
          children: [
            SelectLabel({ children: region }),
            ...countries.map((country) =>
              SelectItem({ id, value: country.toLowerCase().replaceAll(" ", "-"), index: index++, children: country })
            ),
          ],
        }),
      ].join("")
    );

    return `<div class="w-64">${Select({
      id,
      children: [
        SelectTrigger({ id, children: SelectValue({ id, placeholder: "Select a country..." }) }),
        SelectContent({ id, class: "max-h-[300px]", children: groups }),
      ],
    })}</div>`;
  },
};
