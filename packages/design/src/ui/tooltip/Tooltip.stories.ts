import type { Meta, StoryObj } from "@storybook/html-vite";

import { Button } from "../button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./Tooltip";
import type { TooltipContentArgs, TooltipTriggerArgs } from "./Tooltip.types";

type TooltipStoryArgs = Omit<TooltipContentArgs, "children"> & {
  delay?: number;
  triggerLabel?: string;
  text?: string;
};

type PairOptions = Omit<TooltipContentArgs, "id" | "children"> &
  Pick<TooltipTriggerArgs, "delay" | "focusable">;

/** Tooltip aus Trigger und Content. IDs müssen pro Story eindeutig sein (die Docs-Seite rendert mehrere Stories). */
const tooltip = (id: string, trigger: string, content: string, options: PairOptions = {}): string => {
  const { delay, focusable, ...contentOptions } = options;

  return Tooltip({
    children: [
      TooltipTrigger({ tooltipId: id, delay, focusable, children: trigger }),
      TooltipContent({ id, children: content, ...contentOptions }),
    ],
  });
};

const outlineButton = (label: string, extra: { disabled?: boolean; class?: string } = {}): string =>
  Button({
    children: label,
    variant: "outline",
    class: extra.class,
    attributes: extra.disabled ? { disabled: true } : undefined,
  });

/** Tastenkürzel wie die Kbd-Komponente von shadcn (Klassen aus cn-kbd, im Tooltip heller) */
const kbd = (key: string): string =>
  `<kbd data-slot="kbd" class="pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm bg-background/20 px-1 font-sans text-xs font-medium text-background dark:bg-background/10">${key}</kbd>`;

const meta: Meta<TooltipStoryArgs> = {
  title: "UI-Library/Tooltip",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Ein Popup mit Zusatzinfos zu einem Element, das bei Mouse-Hover oder Tastaturfokus erscheint. Escape und Klick blenden es aus. Die Komponente nutzt die native Popover API mit CSS Anchor Positioning und funktioniert nur mit geladenem Datastar. TooltipProvider legt eine Standard-Verzögerung für alle Tooltips darunter fest.",
      },
    },
  },
  argTypes: {
    side: {
      control: "select",
      options: ["top", "bottom", "left", "right", "inline-start", "inline-end"],
    },
    align: { control: "select", options: ["start", "center", "end"] },
    sideOffset: { control: "number" },
    alignOffset: { control: "number" },
    dir: { control: "select", options: ["ltr", "rtl"] },
    delay: { control: "number" },
    triggerLabel: { control: "text" },
    text: { control: "text" },
  },
  args: {
    id: "tooltip-playground",
    side: "top",
    align: "center",
    sideOffset: 4,
    alignOffset: 0,
    dir: "ltr",
    delay: 0,
    triggerLabel: "Hover",
    text: "Add to library",
  },
  render: ({ triggerLabel, text, delay, ...args }) =>
    `<div class="p-24">${tooltip(args.id, outlineButton(triggerLabel ?? ""), `<p>${text ?? ""}</p>`, { ...args, delay })}</div>`,
};

export default meta;
type Story = StoryObj<TooltipStoryArgs>;

export const Playground: Story = {};

export const Default: Story = {
  render: () =>
    TooltipProvider({
      children: `<div class="p-24">${tooltip("tooltip-default", outlineButton("Hover"), "<p>Add to library</p>")}</div>`,
    }),
};

export const Side: Story = {
  render: () => {
    const sides = ["left", "top", "bottom", "right"] as const;

    const items = sides
      .map((side) =>
        tooltip(`tooltip-side-${side}`, outlineButton(side.charAt(0).toUpperCase() + side.slice(1)), `<p>Add to library</p>`, {
          side,
        })
      )
      .join("");

    return TooltipProvider({
      children: `<div class="flex flex-wrap items-center justify-center gap-4 p-24">${items}</div>`,
    });
  },
};

export const Align: Story = {
  render: () => {
    const aligns = ["start", "center", "end"] as const;

    const items = aligns
      .map((align) =>
        tooltip(`tooltip-align-${align}`, outlineButton(`Align ${align}`, { class: "w-40" }), `<p>Add to library</p>`, {
          side: "top",
          align,
        })
      )
      .join("");

    return TooltipProvider({
      children: `<div class="flex flex-wrap items-center justify-center gap-4 p-24">${items}</div>`,
    });
  },
};

export const WithKeyboardShortcut: Story = {
  render: () =>
    TooltipProvider({
      children: `<div class="p-24">${tooltip(
        "tooltip-keyboard-shortcut",
        outlineButton("Save"),
        `<p>Save Changes</p>${kbd("S")}`
      )}</div>`,
    }),
};

export const DisabledButton: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Ein deaktivierter Button löst keine Maus- und Fokus-Ereignisse aus. Der Trigger umschließt ihn deshalb als fokussierbarer Wrapper (`focusable`), der Button selbst bekommt `pointer-events-none`.",
      },
    },
  },
  render: () =>
    TooltipProvider({
      children: `<div class="p-24">${tooltip(
        "tooltip-disabled-button",
        outlineButton("Disabled", { disabled: true, class: "pointer-events-none" }),
        "<p>This feature is currently unavailable</p>",
        { focusable: true }
      )}</div>`,
    }),
};

export const ProviderDelay: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Der Provider setzt 800 ms für alle Tooltips darunter. Der zweite Trigger überschreibt das mit `delay: 0`. Ohne Provider gelten 600 ms.",
      },
    },
  },
  render: () =>
    TooltipProvider({
      delay: 800,
      children: `<div class="flex flex-wrap items-center justify-center gap-4 p-24">${[
        tooltip("tooltip-provider-delay-default", outlineButton("Provider: 800 ms"), "<p>Erscheint nach 800 ms</p>"),
        tooltip("tooltip-provider-delay-instant", outlineButton("Eigenes Delay: 0 ms"), "<p>Erscheint sofort</p>", {
          delay: 0,
        }),
      ].join("")}</div>`,
    }),
};

export const RTL: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Bei `dir=\"rtl\"` zeigen `inline-start` und `inline-end` auf die jeweils gegenüberliegende physische Seite. Das Markup braucht dazu ein umschließendes Element mit `dir=\"rtl\"`.",
      },
    },
  },
  render: () => {
    const physical = [
      { side: "left", label: "يسار" },
      { side: "top", label: "أعلى" },
      { side: "bottom", label: "أسفل" },
      { side: "right", label: "يمين" },
    ] as const;

    const logical = [
      { side: "inline-start", label: "بداية السطر" },
      { side: "inline-end", label: "نهاية السطر" },
    ] as const;

    const items = [...physical, ...logical]
      .map(({ side, label }) =>
        tooltip(`tooltip-rtl-${side}`, outlineButton(label), "<p>إضافة إلى المكتبة</p>", { side, dir: "rtl" })
      )
      .join("");

    return TooltipProvider({
      children: `<div dir="rtl" class="flex flex-wrap items-center justify-center gap-4 p-24">${items}</div>`,
    });
  },
};
