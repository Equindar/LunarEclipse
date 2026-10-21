import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import {
    buildContentKeyboardHandler,
    buildItemClickHandler,
    buildItemKeyboardHandler,
    buildTriggerClickHandler,
    buildTriggerKeyboardHandler,
    highlightedItem,
    selectOnChangeEffect,
    selectSignals,
    selectValueEqualsExpression,
} from "./Select.expressions";
import type {
    SelectArgs,
    SelectContentArgs,
    SelectGroupArgs,
    SelectItemArgs,
    SelectLabelArgs,
    SelectOptionArgs,
    SelectSeparatorArgs,
    SelectTriggerArgs,
    SelectValueArgs,
} from "./Select.types";

/* Tailwind-Klassen */

export const selectTw =
  tw`relative bg-background text-foreground`;
export const selectTriggerTw =
  tw`flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1`;
export const selectContentTw =
  tw`z-50 min-w-32 overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`;
export const selectContentPopperTw =
  tw`data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1`;
export const selectItemTw =
  tw`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50`;
export const selectLabelTw =
  tw`px-2 py-1.5 text-sm font-semibold`;
export const selectSeparatorTw =
  tw`-mx-1 my-1 h-px bg-muted`;
export const selectViewportTw =
  tw`p-1`;

export const selectViewportPopperTw = tw`h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]`;

export function selectVariants(args: Pick<SelectArgs, "class"> = {}): string {
  return cn(selectTw, args.class);
}

export function selectTriggerVariants(args: Pick<SelectTriggerArgs, "class"> = {}): string {
  return cn(selectTriggerTw, args.class);
}

export function selectContentVariants(args: Pick<SelectContentArgs, "position" | "class"> = {}): string {
  return cn(selectContentTw, args.position === "popper" && selectContentPopperTw, args.class);
}

export function selectItemVariants(args: Pick<SelectItemArgs, "class"> = {}): string {
  return cn(selectItemTw, args.class);
}

export function selectLabelVariants(args: Pick<SelectLabelArgs, "class"> = {}): string {
  return cn(selectLabelTw, args.class);
}

export function selectSeparatorVariants(args: Pick<SelectSeparatorArgs, "class"> = {}): string {
  return cn(selectSeparatorTw, args.class);
}

export function selectViewportVariants(args: Pick<SelectContentArgs, "position" | "class"> = {}): string {
  return cn(selectViewportTw, args.position === "popper" && selectViewportPopperTw, args.class);
}

/* Icons */

const chevronDownIcon = `<svg class="h-4 w-4 opacity-50 shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>`;

const checkIcon = (showExpr: string): string =>
  `<svg class="h-4 w-4" data-show="${escapeHtml(showExpr)}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>`;

