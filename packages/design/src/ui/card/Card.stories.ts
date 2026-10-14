import type { Meta, StoryObj } from "@storybook/html-vite";
import { Button } from "../Button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./Card";


const meta: Meta = {
  title: "UI/Card",
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj;

/** Header + Content + Footer */
export const Basic: Story = {
  render: () =>
    Card({
      class: "w-[350px]",
      children: [
        CardHeader({
          children: [
            CardTitle({ children: "Card Title" }),
            CardDescription({ children: "Card Description" }),
          ],
        }),
        CardContent({ children: "<p>Card Content</p>" }),
        CardFooter({ children: "<p>Card Footer</p>" }),
      ],
    }),
};

/** CardAction sitzt rechts oben im Header (Grid-Spalte 2) */
export const WithAction: Story = {
  render: () =>
    Card({
      class: "w-[350px]",
      children: [
        CardHeader({
          children: [
            CardTitle({ children: "Team Settings" }),
            CardDescription({
              children: "Manage your team settings and preferences.",
            }),
            CardAction({
              children: Button({ variant: "outline", size: "sm", children: "Edit" }),
            }),
          ],
        }),
        CardContent({
          class: "space-y-2 text-sm",
          children: [
            "<p>Team members: 12</p>",
            "<p>Active projects: 8</p>",
            "<p>Storage used: 2.4 GB</p>",
          ],
        }),
      ],
    }),
};

/** Footer mit Buttons */
export const WithFooterButtons: Story = {
  render: () =>
    Card({
      class: "w-[350px]",
      children: [
        CardHeader({
          children: [
            CardTitle({ children: "Create project" }),
            CardDescription({ children: "Deploy your new project in one click." }),
          ],
        }),
        CardContent({ children: "<p>Form fields would go here.</p>" }),
        CardFooter({
          class: "justify-between",
          children: [
            Button({ variant: "outline", children: "Cancel" }),
            Button({ children: "Deploy" }),
          ],
        }),
      ],
    }),
};

/**
 * Interaktiv mit Datastar (lokale Signale, kein Backend nötig).
 * Eigenes Beispiel, nicht 1:1 aus dem Original.
 * Hinweis: Attribut-Syntax (data-on-click vs. data-on:click) muss zur
 * eingebundenen Datastar-Version passen.
 */
export const Interactive: Story = {
  render: () =>
    Card({
      class: "w-[350px]",
      attributes: { "data-signals": "{likes: 0, saved: false}" },
      children: [
        CardHeader({
          children: [
            CardTitle({ children: "Interactive Post" }),
            CardDescription({
              children: "This card demonstrates Datastar reactivity.",
            }),
          ],
        }),
        CardContent({
          children:
            "<p>This is a sample post that you can interact with using the buttons below.</p>",
        }),
        CardFooter({
          class: "gap-2",
          children: [
            Button({
              variant: "outline",
              attributes: { "data-on-click": "$likes++" },
              children: '<span data-text="$likes"></span> Likes',
            }),
            Button({
              variant: "secondary",
              attributes: {
                "data-on-click": "$saved = !$saved",
                "data-text": "$saved ? 'Saved' : 'Save'",
              },
              children: "Save",
            }),
          ],
        }),
      ],
    }),
};

/** Teil-Kombinationen, wie auf der Demo-Seite unter "Component Variations" */
export const Variations: Story = {
  render: () =>
    `<div class="flex flex-col gap-4 w-87.5">${[
      Card({ children: CardContent({ children: "Content Only" }) }),
      Card({
        children: CardHeader({
          children: [
            CardTitle({ children: "Header Only" }),
            CardDescription({ children: "A card with a header and a description." }),
          ],
        }),
      }),
      Card({
        children: [
          CardHeader({ children: CardTitle({ children: "Header + Footer" }) }),
          CardFooter({ children: "Footer" }),
        ],
      }),
    ].join("")}</div>`,
};
