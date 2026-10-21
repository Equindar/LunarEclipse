import type { Meta, StoryObj } from "@storybook/html-vite";
import { Checkbox } from "./Checkbox";
import type { CheckboxArgs } from "./Checkbox.types";

const meta: Meta<CheckboxArgs> = {
  title: "UI-Library/Checkbox",
  render: (args) => Checkbox(args),
  args: { id: "checkbox-demo" },
  argTypes: {
    id: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Checkbox mit Datastar-Signalen. Der Zustand liegt unter `$<id>.checked` / `$<id>.disabled`; die id muss pro Seite eindeutig sein.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<CheckboxArgs>;

export const Unchecked: Story = {};

export const Checked: Story = { args: { checked: true } };

export const Disabled: Story = { args: { disabled: true } };

export const DisabledChecked: Story = { args: { checked: true, disabled: true } };

/** Eigenes Beispiel (nicht aus dem Original): Label verweist per for= auf den Button */
export const WithLabel: Story = {
  args: { id: "terms" },
  render: (args) =>
    `<div class="flex items-center gap-2">
      ${Checkbox(args)}
      <label for="${args.id}" class="text-sm font-medium">Nutzungsbedingungen akzeptieren</label>
    </div>`,
};

/** Zwei Instanzen: getrennte Namespaces, kein Übersprechen */
export const TwoInstances: Story = {
  render: () =>
    `<div class="flex flex-col gap-3">
      ${Checkbox({ id: "first" })}
      ${Checkbox({ id: "second", checked: true })}
    </div>`,
};
