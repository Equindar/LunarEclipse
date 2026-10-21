import type { Meta, StoryObj } from "@storybook/html-vite";

import { Label } from "../label";
import { Textarea } from "./Textarea";
import type { TextareaArgs } from "./Textarea.types";

const meta: Meta<TextareaArgs> = {
  title: "UI-Library/Textarea",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Mehrzeiliges Eingabefeld (shadcn/ui New York v4). Mit `formId` und `name` wird automatisch ein Datastar-`data-bind` gesetzt.",
      },
    },
  },
  argTypes: {
    rows: { control: "number" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    borderless: { control: "boolean" },
    class: { control: "text" },
  },
  args: {
    placeholder: "Type your message here.",
  },
  render: (args) => `<div class="w-80">${Textarea(args)}</div>`,
};

export default meta;
type Story = StoryObj<TextareaArgs>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { value: "Lunar Eclipse is a design system." },
};

export const Rows: Story = {
  args: { rows: 8, placeholder: "Eight rows" },
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: "Disabled" },
};

export const Required: Story = {
  args: { required: true, placeholder: "Required" },
};

export const Borderless: Story = {
  args: { borderless: true, placeholder: "Borderless" },
  decorators: [(story) => `<div class="rounded-md border border-dashed p-2">${story()}</div>`],
};

export const Invalid: Story = {
  args: { value: "invalid value", attributes: { "aria-invalid": "true" } },
};

export const WithLabel: Story = {
  render: () =>
    `<div class="flex w-80 flex-col gap-2">
       ${Label({ for: "textarea-message", children: "Your message" })}
       ${Textarea({ id: "textarea-message", name: "message", placeholder: "Type your message here." })}
     </div>`,
};

/** Mit formId und name wird data-bind="<form_id>.<name>" gesetzt (Bindestriche werden zu Unterstrichen) */
export const FormBinding: Story = {
  args: { formId: "contact-form", name: "message", placeholder: "Type your message here." },
};

/** Das Eltern-Element hat "group" und data-disabled="true": das Label wird mit der Textarea ausgegraut */
export const DisabledWithLabel: Story = {
  render: () =>
    `<div class="group flex w-80 flex-col gap-2" data-disabled="true">
       ${Label({ for: "textarea-disabled-message", children: "Your message" })}
       ${Textarea({ id: "textarea-disabled-message", name: "message", placeholder: "Type your message here.", disabled: true })}
     </div>`,
};
