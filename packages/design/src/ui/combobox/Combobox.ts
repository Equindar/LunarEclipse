import { buildAnchorStyle, buildPositionAnchorStyle } from "../../utils/AnchorStyle";
import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { getAnchorPosition } from "../../utils/getAnchorPosition";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import { Button } from "../button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../inputgroup";
import {
    buildChipRemoveHandler,
    buildChipsClickHandler,
    buildChipsValueEffect,
    buildClearHandler,
    buildClickOutsideHandler,
    buildComboboxInputAttributes,
    buildComboboxItemAttributes,
    buildComboboxTriggerAttributes,
    buildContentFocusEffect,
    buildHasValueExpression,
    comboboxChipPlaceholder as chipPlaceholder,
    comboboxSignals,
    DEFAULT_SIDE_OFFSET,
    renderComboboxIcon,
} from "./Combobox.expressions";
import type {
    ComboboxArgs,
    ComboboxChipArgs,
    ComboboxChipsArgs,
    ComboboxChipsInputArgs,
    ComboboxClearArgs,
    ComboboxCollectionArgs,
    ComboboxContentArgs,
    ComboboxEmptyArgs,
    ComboboxGroupArgs,
    ComboboxInputArgs,
    ComboboxItemArgs,
    ComboboxLabelArgs,
    ComboboxListArgs,
    ComboboxSeparatorArgs,
    ComboboxTriggerArgs,
    ComboboxValueArgs,
} from "./Combobox.types";

/**
 * Combobox (shadcn/ui, Base). Port nach Datastar.
 * Die Quelle verwendet Platzhalter-Klassen (cn-combobox*), die konkreten Klassen stammen aus dem Style "vega".
 */

/* ------------------------------------------------------------------------------------------------
 * Tailwind-Klassen
 * ---------------------------------------------------------------------------------------------- */

/** Popup (cn-combobox-content, cn-combobox-content-logical plus Utilities der Quelle) */
export const comboboxContentTw = tw`bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:border-input/30 overflow-hidden rounded-md shadow-md ring-1 duration-100 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:shadow-none data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+(--spacing(7)))] origin-(--transform-origin) data-[chips=true]:min-w-(--anchor-width)`;

export const comboboxListTw = tw`no-scrollbar max-h-[min(calc(--spacing(72)-(--spacing(9))),calc(var(--available-height)-(--spacing(9))))] scroll-py-1 overflow-y-auto p-1 data-empty:p-0 overscroll-contain`;

/** Item (cn-combobox-item plus Utilities der Quelle). `group/combobox-item` steuert den Auswahl-Indikator. */
export const comboboxItemTw = tw`data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm [&_svg:not([class*='size-'])]:size-4 group/combobox-item relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0`;

/** Auswahl-Indikator: nur sichtbar, wenn das Item `data-selected` trägt (Base UI rendert ihn sonst nicht) */
export const comboboxItemIndicatorTw = tw`pointer-events-none absolute right-2 size-4 items-center justify-center hidden group-data-selected/combobox-item:flex`;

export const comboboxLabelTw = tw`text-muted-foreground px-2 py-1.5 text-xs`;
export const comboboxEmptyTw = tw`text-muted-foreground hidden w-full justify-center py-2 text-center text-sm group-data-empty/combobox-content:flex`;
export const comboboxSeparatorTw = tw`bg-border -mx-1 my-1 h-px`;
export const comboboxTriggerTw = tw`[&_svg:not([class*='size-'])]:size-4`;
export const comboboxTriggerIconTw = tw`text-muted-foreground size-4 pointer-events-none`;

/**
 * Trigger-Button in der Input-Group. Abweichung von der Quelle: `group-has-data-[clear-active]` statt
 * `group-has-data-[slot=combobox-clear]`, weil der Clear-Button im Port immer im DOM liegt.
 */
export const comboboxInputTriggerTw = tw`group-has-data-clear-active/input-group:hidden data-pressed:bg-transparent`;

