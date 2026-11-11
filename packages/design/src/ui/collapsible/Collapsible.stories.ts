import type { Meta, StoryObj } from "@storybook/html-vite";

import { Icon } from "../..";
import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { Button } from "../button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./Collapsible";
import { collapsibleSignals } from "./Collapsible.expressions";
import type { CollapsibleArgs } from "./Collapsible.types";

type CollapsibleStoryArgs = Pick<CollapsibleArgs, "id" | "open" | "disabled" | "class">;

/** Lucide-Icon als Inline-SVG (nur für die Stories) */
const icon = (paths: string, className = "size-4"): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const folderIcon = (): string =>
  icon(
    `<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>`
  );
const fileIcon = (): string =>
  icon(`<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>`);

type TriggerState = Pick<CollapsibleArgs, "id" | "open" | "disabled">;

/** Trigger, der den Button des Design-Systems als Element verwendet (entspricht render={<Button />} der Quelle) */
const buttonTrigger = (
  state: TriggerState,
  children: string,
  options: { variant?: "ghost" | "outline"; class?: string } = {}
): string =>
  CollapsibleTrigger({
    ...state,
    render: (attributes) =>
      Button({ variant: options.variant ?? "ghost", class: options.class, attributes, children }),
  });

/** Zeilen "Label / Wert" für den Bestell-Inhalt */
const detailRow = (label: string, value: string): string =>
  `<div class="flex items-center justify-between rounded-md border px-4 py-2 text-sm"><span class="text-muted-foreground">${label}</span><span class="font-medium">${value}</span></div>`;

/** Bestell-Beispiel der Docs (Titel, Toggle-Button, aufklappbare Details) */
const orderCollapsible = (
  args: CollapsibleStoryArgs,
  text = { title: "Order #4189", toggle: "Toggle details", label: "Status", value: "Shipped" }
): string => {
  const state: TriggerState = { id: args.id, open: args.open, disabled: args.disabled };

  return Collapsible({
    ...state,
    class: cn("flex w-87.5 flex-col gap-2", args.class),
    children: [
      `<div class="flex items-center justify-between gap-4"><h4 class="text-sm font-semibold">${text.title}</h4>${buttonTrigger(state, text.toggle, { variant: "outline" })}</div>`,
      CollapsibleContent({ id: args.id, open: args.open, class: "flex flex-col gap-2", children: detailRow(text.label, text.value) }),
    ],
  });
};

const meta: Meta<CollapsibleStoryArgs> = {
  title: "UI-Library/Collapsible",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Ein interaktives Element, das einen Bereich ein- und ausklappt. Wurzel, Trigger und Content teilen sich eine ID; der Zustand liegt im Datastar-Signal `$<id>.open` (\"-\" in der ID wird zu \"_\"). Funktioniert nur mit geladenem Datastar: Ohne Datastar bleibt ein geschlossener Content (display: none) unsichtbar.",
      },
    },
  },
  argTypes: {
    id: { control: "text" },
    open: { control: "boolean" },
    disabled: { control: "boolean" },
    class: { control: "text" },
  },
  args: {
    id: "collapsible-default",
    open: false,
    disabled: false,
  },
  render: (args) => orderCollapsible(args),
};

export default meta;
type Story = StoryObj<CollapsibleStoryArgs>;

export const Default: Story = {};

export const DefaultOpen: Story = {
  args: { id: "collapsible-open", open: true },
  parameters: {
    docs: { description: { story: "Anfangszustand geöffnet (`open: true`). Wurzel, Trigger und Content bekommen denselben Wert." } },
  },
};

export const Disabled: Story = {
  args: { id: "collapsible-disabled", disabled: true },
  parameters: {
    docs: {
      description: {
        story: "Deaktiviert: Der Trigger bekommt `disabled` und keinen Klick-Handler, die Wurzel `data-disabled`.",
      },
    },
  },
};

export const Basic: Story = {
  args: { id: "collapsible-basic" },
  render: (args) => {
    const state: TriggerState = { id: args.id, open: args.open, disabled: args.disabled };

    return `<div class="w-87.5 rounded-xl border bg-card text-card-foreground shadow-sm">${Collapsible({
      ...state,
      class: args.class,
      children: [
        `<div class="flex items-center justify-between gap-4 px-6 py-4"><h4 class="text-sm font-semibold">Product details</h4>${buttonTrigger(
          state,
          `${Icon({ name: "chevron-down", class: "size-4 transition-transform group-data-[state=open]:rotate-180" })}<span class="sr-only">Toggle</span>`,
          { class: "group size-8 p-0" }
        )}</div>`,
        CollapsibleContent({
          id: args.id,
          open: args.open,
          class: "border-t px-6 py-4 text-sm text-muted-foreground",
          children: "This content can be expanded and collapsed with the button.",
        }),
      ],
    })}</div>`;
  },
};

