import type { Meta, StoryObj } from "@storybook/html-vite";
import { Button } from "../button";
import { PopoverContent, PopoverTrigger } from "./Popover";
import type { PopoverContentArgs } from "./Popover.types";

type PopoverStoryArgs = Omit<PopoverContentArgs, "children"> & {
  triggerLabel?: string;
  text?: string;
};

/** Trigger + Content als Paar rendern. IDs müssen pro Story eindeutig sein (die Docs-Seite rendert mehrere Stories). */
const popover = (
  id: string,
  trigger: string,
  content: string,
  options: Omit<PopoverContentArgs, "id" | "children"> = { useAnchor: true, side: "bottom" }
): string =>
  PopoverTrigger({ popoverId: id, children: trigger }) +
  PopoverContent({ id, children: content, ...options });

const meta = {
  title: "UI-Library/Popover",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Zeigt Rich Content in einem Portal an, ausgelöst über einen Trigger, mit der nativen Popover API und CSS Anchor Positioning.",
      },
    },
  },
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
    align: { control: "select", options: ["start", "center", "end"] },
    sideOffset: { control: "number" },
    useAnchor: { control: "boolean" },
  },
  args: {
    id: "popover-default",
    useAnchor: true,
    side: "bottom",
    sideOffset: 8,
    triggerLabel: "Open popover",
    text: "Place content for the popover here.",
  },
  render: ({ triggerLabel, text, ...args }) =>
    popover(args.id, Button({ children: triggerLabel }), `<p class="text-sm">${text}</p>`, args),
} satisfies Meta<PopoverStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sides: Story = {
  render: () => {
    const sides = ["left", "top", "bottom", "right"] as const;
    const position = { top: "above", bottom: "below", left: "to the left of", right: "to the right of" };

    const items = sides
      .map((side) => {
        const label = side.charAt(0).toUpperCase() + side.slice(1);
        return popover(
          `popover-side-${side}`,
          Button({ children: `${label} Side` }),
          `<h4 class="font-medium">${label} Side Popover</h4>
           <p class="text-sm text-muted-foreground">This popover appears ${position[side]} the trigger using side="${side}".</p>`,
          { useAnchor: true, side }
        );
      })
      .join("");

    return `<div class="flex flex-wrap items-center justify-center gap-4 p-24">${items}</div>`;
  },
};

export const CardTrigger: Story = {
  render: () =>
    popover(
      "popover-card-trigger",
      `<div class="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
         <p class="font-medium">User Profile</p>
         <p class="text-sm text-muted-foreground">Click for details</p>
       </div>`,
      `<div class="space-y-3">
         <div>
           <h4 class="font-medium">John Doe</h4>
           <p class="text-sm text-muted-foreground">Software Engineer at Acme Corp</p>
           <p class="text-sm">john@example.com</p>
         </div>
         <div class="flex gap-2">
           ${Button({ children: "Message", size: "sm" })}
           ${Button({ children: "View Profile", size: "sm", variant: "outline" })}
         </div>
       </div>`
    ),
};

export const BadgeTrigger: Story = {
  render: () =>
    popover(
      "popover-badge-trigger",
      `<span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">Online Status</span>`,
      `<div class="space-y-2">
         <h4 class="font-medium">Status Details</h4>
         <p class="text-sm text-muted-foreground">User is currently online and available for collaboration.</p>
         <ul class="text-sm">
           <li>Last seen: Now</li>
           <li>Timezone: PST (UTC-8)</li>
           <li>Available until: 6:00 PM</li>
         </ul>
       </div>`
    ),
};

export const InteractiveElement: Story = {
  render: () =>
    popover(
      "popover-interactive",
      Button({ children: "Add Item" }),
      `<div class="space-y-3">
         <div>
           <h4 class="font-medium">Add New Item</h4>
           <p class="text-sm text-muted-foreground">Choose what type of item you'd like to create.</p>
         </div>
         <div class="grid gap-2">
           ${["📄 Document", "📁 Folder", "🖼️ Image", "🔗 Link"]
             .map((label) => Button({ children: label, variant: "outline" }))
             .join("")}
         </div>
       </div>`
    ),
};