export const comboboxChipsTw = tw`dark:bg-input/30 border-input focus-within:border-ring focus-within:ring-ring/50 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive dark:has-aria-invalid:border-destructive/50 flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border bg-transparent bg-clip-padding px-2.5 py-1.5 text-sm shadow-xs transition-[color,box-shadow] focus-within:ring-3 has-aria-invalid:ring-3 has-data-[slot=combobox-chip]:px-1.5`;
export const comboboxChipTw = tw`bg-muted text-foreground flex h-[calc(--spacing(5.5))] w-fit items-center justify-center gap-1 rounded-sm px-1.5 text-xs font-medium whitespace-nowrap has-data-[slot=combobox-chip-remove]:pr-0 has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50`;
export const comboboxChipRemoveTw = tw`-ml-1 opacity-50 hover:opacity-100`;
export const comboboxChipsInputTw = tw`min-w-16 flex-1 outline-none`;

/* ------------------------------------------------------------------------------------------------
 * Hilfen für Aufrufer
 * ---------------------------------------------------------------------------------------------- */

/** Platzhalter für Chip-Vorlagen: `ComboboxChip({ id, value: comboboxChipPlaceholder.value, children: comboboxChipPlaceholder.label })` */
export const comboboxChipPlaceholder = chipPlaceholder;

/**
 * Attribute für ein eigenes Trigger-Element (Ersatz für `render={<Button />}` der Quelle),
 * z. B. `Button({ attributes: comboboxTriggerAttributes(id, true) })`. Mit `anchor` dient das Element als Popup-Anchor.
 */
export function comboboxTriggerAttributes(id: string, anchor = false): HtmlAttributes {
  return buildComboboxTriggerAttributes(id, anchor);
}

/** Chevron-Icon des Triggers (für eigene Trigger-Elemente) */
export function comboboxTriggerIcon(): string {
  return renderComboboxIcon("chevronDown", comboboxTriggerIconTw);
}

/* ------------------------------------------------------------------------------------------------
 * Komponenten
 * ---------------------------------------------------------------------------------------------- */

/**
 * Root. Base UI rendert hier kein Element, im Port ist es ein `display: contents`-Wrapper, der die Signale
 * hält und beim Klick außerhalb schließt. `multiple` und `autoHighlight` stehen als Attribute am Root,
 * die Handler lesen sie zur Laufzeit.
 */
export function Combobox(args: ComboboxArgs): string {
  const signals = comboboxSignals(args.id, {
    value: args.value ?? "",
    label: args.label ?? args.value ?? "",
    values: args.values ?? [],
  });

  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "combobox",
    "data-combobox-id": args.id,
    "data-signals": signals.dataSignals,
    "data-on:click__outside": buildClickOutsideHandler(args.id),
    class: cn("contents", args.class),
  };

  if (args.multiple) attrs["data-multiple"] = true;
  if (args.autoHighlight) attrs["data-auto-highlight"] = true;

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Anzeige des ausgewählten Werts: Text (Einfachauswahl) oder Chips (mit `chip`-Vorlage, Mehrfachauswahl) */
export function ComboboxValue(args: ComboboxValueArgs): string {
  const s = comboboxSignals(args.id);

  if (args.chip !== undefined) {
    const attrs: HtmlAttributes = {
      ...args.attributes,
      "data-slot": "combobox-value",
      "data-chip-template": args.chip,
      "data-effect": buildChipsValueEffect(args.id),
      class: cn("contents", args.class),
    };
    return `<div${renderAttributes(attrs)}></div>`;
  }

  const placeholder = args.placeholder ?? "";

  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "combobox-value",
    "data-text": `${s.signal("label")} || ${JSON.stringify(placeholder)}`,
  };
  if (args.class) attrs.class = args.class;

  return `<span${renderAttributes(attrs)}>${escapeHtml(placeholder)}</span>`;
}

/** Trigger-Button (unstyled, mit Chevron). Für gestylte Trigger siehe `comboboxTriggerAttributes`. */
export function ComboboxTrigger(args: ComboboxTriggerArgs): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildComboboxTriggerAttributes(args.id, args.anchor ?? true),
    type: "button",
    "data-slot": "combobox-trigger",
    class: cn(comboboxTriggerTw, args.class),
  };
  if (args.disabled) attrs.disabled = true;

  return `<button${renderAttributes(attrs)}>${renderChildren(args.children)}${comboboxTriggerIcon()}</button>`;
}