/** Zufällige Select-ID, z. B. "select_1a2b3c4d" */
function generateSelectId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return `select_${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
}

/* Komponenten */

/**
 * Select-Wrapper mit Datastar-State-Management.
 * Mit `options` wird die komplette UI automatisch gerendert, sonst gilt `children` (manuelle Komposition).
 */
export function Select(args: SelectArgs = {}): string {
  const selectId = args.id || generateSelectId();
  const openState = Boolean(args.defaultOpen || args.open);

  // Initialer Wert; das passende Label wird aus den Optionen gesucht (auch bei leerem Wert)
  const initialValue = args.value || args.defaultValue || "";
  const initialLabel = args.options?.find((option) => option.value === initialValue)?.label ?? "";

  const signals = selectSignals(selectId, {
    open: openState,
    value: initialValue,
    label: initialLabel,
    highlighted: -1,
    _lastValue: initialValue,
  });

  // Click-outside muss Klicks im Select-Root ignorieren; sonst schließt derselbe Klick, der den Trigger öffnet,
  // das Menü sofort wieder (Datastars click__outside kann nach dem Trigger-Handler laufen).
  const selectRootSelector = `[data-select-id=${JSON.stringify(selectId)}]`;
  const clickOutsideHandler = `${signals.signal("open")} && !evt.target.closest('${selectRootSelector}') ? ${signals.set("open", "false")} : null`;

  // data-effect beobachtet Wertänderungen
  const effectHandler = selectOnChangeEffect(selectId, args.onChange ?? "");
  const effectAttr = effectHandler ? ` data-effect="${escapeHtml(effectHandler)}"` : "";

  const hiddenInput = args.name
    ? `<input type="hidden" name="${escapeHtml(args.name)}" data-bind="${escapeHtml(signals.signal("value"))}"${args.required ? " required" : ""} />`
    : "";

  let body: string;

  if (args.options !== undefined) {
    // Komplette UI automatisch rendern
    const trigger = SelectTrigger({
      id: selectId,
      disabled: args.disabled || args.options.length === 0,
      children: SelectValue({ id: selectId, placeholder: args.placeholder }),
    });

    const content =
      args.options.length > 0
        ? SelectContent({ id: selectId, children: renderSelectOptions(selectId, args.options) })
        : "";

    body = trigger + content;
  } else {
    // Manuelle Komposition
    body = renderChildren(args.children);
  }

  return `<div data-slot="select" data-select-id="${escapeHtml(selectId)}" data-signals="${escapeHtml(signals.dataSignals)}"${effectAttr} data-on:click__outside="${escapeHtml(clickOutsideHandler)}" class="${escapeHtml(selectVariants(args))}"${renderAttributes(args.attributes)}>${hiddenInput}${body}</div>`;
}

/** Rendert Optionen mit Gruppierung; der globale Index dient der Tastaturnavigation */
export function renderSelectOptions(selectId: string, options: SelectOptionArgs[]): string {
  const ungrouped: SelectOptionArgs[] = [];
  const grouped = new Map<string, SelectOptionArgs[]>();

  for (const option of options) {
    if (option.group) {
      grouped.set(option.group, [...(grouped.get(option.group) ?? []), option]);
    } else {
      ungrouped.push(option);
    }
  }

  let globalIndex = 0;
  const item = (option: SelectOptionArgs): string =>
    SelectItem({
      id: selectId,
      value: option.value,
      index: globalIndex++,
      disabled: option.disabled,
      children: escapeHtml(option.label),
    });

  // Zuerst Optionen ohne Gruppe, danach die Gruppen (in der Reihenfolge ihres ersten Auftretens)
  const parts: string[] = ungrouped.map(item);

  for (const [groupName, groupOptions] of grouped) {
    parts.push(
      SelectSeparator(),
      SelectGroup({
        children: [SelectLabel({ children: escapeHtml(groupName) }), ...groupOptions.map(item)],
      })
    );
  }

  return parts.join("");
}

/** Button, der das Select öffnet bzw. schließt */
export function SelectTrigger(args: SelectTriggerArgs): string {
  const signals = selectSignals(args.id);
  const disabled = args.disabled ? " disabled" : "";

  return `<button data-slot="select-trigger" type="button" role="combobox" data-attr:aria-expanded="${escapeHtml(signals.signal("open"))}" class="${escapeHtml(selectTriggerVariants(args))}"${disabled} data-on:click="${escapeHtml(buildTriggerClickHandler(args.id))}" data-on:keydown="${escapeHtml(buildTriggerKeyboardHandler(args.id))}"${renderAttributes(args.attributes)}>${renderChildren(args.children)}${chevronDownIcon}</button>`;
}

/** Zeigt das ausgewählte Label oder den Platzhalter */
export function SelectValue(args: SelectValueArgs): string {
  const placeholder = args.placeholder ?? "";
  const displayText = `${selectSignals(args.id).signal("label")} || '${placeholder.replaceAll("'", "\\'")}'`;

  return `<span data-slot="select-value" class="pointer-events-none truncate" data-text="${escapeHtml(displayText)}"${renderAttributes(args.attributes)}>${escapeHtml(placeholder)}</span>`;
}

/** Dropdown-Container */
export function SelectContent(args: SelectContentArgs): string {
  const signals = selectSignals(args.id);

  return `<div data-slot="select-content" class="${escapeHtml(selectContentVariants(args))}" data-show="${escapeHtml(signals.signal("open"))}" data-on:keydown__window="${escapeHtml(buildContentKeyboardHandler(args.id))}" role="listbox" tabindex="-1" style="position: absolute; top: 100%; left: 0; right: 0; z-index: 50; display: none;"${renderAttributes(args.attributes)}><div class="${escapeHtml(selectViewportVariants({ position: args.position }))}">${renderChildren(args.children)}</div></div>`;
}

/** Einzelne Option im Dropdown */
export function SelectItem(args: SelectItemArgs): string {
  const signals = selectSignals(args.id);
  const index = args.index ?? 0;

  const highlightedClass = highlightedItem(args.id, index);
  const selectedExpr = selectValueEqualsExpression(signals.signal("value"), args.value);

  const handlers = args.disabled
    ? ` data-disabled="true"`
    : ` data-on:click="${escapeHtml(buildItemClickHandler(args.id, args.value))}" data-on:keydown="${escapeHtml(buildItemKeyboardHandler())}"`;

  // data-disabled steht im Original nach den Handlern und vor den Nutzer-Attributen
  return `<div data-slot="select-item" data-select-item class="${escapeHtml(selectItemVariants(args))}" data-class="${escapeHtml(highlightedClass)}" role="option" data-value="${escapeHtml(args.value)}" data-index="${index}" tabindex="0"${handlers}${renderAttributes(args.attributes)}><span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">${checkIcon(selectedExpr)}</span><span class="select-item-text truncate">${renderChildren(args.children)}</span></div>`;
}

/** Label für eine Gruppe von Items */
export function SelectLabel(args: SelectLabelArgs = {}): string {
  return `<div data-slot="select-label" class="${escapeHtml(selectLabelVariants(args))}"${renderAttributes(args.attributes)}>${renderChildren(args.children)}</div>`;
}

/** Trennlinie zwischen Gruppen */
export function SelectSeparator(args: SelectSeparatorArgs = {}): string {
  return `<div data-slot="select-separator" class="${escapeHtml(selectSeparatorVariants(args))}"${renderAttributes(args.attributes)}></div>`;
}

/** Container für eine Gruppe von Items */
export function SelectGroup(args: SelectGroupArgs = {}): string {
  const className = args.class ? ` class="${escapeHtml(args.class)}"` : "";

  return `<div data-slot="select-group" role="group"${className}${renderAttributes(args.attributes)}>${renderChildren(args.children)}</div>`;
}