export const SettingsPanel: Story = {
  args: { id: "collapsible-settings", open: false },
  parameters: {
    docs: { description: { story: "Ein Trigger-Button blendet zusätzliche Einstellungen ein." } },
  },
  render: (args) => {
    const state: TriggerState = { id: args.id, open: args.open, disabled: args.disabled };

    const field = (name: string, label: string): string =>
      `<div class="flex flex-col gap-1.5"><label for="${escapeHtml(args.id)}-${name}" class="text-sm font-medium">${label}</label><input id="${escapeHtml(args.id)}-${name}" type="number" value="0" class="h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50" /></div>`;

    return `<div class="w-87.5 rounded-xl border bg-card p-4 text-card-foreground shadow-sm">${Collapsible({
      ...state,
      class: cn("flex flex-col gap-4", args.class),
      children: [
        `<div class="flex items-start justify-between gap-4">
          <div class="flex flex-col gap-1">
            <h4 class="text-sm font-semibold">Radius</h4>
            <p class="text-sm text-muted-foreground">Set the corner radius of the element.</p>
          </div>
          ${buttonTrigger(
            state,
            `${Icon({ name: "chevron-down", class: "size-4 transition-transform group-data-[state=open]:rotate-180" })}<span class="sr-only">Toggle radius settings</span>`,
          { class: "group size-8 p-0" }
        )}</div>`,
        CollapsibleContent({
          id: args.id,
          open: args.open,
          class: "grid grid-cols-2 gap-4",
          children: [field("radius-x", "Radius X"), field("radius-y", "Radius Y")],
        }),
      ],
    })}</div>`;
  },
};

interface TreeNode {
  name: string;
  open?: boolean;
  children?: TreeNode[];
}

const fileTree: TreeNode[] = [
  {
    name: "components",
    open: true,
    children: [
      { name: "ui", children: [{ name: "button.tsx" }, { name: "card.tsx" }] },
      { name: "login-form.tsx" },
      { name: "register-form.tsx" },
    ],
  },
  { name: "lib", children: [{ name: "utils.ts" }] },
  { name: "hooks", children: [{ name: "use-media-query.ts" }] },
  { name: "types", children: [{ name: "index.d.ts" }] },
  { name: "public", children: [{ name: "favicon.ico" }] },
  { name: "app.tsx" },
  { name: "layout.tsx" },
  { name: "globals.css" },
  { name: "package.json" },
  { name: "tsconfig.json" },
  { name: "README.md" },
  { name: ".gitignore" },
];

/** Rendert einen Knoten rekursiv; jeder Ordner ist ein eigenes Collapsible (ID aus dem Pfad) */
const renderNode = (node: TreeNode, path: string): string => {
  if (!node.children) {
    return `<div class="flex h-8 items-center gap-2 pl-8 pr-2 text-sm">${fileIcon()}<span>${node.name}</span></div>`;
  }

  const id = `collapsible-tree-${path}`;
  const state: TriggerState = { id, open: node.open };

  return Collapsible({
    ...state,
    children: [
      buttonTrigger(
        state,
        `${Icon({ name: "chevron-right", class: "size-4 transition-transform group-data-[state=open]:rotate-90" })}${folderIcon()}<span>${node.name}</span>`,
        { class: "group h-8 w-full justify-start gap-2 px-2 font-normal" }
      ),
      CollapsibleContent({
        id,
        open: node.open,
        class: "ml-4 border-l pl-2",
        children: node.children.map((child, index) => renderNode(child, `${path}-${index}`)),
      }),
    ],
  });
};

export const FileTree: Story = {
  parameters: {
    docs: { description: { story: "Verschachtelte Collapsibles als Dateibaum. Jeder Ordner hat eine eigene ID und einen eigenen Zustand." } },
  },
  render: () =>
    `<div class="w-75 rounded-xl border bg-card p-2 text-card-foreground shadow-sm"><div class="px-2 py-1.5 text-sm font-semibold">Explorer</div>${fileTree
      .map((node, index) => renderNode(node, String(index)))
      .join("")}</div>`,
};

export const ControlledState: Story = {
  args: { id: "collapsible-controlled" },
  parameters: {
    docs: {
      description: {
        story:
          "Der Zustand lässt sich von außen steuern, weil Datastar-Signale global sind: Die Buttons setzen `$collapsible_controlled.open` direkt (Ersatz für `open` und `onOpenChange` der React-Vorlage).",
      },
    },
  },
  render: (args) => {
    const signals = collapsibleSignals(args.id);

    const controls = `<div class="flex items-center gap-2">${Button({
      variant: "outline",
      children: "Open",
      attributes: { "data-on:click": signals.set("open", "true") },
    })}${Button({
      variant: "outline",
      children: "Close",
      attributes: { "data-on:click": signals.set("open", "false") },
    })}<span class="text-sm text-muted-foreground">State: <span data-text="${escapeHtml(
      signals.conditional("open", "'open'", "'closed'")
    )}">closed</span></span></div>`;

    return `<div class="flex w-87.5 flex-col gap-4">${controls}${orderCollapsible(args)}</div>`;
  },
};

export const Rtl: Story = {
  args: { id: "collapsible-rtl" },
  parameters: {
    docs: { description: { story: "Rechts-nach-links-Layout über `dir=\"rtl\"` am umgebenden Element." } },
  },
  render: (args) =>
    `<div dir="rtl">${orderCollapsible(args, {
      title: "الطلب #4189",
      toggle: "تبديل التفاصيل",
      label: "الحالة",
      value: "تم الشحن",
    })}</div>`,
};