/**
 * Clear-Button. Im DOM immer vorhanden, aber nur sichtbar, solange etwas ausgewählt ist
 * (Base UI rendert ihn sonst gar nicht). `data-clear-active` blendet den Trigger in der Input-Group aus.
 */
export function ComboboxClear(args: ComboboxClearArgs): string {
  const hasValue = buildHasValueExpression(args.id);

  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "combobox-clear",
    "data-show": hasValue,
    "data-attr:data-clear-active": hasValue,
    "data-on:click": buildClearHandler(args.id),
    style: "display: none;",
  };
  if (args.disabled) attrs.disabled = true;

  return InputGroupButton({
    variant: "ghost",
    size: "icon-xs",
    class: cn(args.class),
    attributes: attrs,
    children: renderComboboxIcon("x", "pointer-events-none"),
  });
}

/**
 * Eingabefeld in einer Input-Group, mit Trigger (Chevron) und optionalem Clear-Button.
 * `children` landen am Ende der Input-Group (z. B. ein InputGroupAddon).
 */
export function ComboboxInput(args: ComboboxInputArgs): string {
  const showTrigger = args.showTrigger ?? true;
  const disabled = args.disabled ?? false;
  const s = comboboxSignals(args.id);

  const inputAttrs: HtmlAttributes = {
    ...args.attributes,
    ...buildComboboxInputAttributes(args.id, {
      placeholder: args.placeholder,
      disabled,
      invalid: args.invalid,
    }),
  };

  const groupAttrs: HtmlAttributes = {};
  if (args.anchor ?? true) groupAttrs.style = buildAnchorStyle(args.id);
  if (disabled) groupAttrs["data-disabled"] = "true";

  const triggerAttrs: HtmlAttributes = {
    ...buildComboboxTriggerAttributes(args.id),
    "data-slot": "input-group-button",
    tabindex: -1,
  };
  if (disabled) triggerAttrs.disabled = true;

  const trigger = showTrigger
    ? InputGroupButton({
        size: "icon-xs",
        variant: "ghost",
        class: comboboxInputTriggerTw,
        attributes: triggerAttrs,
        children: renderComboboxIcon("chevronDown", comboboxTriggerIconTw),
      })
    : "";

  const clear = args.showClear ? ComboboxClear({ id: args.id, disabled }) : "";

  const group = InputGroup({
    class: cn("w-auto", args.class),
    attributes: groupAttrs,
    children: [
      InputGroupInput({ attributes: inputAttrs }),
      InputGroupAddon({ align: "inline-end", children: [trigger, clear] }),
      renderChildren(args.children),
    ],
  });

  // Verstecktes Feld für Formulare (nur Einfachauswahl)
  const hidden = args.name
    ? `<input${renderAttributes({ type: "hidden", name: args.name, "data-attr:value": s.signal("value") })}>`
    : "";

  return group + hidden;
}

/**
 * Popup. Ersatz für Portal, Positioner und Popup von Base UI: absolut positioniert per CSS Anchor Positioning,
 * geöffnet über das Signal `open`. Die Variablen `--anchor-width`, `--available-height`, `--available-width`
 * und `--transform-origin` setzt hier statt Base UI der Inline-Style.
 */
