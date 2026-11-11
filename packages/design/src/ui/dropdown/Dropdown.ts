import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes } from "../../utils/renderHtmlAttributes";
import { safeUrl } from "../../utils/safeUrl";
import { tw } from "../../utils/tw";
import {
    buildClickOutsideHandler,
    buildContentPositionStyle,
    buildEscapeHandler,
    buildItemClickExpr,
    buildTriggerClickExpr,
    dropdownMenuContentId,
    dropdownSignals,
} from "./Dropdown.expressions";
import type {
    DropdownMenuArgs,
    DropdownMenuContentArgs,
    DropdownMenuCustomItemArgs,
    DropdownMenuFormItemArgs,
    DropdownMenuGroupArgs,
    DropdownMenuItemArgs,
    DropdownMenuItemVariant,
    DropdownMenuLabelArgs,
    DropdownMenuLinkItemArgs,
    DropdownMenuSeparatorArgs,
    DropdownMenuShortcutArgs,
    DropdownMenuTriggerArgs,
} from "./Dropdown.types";

/* Tailwind-Klassen (shadcn/ui New York v4) */

export const dropdownMenuTw = tw`relative`;

/** overflow-visible statt overflow-hidden, damit verschachtelte Popover (z. B. Select) über das Menü hinausragen dürfen */
export const dropdownMenuContentTw = tw`z-50 min-w-32 overflow-visible rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`;

export const dropdownMenuItemTw = tw`focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`;

export const dropdownMenuItemVariantTw: Record<DropdownMenuItemVariant, string> = {
  default: "",
  destructive: tw`data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive`,
};

export const dropdownMenuInsetTw = tw`data-[inset]:pl-8`;

export const dropdownMenuItemIconColorTw = tw`[&_svg:not([class*='text-'])]:text-muted-foreground`;

export const dropdownMenuLabelTw = tw`px-2 py-1.5 text-sm font-medium`;

export const dropdownMenuSeparatorTw = tw`bg-border -mx-1 my-1 h-px`;

export const dropdownMenuShortcutTw = tw`text-muted-foreground ml-auto text-xs tracking-widest`;

export function dropdownMenuVariants(args: Pick<DropdownMenuArgs, "class"> = {}): string {
  return cn(dropdownMenuTw, args.class);
}

/** Der Trigger hat keine Basis-Klassen */
export function dropdownMenuTriggerVariants(args: Pick<DropdownMenuTriggerArgs, "class"> = {}): string {
  return cn(args.class);
}

export function dropdownMenuContentVariants(args: Pick<DropdownMenuContentArgs, "class"> = {}): string {
  return cn(dropdownMenuContentTw, args.class);
}

export function dropdownMenuItemVariants(
  args: Pick<DropdownMenuItemArgs, "variant" | "class" | "inset" | "disabled"> = {}
): string {
  return cn(
    dropdownMenuItemTw,
    dropdownMenuItemVariantTw[args.variant ?? "default"],
    args.inset && dropdownMenuInsetTw,
    !args.disabled && dropdownMenuItemIconColorTw,
    args.class
  );
}

export function dropdownMenuLabelVariants(args: Pick<DropdownMenuLabelArgs, "class" | "inset"> = {}): string {
  return cn(dropdownMenuLabelTw, args.inset && dropdownMenuInsetTw, args.class);
}

export function dropdownMenuSeparatorVariants(args: Pick<DropdownMenuSeparatorArgs, "class"> = {}): string {
  return cn(dropdownMenuSeparatorTw, args.class);
}

export function dropdownMenuShortcutVariants(args: Pick<DropdownMenuShortcutArgs, "class"> = {}): string {
  return cn(dropdownMenuShortcutTw, args.class);
}

/** Die Gruppe hat keine Basis-Klassen */
export function dropdownMenuGroupVariants(args: Pick<DropdownMenuGroupArgs, "class"> = {}): string {
  return cn(args.class);
}

/* Render-Helfer */

