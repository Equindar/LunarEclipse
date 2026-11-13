import type { Meta, StoryObj } from "@storybook/html-vite";
import { delay, http, HttpResponse } from "msw";
import { Icon } from "../icon";
import { Button } from "./Button";
import type { ButtonArgs, ButtonVariant } from "./Button.types";

const variants: ButtonVariant[] = ["default", "secondary", "destructive", "outline", "ghost", "link"];

const meta: Meta<ButtonArgs> = {
  title: "UI-Library/Buttons/Button",
  tags: ['autodocs'],
  render: (args) => Button(args),
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: { control: "select", options: ["default", "sm", "lg", "icon"] },
    disabled: { control: "boolean" },
    children: { control: "text" },
  }
};
export default meta;

type Story = StoryObj<ButtonArgs>;

export const Default: Story = {
  args: { children: "Button" },
  // globals: { colorMode: "dark" }
 };

 /** Die Variante wird über `variant` gewählt */
export const Variants: Story = {
  render: (args) =>
    `<div class="flex flex-wrap items-center gap-2">${variants
      .map((variant) => Button({ variant, children: variant.charAt(0).toUpperCase() + variant.slice(1), size: args.size, disabled: args.disabled }))
      .join("")}</div>`,
};

export const Destructive: Story = {
  args: {
    children: "Löschen",
    variant: "destructive",
    attributes: { "data-on:click": "@post('/api/delete')" },
  },
  parameters: {
    msw: {
      handlers: [
        http.post("/api/delete", async () => {
          await delay(500);
          const body =
            "event: datastar-patch-signals\n" +
            'data: signals {"deleted": true}\n\n';
          return new HttpResponse(body, {
            headers: { "Content-Type": "text/event-stream" },
          });
        }),
      ],
    },
  },
};

export const withIcon: Story = {
  args: {
    children: `${Icon({ name: "app-window" })} Button mit Icon`,
    attributes: { "data-on:click": "@post('/api/delete')" },
  },
};