export function ComboboxContent(args: ComboboxContentArgs): string {
  const s = comboboxSignals(args.id);
  const side = args.side ?? "bottom";
  const align = args.align ?? "start";
  const sideOffset = args.sideOffset ?? DEFAULT_SIDE_OFFSET;

  const origins = { top: "bottom", bottom: "top", left: "right", right: "left" } as const;

  const style = [
    "position: absolute",
    buildPositionAnchorStyle(args.id),
    "z-index: 50",
    "--anchor-width: anchor-size(width)",
    "--available-height: 100vh",
    "--available-width: 100vw",
    `--transform-origin: ${origins[side]}`,
    getAnchorPosition(side, align, sideOffset),
    "display: none",
  ].join("; ");

  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "combobox-content",
    "data-chips": args.chips ? "true" : "false",
    "data-side": side,
    "data-show": s.signal("open"),
    "data-attr:data-open": s.signal("open"),
    "data-effect": buildContentFocusEffect(args.id),
    class: cn(comboboxContentTw, "anchor-positioned", args.class),
    style: `${style};`,
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Liste der Items (scrollbar) */
export function ComboboxList(args: ComboboxListArgs): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    id: `${args.id}-list`,
    role: "listbox",
    "data-slot": "combobox-list",
    class: cn(comboboxListTw, args.class),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Einzelnes Item. `label` (Standard: `value`) dient dem Filter und dem Eingabetext nach der Auswahl. */
export function ComboboxItem(args: ComboboxItemArgs): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildComboboxItemAttributes(args.id, args.value, args.label ?? args.value, args.disabled),
    class: cn(comboboxItemTw, args.class),
  };

  const indicator = `<span class="${comboboxItemIndicatorTw}">${renderComboboxIcon("check", "pointer-events-none")}</span>`;

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}${indicator}</div>`;
}

/** Gruppe von Items (blendet sich beim Filtern aus, wenn kein Item mehr passt) */
export function ComboboxGroup(args: ComboboxGroupArgs = {}): string {
  const attrs: HtmlAttributes = { ...args.attributes, role: "group", "data-slot": "combobox-group" };
  if (args.class) attrs.class = args.class;

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Gruppenüberschrift */
export function ComboboxLabel(args: ComboboxLabelArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "combobox-label",
    class: cn(comboboxLabelTw, args.class),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Sammelelement für die Items einer Gruppe (Base UI rendert dafür kein Element, hier ein `display: contents`-Wrapper) */
export function ComboboxCollection(args: ComboboxCollectionArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "combobox-collection",
    class: cn("contents", args.class),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Hinweis "keine Treffer" (sichtbar, wenn das Popup `data-empty` trägt) */
export function ComboboxEmpty(args: ComboboxEmptyArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "combobox-empty",
    class: cn(comboboxEmptyTw, args.class),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Trennlinie zwischen Gruppen */
export function ComboboxSeparator(args: ComboboxSeparatorArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    role: "separator",
    "data-slot": "combobox-separator",
    class: cn(comboboxSeparatorTw, args.class),
  };

  return `<div${renderAttributes(attrs)}></div>`;
}

/** Chips-Gruppe (Mehrfachauswahl), dient als Anchor des Popups und fokussiert beim Klick das Input */
export function ComboboxChips(args: ComboboxChipsArgs): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "combobox-chips",
    "data-on:click": buildChipsClickHandler(args.id),
    style: buildAnchorStyle(args.id),
    class: cn(comboboxChipsTw, args.class),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Einzelner Chip mit Remove-Button. In einer Chip-Vorlage `comboboxChipPlaceholder` verwenden. */
export function ComboboxChip(args: ComboboxChipArgs): string {
  const showRemove = args.showRemove ?? true;

  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "combobox-chip",
    "data-value": args.value,
    class: cn(comboboxChipTw, args.class),
  };

  const remove = showRemove
    ? Button({
        variant: "ghost",
        class: comboboxChipRemoveTw,
        attributes: {
          "data-slot": "combobox-chip-remove",
          "aria-label": "Entfernen",
          "data-on:click": buildChipRemoveHandler(args.id),
        },
        children: renderComboboxIcon("x", "pointer-events-none"),
      })
    : "";

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}${remove}</div>`;
}

/** Eingabefeld innerhalb der Chips-Gruppe */
export function ComboboxChipsInput(args: ComboboxChipsInputArgs): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildComboboxInputAttributes(args.id, {
      placeholder: args.placeholder,
      disabled: args.disabled,
      invalid: args.invalid,
    }),
    "data-slot": "combobox-chip-input",
    class: cn(comboboxChipsInputTw, args.class),
  };

  return `<input${renderAttributes(attrs)}>`;
}
