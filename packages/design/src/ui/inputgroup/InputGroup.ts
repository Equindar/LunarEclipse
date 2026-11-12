import { cn } from "../../utils/cn";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import { Button } from "../button";
import { Input } from "../input";
import { Textarea } from "../textarea";
import {
    buildInputGroupAddonAttributes,
    buildInputGroupAttributes,
    buildInputGroupButtonAttributes,
    buildInputGroupControlAttributes,
    DEFAULT_ADDON_ALIGN,
    DEFAULT_BUTTON_SIZE,
    DEFAULT_BUTTON_TYPE,
    DEFAULT_BUTTON_VARIANT,
} from "./InputGroup.expressions";
import type {
    InputGroupAddonAlign,
    InputGroupAddonArgs,
    InputGroupArgs,
    InputGroupButtonArgs,
    InputGroupButtonSize,
    InputGroupInputArgs,
    InputGroupTextareaArgs,
    InputGroupTextArgs,
} from "./InputGroup.types";

/*
 * Klassen aus shadcn/ui (Base-Variante). Die Quelle verwendet Platzhalter-Klassen (cn-input-group*),
 * die konkreten Klassen stammen aus dem Style "vega". Basis-Klassen stehen vor den aufgelösten Klassen.
 */

const inputGroupTw = tw`group/input-group relative flex w-full min-w-0 items-center outline-none has-[>textarea]:h-auto border-input dark:bg-input/30 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 h-9 rounded-md border shadow-xs transition-[color,box-shadow] in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-3 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5`;

const inputGroupAddonTw = tw`flex cursor-text items-center justify-center select-none text-muted-foreground h-auto gap-2 py-1.5 text-sm font-medium group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4`;

const inputGroupAddonAlignTw: Record<InputGroupAddonAlign, string> = {
  "inline-start": tw`order-first pl-2 has-[>button]:-ml-1 has-[>kbd]:ml-[-0.15rem]`,
  "inline-end": tw`order-last pr-2 has-[>button]:-mr-1 has-[>kbd]:mr-[-0.15rem]`,
  "block-start": tw`order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2`,
  "block-end": tw`order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2`,
};

const inputGroupButtonTw = tw`flex items-center shadow-none gap-2 text-sm`;

/** Hinweis: Für "sm" definiert der Style "vega" keine eigenen Klassen, es gilt die Standardgröße des Buttons */
const inputGroupButtonSizeTw: Record<InputGroupButtonSize, string> = {
  xs: tw`h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5`,
  sm: "",
  "icon-xs": tw`size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0`,
  "icon-sm": tw`size-8 p-0 has-[>svg]:p-0`,
};

const inputGroupTextTw = tw`flex items-center [&_svg]:pointer-events-none text-muted-foreground gap-2 text-sm [&_svg:not([class*='size-'])]:size-4`;

const inputGroupInputTw = tw`flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent`;

const inputGroupTextareaTw = tw`flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent`;

export function inputGroupVariants(args: Pick<InputGroupArgs, "class"> = {}): string {
  return cn(inputGroupTw, args.class);
}

export function inputGroupAddonVariants(args: Pick<InputGroupAddonArgs, "align" | "class"> = {}): string {
  return cn(inputGroupAddonTw, inputGroupAddonAlignTw[args.align ?? DEFAULT_ADDON_ALIGN], args.class);
}

export function inputGroupButtonVariants(args: Pick<InputGroupButtonArgs, "size" | "class"> = {}): string {
  return cn(inputGroupButtonTw, inputGroupButtonSizeTw[args.size ?? DEFAULT_BUTTON_SIZE], args.class);
}

/**
 * Gruppe um ein Eingabefeld mit Addons.
 * Das Addon muss im DOM nach dem Eingabefeld stehen (Fokus-Reihenfolge); `align` positioniert es optisch.
 * Nutzer-Attribute werden zuerst übernommen und von den Standard-Attributen überschrieben.
 */
export function InputGroup(args: InputGroupArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildInputGroupAttributes(),
    class: inputGroupVariants({ class: args.class }),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Addon mit Icon, Text, Buttons oder Kbd. Ein Klick (außer auf Buttons) fokussiert das Eingabefeld. */
export function InputGroupAddon(args: InputGroupAddonArgs = {}): string {
  const align = args.align ?? DEFAULT_ADDON_ALIGN;

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildInputGroupAddonAttributes(align),
    class: inputGroupAddonVariants({ align, class: args.class }),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Button in einer Gruppe: reicht an den Button des Design-Systems weiter (Standard: ghost, Größe xs) */
export function InputGroupButton(args: InputGroupButtonArgs = {}): string {
  const size = args.size ?? DEFAULT_BUTTON_SIZE;

  return Button({
    variant: args.variant ?? DEFAULT_BUTTON_VARIANT,
    class: inputGroupButtonVariants({ size, class: args.class }),
    attributes: {
      ...args.attributes,
      ...buildInputGroupButtonAttributes(size, args.type ?? DEFAULT_BUTTON_TYPE),
    },
    children: args.children,
  });
}

/** Text in einer Gruppe (`<span>`); Icons darin erhalten die Standardgröße size-4 */
export function InputGroupText(args: InputGroupTextArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    class: cn(inputGroupTextTw, args.class),
  };

  return `<span${renderAttributes(attrs)}>${renderChildren(args.children)}</span>`;
}

/** Ersatz für Input in einer Gruppe: data-slot="input-group-control" steuert Fokus- und Fehlerzustand der Gruppe */
export function InputGroupInput(args: InputGroupInputArgs = {}): string {
  return Input({
    class: cn(inputGroupInputTw, args.class),
    attributes: { ...args.attributes, ...buildInputGroupControlAttributes() },
  });
}

/** Ersatz für Textarea in einer Gruppe; Addons dazu mit align="block-start" oder "block-end" */
export function InputGroupTextarea(args: InputGroupTextareaArgs = {}): string {
  return Textarea({
    class: cn(inputGroupTextareaTw, args.class),
    attributes: { ...args.attributes, ...buildInputGroupControlAttributes() },
  });
}
