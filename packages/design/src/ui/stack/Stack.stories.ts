import type { Meta, StoryObj } from "@storybook/html-vite";

import { Stack, StackItem } from "./Stack";
import type { StackArgs } from "./Stack.types";

type StackStoryArgs = Omit<StackArgs, "children">;

/** Item im Stil der Docs-Beispiele: Titel und Beschreibung */
const notification = (title: string, text: string): string =>
  StackItem({
    class: "flex flex-col gap-2",
    children: [`<h3 class="font-semibold">${title}</h3>`, `<p class="text-sm text-muted-foreground">${text}</p>`],
  });

const notifications = (): string[] => [
  notification("Notification 1", "Your deployment was successful"),
  notification("Notification 2", "New message from John Doe"),
  notification("Notification 3", "Update available for your app"),
];

/** Mehr Items für die Stories zu itemCount und expandedItemCount */
const manyNotifications = (count: number): string[] =>
  Array.from({ length: count }, (_, i) => notification(`Notification ${i + 1}`, `Message number ${i + 1}`));

/** Der Stack braucht Platz, weil seine Items absolut positioniert sind */
const stage = (inner: string): string =>
  `<div class="flex min-h-100 items-center justify-center">${inner}</div>`;

const meta: Meta<StackStoryArgs> = {
  title: "UI-Library/Stack",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Zeigt Items gestapelt an, bei Hover fächern sie sich auf (ähnlich dem Stapeln von Sonner-Toasts). Port von Dice UI (Base). Das Auffächern funktioniert nur mit geladenem Datastar, ohne `expandOnHover` ist der Stack statisch. Die Items sind absolut positioniert, der Stack braucht deshalb Platz im umgebenden Container.",
      },
    },
  },
  argTypes: {
    side: { control: "select", options: ["top", "bottom"] },
    itemCount: { control: "number" },
    expandedItemCount: { control: "number" },
    gap: { control: "number" },
    scale: { control: "number" },
    offset: { control: "number" },
    expandOnHover: { control: "boolean" },
    class: { control: "text" },
  },
  args: {
    id: "stack-default",
    side: "bottom",
    expandOnHover: true,
    class: "w-[360px]",
  },
  render: (args) => stage(Stack({ ...args, children: notifications() })),
};

export default meta;
type Story = StoryObj<StackStoryArgs>;

export const Default: Story = {};

/** Ohne Auffächern: `expandOnHover: false` (der Standard der Komponente) ergibt einen statischen Stack */
export const WithoutExpansion: Story = {
  args: { id: "stack-without-expansion", expandOnHover: false },
  render: (args) =>
    stage(
      Stack({
        ...args,
        children: [
          StackItem({
            class: "flex flex-col gap-2",
            children: [
              `<h3 class="font-semibold">Static Stack</h3>`,
              `<p class="text-sm text-muted-foreground">This stack doesn't expand on hover</p>`,
            ],
          }),
          notification("Item 2", "The stacking effect remains constant"),
          notification("Item 3", "Perfect for permanent visual hierarchy"),
        ],
      })
    ),
};

/** Items von oben (`side: "top"`) oder von unten (`side: "bottom"`) stapeln */
export const DifferentSides: Story = {
  render: () =>
    `<div class="flex min-h-100 items-center justify-center gap-16">${[
      Stack({ id: "stack-side-top", side: "top", expandOnHover: true, class: "w-[300px]", children: notifications() }),
      Stack({
        id: "stack-side-bottom",
        side: "bottom",
        expandOnHover: true,
        class: "w-[300px]",
        children: notifications(),
      }),
    ].join("")}</div>`,
};

/** `itemCount` begrenzt die sichtbaren Items im eingeklappten Zustand, `expandedItemCount` im aufgefächerten */
export const VisibleItems: Story = {
  args: { id: "stack-visible-items", itemCount: 2, expandedItemCount: 4 },
  render: (args) => stage(Stack({ ...args, children: manyNotifications(6) })),
};

/** Abstand, Verkleinerung und Versatz über `gap`, `scale` und `offset` */
export const CustomSpacing: Story = {
  args: { id: "stack-custom-spacing", gap: 16, scale: 0.08, offset: 16 },
};
