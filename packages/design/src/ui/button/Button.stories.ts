import type { Meta, StoryObj } from "@storybook/html-vite";
import { delay, http, HttpResponse } from "msw";
import { Button } from "./Button";
import type { ButtonArgs } from "./Button.types";

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

export const Outline: Story = { args: { variant: "outline", children: "Outline" } };
