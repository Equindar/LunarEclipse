import type { Meta, StoryObj } from "@storybook/html-vite";

import { Label } from "../label";
import { Input } from "./Input";
import type { InputArgs } from "./Input.types";

const meta: Meta<InputArgs> = {
  title: "UI-Library/Input",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Texteingabefeld (shadcn/ui New York v4). Mit `formId` und `name` wird automatisch ein Datastar-`data-bind` gesetzt.",
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "password", "email", "number", "tel", "url", "search", "date", "time", "color", "file"],
    },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    class: { control: "text" },
  },
  args: {
    type: "text",
    placeholder: "Placeholder",
  },
  render: (args) => `<div class="w-72">${Input(args)}</div>`,
};

export default meta;
type Story = StoryObj<InputArgs>;

export const Default: Story = {};

export const Email: Story = {
  args: { type: "email", placeholder: "name@example.com", name: "email", id: "input-email" },
};

export const Password: Story = {
  args: { type: "password", placeholder: "Password", name: "password", id: "input-password" },
};

export const WithValue: Story = {
  args: { value: "Lunar Eclipse" },
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: "Disabled" },
};

export const Required: Story = {
  args: { required: true, placeholder: "Required" },
};

export const File: Story = {
  args: { type: "file" },
};

export const Invalid: Story = {
  args: { value: "invalid value", attributes: { "aria-invalid": "true" } },
};

/** Mit formId und name wird data-bind="<form_id>.<name>" gesetzt (Bindestriche werden zu Unterstrichen) */
export const FormBinding: Story = {
  args: { formId: "contact-form", name: "email", type: "email", placeholder: "name@example.com" },
};

/** Das Eltern-Element hat "group" und data-disabled="true": das Label wird mit dem Input ausgegraut */
export const DisabledWithLabel: Story = {
  render: () =>
    `<div class="group flex w-72 flex-col gap-2" data-disabled="true">
       ${Label({ for: "input-disabled-email", children: "Email" })}
       ${Input({ type: "email", id: "input-disabled-email", placeholder: "name@example.com", disabled: true })}
     </div>`,
};
