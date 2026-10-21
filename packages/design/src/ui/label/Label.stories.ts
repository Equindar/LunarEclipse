import type { Meta, StoryObj } from "@storybook/html-vite";

import { Input } from "../input";
import { Label } from "./Label";
import type { LabelArgs } from "./Label.types";

type LabelStoryArgs = LabelArgs & { text?: string };

const meta: Meta<LabelStoryArgs> = {
  title: "UI-Library/Label",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Beschriftung für Formularelemente. Mit `for` wird sie mit der ID eines Inputs verknüpft. Disabled-Styling über `peer-disabled` (Input davor) oder `group-data-[disabled=true]` (Eltern-Element).",
      },
    },
  },
  argTypes: {
    for: { control: "text" },
    class: { control: "text" },
  },
  args: {
    text: "Email",
    for: "label-email",
  },
  render: ({ text, ...args }) => Label({ ...args, children: text }),
};

export default meta;
type Story = StoryObj<LabelStoryArgs>;

export const Default: Story = {};

export const WithInput: Story = {
  render: () =>
    `<div class="flex w-72 flex-col gap-2">
       ${Label({ for: "label-input-email", children: "Email" })}
       ${Input({ type: "email", id: "label-input-email", placeholder: "name@example.com" })}
     </div>`,
};

/** Der Input steht vor dem Label und trägt die Klasse "peer": Label wird bei disabled ausgegraut */
export const WithCheckbox: Story = {
  render: () =>
    `<div class="flex items-center gap-2">
       <input type="checkbox" id="label-terms" class="peer size-4" />
       ${Label({ for: "label-terms", children: "Accept terms and conditions" })}
     </div>`,
};

export const DisabledPeer: Story = {
  render: () =>
    `<div class="flex items-center gap-2">
       <input type="checkbox" id="label-terms-disabled" class="peer size-4" disabled />
       ${Label({ for: "label-terms-disabled", children: "Accept terms and conditions" })}
     </div>`,
};

/** Das Eltern-Element hat "group" und data-disabled="true" */
export const DisabledGroup: Story = {
  render: () =>
    `<div class="group flex w-72 flex-col gap-2" data-disabled="true">
       ${Label({ for: "label-group-email", children: "Email" })}
       ${Input({ type: "email", id: "label-group-email", placeholder: "name@example.com", disabled: true })}
     </div>`,
};