/** class-Attribut nur, wenn die Klasse nicht leer ist */
const classAttr = (value: string | undefined): string => (value ? ` class="${escapeHtml(value)}"` : "");

const ariaDisabledAttr = (disabled: boolean | undefined): string => (disabled ? ` aria-disabled="true"` : "");

/** data-inset, data-variant und data-disabled (boolesche Attribute bzw. Variante nur, wenn gesetzt) */
const itemDataAttributes = (args: { inset?: boolean; variant?: string; disabled?: boolean }): string =>
  renderAttributes({
    "data-inset": args.inset || undefined,
    "data-variant": args.variant || undefined,
    "data-disabled": args.disabled || undefined,
  });

/** Zufällige Dropdown-ID, z. B. "dropdown_1a2b3c4d" */
function generateDropdownId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return `dropdown_${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
}

/* Komponenten */

/** Dropdown-Wrapper mit Datastar-State-Management */
export function DropdownMenu(args: DropdownMenuArgs = {}): string {
  const dropdownId = args.id || generateDropdownId();
  const signals = dropdownSignals(dropdownId, Boolean(args.defaultOpen || args.open));

  return `<div data-slot="dropdown-menu" data-signals="${escapeHtml(signals.dataSignals)}" data-on:click__outside="${escapeHtml(buildClickOutsideHandler(dropdownId))}" class="${escapeHtml(dropdownMenuVariants(args))}"${renderAttributes(args.attributes)}>${renderChildren(args.children)}</div>`;
}

/** Trigger, der das Dropdown öffnet bzw. schließt */
export function DropdownMenuTrigger(args: DropdownMenuTriggerArgs): string {
  const toggleExpr = escapeHtml(buildTriggerClickExpr(args.id));
  const className = classAttr(dropdownMenuTriggerVariants(args));

  if (args.asChild) {
    return `<span data-slot="dropdown-menu-trigger"${className} data-on:click="${toggleExpr}"${ariaDisabledAttr(args.disabled)}${renderAttributes(args.attributes)}>${renderChildren(args.children)}</span>`;
  }

  return `<button data-slot="dropdown-menu-trigger" type="button"${className} data-on:click="${toggleExpr}"${args.disabled ? " disabled" : ""}${renderAttributes(args.attributes)}>${renderChildren(args.children)}</button>`;
}

/** Content-Panel; fixed positioniert anhand der Trigger-Position */
export function DropdownMenuContent(args: DropdownMenuContentArgs): string {
  const signals = dropdownSignals(args.id);
  const sideAttr = args.side ? ` data-side="${escapeHtml(args.side)}"` : "";
  const alignAttr = args.align ? ` data-align="${escapeHtml(args.align)}"` : "";

  return `<div id="${escapeHtml(dropdownMenuContentId(args.id))}" data-slot="dropdown-menu-content"${sideAttr}${alignAttr} class="${escapeHtml(cn(dropdownMenuContentVariants(args), "fixed"))}" data-show="${escapeHtml(signals.signal("open"))}" data-on:keydown__window="${escapeHtml(buildEscapeHandler(args.id))}" role="menu" style="${escapeHtml(buildContentPositionStyle(args.side, args.align, args.sideOffset))}"${renderAttributes(args.attributes)}>${renderChildren(args.children)}</div>`;
}

/** Klickbares Menü-Item */
export function DropdownMenuItem(args: DropdownMenuItemArgs): string {
  const className = escapeHtml(dropdownMenuItemVariants(args));
  const tail = `${ariaDisabledAttr(args.disabled)}${itemDataAttributes(args)}${renderAttributes(args.attributes)}`;

  // asChild: Wrapper ohne Klick-Handler und tabindex
  if (args.asChild) {
    return `<div data-slot="dropdown-menu-item" class="${className}" role="menuitem"${tail}>${renderChildren(args.children)}</div>`;
  }

  const clickExpr = escapeHtml(buildItemClickExpr(args.id, args.onClick));

  return `<div data-slot="dropdown-menu-item" class="${className}" role="menuitem" tabindex="0" data-on:click="${clickExpr}"${tail}>${renderChildren(args.children)}</div>`;
}

/** Menü-Item als Link (anchor) */
export function DropdownMenuLinkItem(args: DropdownMenuLinkItemArgs): string {
  const href = ` href="${escapeHtml(safeUrl(args.href ?? ""))}"`;
  const target = args.target ? ` target="${escapeHtml(args.target)}"` : "";
  const rel = args.rel ? ` rel="${escapeHtml(args.rel)}"` : "";

  // Deaktiviert: kein Klick-Handler, dafür aria-disabled und tabindex="-1"
  const state = args.disabled
    ? ` aria-disabled="true" tabindex="-1"`
    : ` data-on:click="${escapeHtml(buildItemClickExpr(args.id, args.onClick))}"`;

  return `<a data-slot="dropdown-menu-item"${href} class="${escapeHtml(dropdownMenuItemVariants(args))}" role="menuitem"${target}${rel}${state}${itemDataAttributes(args)}${renderAttributes(args.attributes)}>${renderChildren(args.children)}</a>`;
}

/** Formular mit Submit-Button als Menü-Item */
export function DropdownMenuFormItem(args: DropdownMenuFormItemArgs): string {
  const action = escapeHtml(safeUrl(args.action ?? ""));
  const method = escapeHtml(args.method || "post");
  const buttonClass = escapeHtml(dropdownMenuItemVariants({ ...args, class: "w-full" }));

  return `<form data-slot="dropdown-menu-form-item" action="${action}" method="${method}"${classAttr(args.class)}${renderAttributes(args.attributes)}><button type="submit" class="${buttonClass}"${args.disabled ? " disabled" : ""} role="menuitem"${itemDataAttributes(args)}${renderAttributes(args.buttonAttributes)}>${renderChildren(args.children)}</button></form>`;
}

/** Container mit beliebigem Inhalt als Menü-Item */
export function DropdownMenuCustomItem(args: DropdownMenuCustomItemArgs): string {
  const clickAttr =
    args.closeOnClick && !args.disabled ? ` data-on:click="${escapeHtml(buildItemClickExpr(args.id))}"` : "";

  return `<div data-slot="dropdown-menu-item" class="${escapeHtml(dropdownMenuItemVariants(args))}" role="menuitem"${clickAttr}${ariaDisabledAttr(args.disabled)}${itemDataAttributes(args)}${renderAttributes(args.attributes)}>${renderChildren(args.children)}</div>`;
}

/** Nicht interaktives Label */
export function DropdownMenuLabel(args: DropdownMenuLabelArgs = {}): string {
  const inset = args.inset ? " data-inset" : "";

  return `<div data-slot="dropdown-menu-label" class="${escapeHtml(dropdownMenuLabelVariants(args))}" role="presentation"${inset}${renderAttributes(args.attributes)}>${renderChildren(args.children)}</div>`;
}

/** Trennlinie */
export function DropdownMenuSeparator(args: DropdownMenuSeparatorArgs = {}): string {
  return `<div data-slot="dropdown-menu-separator" class="${escapeHtml(dropdownMenuSeparatorVariants(args))}" role="separator"${renderAttributes(args.attributes)}></div>`;
}

/** Tastenkürzel-Text */
export function DropdownMenuShortcut(args: DropdownMenuShortcutArgs = {}): string {
  return `<span data-slot="dropdown-menu-shortcut" class="${escapeHtml(dropdownMenuShortcutVariants(args))}"${renderAttributes(args.attributes)}>${renderChildren(args.children)}</span>`;
}

/** Logische Gruppierung von Menü-Items */
export function DropdownMenuGroup(args: DropdownMenuGroupArgs = {}): string {
  return `<div data-slot="dropdown-menu-group"${classAttr(dropdownMenuGroupVariants(args))} role="group"${renderAttributes(args.attributes)}>${renderChildren(args.children)}</div>`;
}
