import { buildAnchorStyle, buildPositionAnchorStyle } from "../../utils/AnchorStyle";
import { cn } from "../../utils/cn";
import { getAnchorPosition } from "../../utils/getAnchorPosition";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { renderIcon } from "../../utils/renderIcon";
import { tw } from "../../utils/tw";
import { withSlot } from "../../utils/withSlot";
import {
    buildClearHandlers,
    buildColumnHandlers,
    buildContentHandlers,
    buildInitHandler,
    buildInputGroupHandlers,
    buildInputHandlers,
    buildInputWidthStyle,
    buildSyncEffect,
    buildTriggerHandlers,
    normalizePlaceholder,
    normalizeStep,
    timePickerPartId,
    timePickerSegmentId,
    timePickerSignals,
    timePickerSlots,
} from "./TimePicker.expressions";
import type {
    TimePickerArgs,
    TimePickerClearArgs,
    TimePickerColumnArgs,
    TimePickerContentArgs,
    TimePickerInputArgs,
    TimePickerInputGroupArgs,
    TimePickerLabelArgs,
    TimePickerPeriodArgs,
    TimePickerRuntimeConfig,
    TimePickerSeparatorArgs,
    TimePickerTriggerArgs,
} from "./TimePicker.types";

const DEFAULT_SIDE_OFFSET = 6;

/** Inneres des Lucide-Icons "clock" (24x24). Bei Bedarf durch das Icon aus dem zentralen Icon-Ordner ersetzen */
const CLOCK_ICON_BODY = `<path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/>`;

/*
 * Tailwind-Klassen (Dice UI, Base-Variante). Die bedingten Klassen der Eingabegruppe (invalid, disabled) hängen
 * in der Vorlage am React-Context. Hier lesen sie die Data-Attribute des Roots (group/time-picker).
 */
const rootTw = tw`group/time-picker relative`;

const labelTw = tw`text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70`;

const inputGroupTw = tw`flex h-9 w-full cursor-text items-center gap-0.5 rounded-lg border border-input bg-background px-3 py-2 transition-shadow outline-none has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 group-data-invalid/time-picker:border-destructive group-data-invalid/time-picker:ring-destructive/20 group-data-disabled/time-picker:cursor-not-allowed group-data-disabled/time-picker:opacity-50`;

const inputTw = tw`inline-flex h-full items-center justify-center border-0 bg-transparent text-center text-sm tabular-nums transition-colors outline-none focus:bg-transparent disabled:cursor-not-allowed disabled:opacity-50`;

const triggerTw = tw`ml-auto flex items-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none [&>svg:not([class*='size-'])]:size-4`;

const contentTw = tw`z-50 flex w-auto max-w-(--anchor-width) origin-(--transform-origin) rounded-lg bg-popover p-0 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95`;

/** Basis der Spalten (TimePickerColumn) */
const columnTw = tw`flex flex-col gap-1 p-1 not-last:border-r`;

/** Hour, Minute und Second ergänzen die Basis um Scrollen */
const scrollColumnTw = tw`scrollbar-none flex max-h-50 flex-col gap-1 overflow-y-auto p-1`;

const periodColumnTw = tw`flex flex-col gap-1 p-1`;

/** Klassen der Spalten-Einträge. Die Runtime setzt sie beim Erzeugen der Buttons */
const columnItemTw = tw`w-full rounded-md px-3 py-1 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:border-ring focus:ring-[3px] focus:ring-ring/50 focus:outline-none data-selected:bg-primary data-selected:text-primary-foreground data-selected:hover:bg-primary data-selected:hover:text-primary-foreground`;

const separatorTw = tw``;

const clearTw = tw`inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50`;

/** Zufalls-ID: `time-picker_<8 hex>` */
function randomId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

  return `time-picker_${hex}`;
}

/** Inline-Style zusammensetzen: Standard zuerst, Nutzer-Style danach (überschreibt) */
function mergeStyle(base: string, user?: string | number | boolean): string {
  return [base, typeof user === "string" ? user : ""].filter(Boolean).join("; ");
}

/**
 * Root des Time-Pickers. Hält die Signale (`value`, `open`) und startet die Runtime per data-init.
 * Funktioniert nur mit geladenem Datastar. Label, Eingabegruppe und Inhalt kommen als children.
 */
export function TimePicker(args: TimePickerArgs = {}): string {
  const id = args.id ?? randomId();
  const showSeconds = args.showSeconds ?? false;
  const ph = normalizePlaceholder(args.segmentPlaceholder);

  const defaultValue = args.defaultValue ?? "";
  const signals = timePickerSignals(id, { value: defaultValue, open: args.defaultOpen ?? false });

  const config: TimePickerRuntimeConfig = {
    id,
    locale: args.locale ?? null,
    showSeconds,
    hourStep: normalizeStep(args.hourStep),
    minuteStep: normalizeStep(args.minuteStep),
    secondStep: normalizeStep(args.secondStep),
    ph,
    disabled: args.disabled ?? false,
    readOnly: args.readOnly ?? false,
    openOnFocus: args.openOnFocus ?? false,
    groupAction: args.inputGroupClickAction ?? "focus",
    itemClass: columnItemTw,
  };

  const attrs: HtmlAttributes = withSlot(args.attributes, timePickerSlots.root);
  attrs.id = id;
  attrs.class = cn(rootTw, args.class);
  attrs.style = mergeStyle(buildInputWidthStyle(ph), args.attributes?.style);
  if (args.disabled) attrs["data-disabled"] = true;
  if (args.invalid) attrs["data-invalid"] = true;
  if (args.readOnly) attrs["data-readonly"] = true;

  // data-signals steht vor den übrigen Datastar-Attributen
  attrs["data-signals"] = signals.dataSignals;
  attrs["data-init"] = buildInitHandler(id, config);
  attrs["data-effect"] = buildSyncEffect(id, args.onValueChange, args.onOpenChange);

  const hidden: HtmlAttributes = {
    type: "hidden",
    name: args.name,
    value: defaultValue,
    "data-attr:value": signals.signal("value"),
    disabled: args.disabled,
    readonly: args.readOnly,
    required: args.required,
  };

  const hiddenInput = args.name ? `<input${renderAttributes(hidden)}>` : "";

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}${hiddenInput}</div>`;
}

/** Label: verweist auf das Stunden-Segment (in der Vorlage zeigte `for` auf eine nicht vergebene ID) */
export function TimePickerLabel(args: TimePickerLabelArgs): string {
  const attrs: HtmlAttributes = withSlot(args.attributes, timePickerSlots.label);
  attrs.id = timePickerPartId(args.id, "label");
  attrs.for = timePickerSegmentId(args.id, "hour");
  attrs.class = cn(labelTw, args.class);

  return `<label${renderAttributes(attrs)}>${renderChildren(args.children)}</label>`;
}

/** Eingabegruppe: Anchor für den Inhalt, nimmt Segmente, Trenner und Trigger auf */
export function TimePickerInputGroup(args: TimePickerInputGroupArgs): string {
  const attrs: HtmlAttributes = withSlot(args.attributes, timePickerSlots.inputGroup);
  attrs.id = timePickerPartId(args.id, "input-group");
  attrs.role = "group";
  attrs["aria-labelledby"] = timePickerPartId(args.id, "label");
  attrs.class = cn(inputGroupTw, args.class);
  attrs.style = mergeStyle(buildAnchorStyle(args.id), args.attributes?.style);
  Object.assign(attrs, buildInputGroupHandlers(args.id));

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Segment-Eingabe (Stunde, Minute, Sekunde oder AM/PM) */
export function TimePickerInput(args: TimePickerInputArgs): string {
  const attrs: HtmlAttributes = withSlot(args.attributes, timePickerSlots.input);
  attrs.type = "text";
  attrs.id = timePickerSegmentId(args.id, args.segment);
  attrs["data-segment"] = args.segment;
  attrs.inputmode = args.segment === "period" ? "text" : "numeric";
  attrs.autocomplete = "off";
  attrs.autocorrect = "off";
  attrs.autocapitalize = "off";
  attrs.spellcheck = "false";
  attrs.translate = "no";
  attrs.class = cn(inputTw, args.class);

  // Die Period-Eingabe bleibt bis zur Runtime verborgen (12-/24-Stunden-Format ist serverseitig unbekannt)
  const width = `width: var(--time-picker-${args.segment}-input-width)`;
  const hiddenStyle = args.segment === "period" ? "display: none" : "";
  attrs.style = mergeStyle([width, hiddenStyle].filter(Boolean).join("; "), args.attributes?.style);

  if (args.disabled) attrs.disabled = true;
  if (args.readOnly) attrs.readonly = true;
  Object.assign(attrs, buildInputHandlers(args.id));

  return `<input${renderAttributes(attrs)}>`;
}

/** Trenner zwischen den Segmenten */
export function TimePickerSeparator(args: TimePickerSeparatorArgs = {}): string {
  const attrs: HtmlAttributes = withSlot(args.attributes, timePickerSlots.separator);
  attrs["aria-hidden"] = "true";
  if (args.class) attrs.class = cn(separatorTw, args.class);

  return `<span${renderAttributes(attrs)}>${args.children === undefined ? ":" : renderChildren(args.children)}</span>`;
}

/** Trigger: öffnet und schließt den Inhalt */
export function TimePickerTrigger(args: TimePickerTriggerArgs): string {
  const attrs: HtmlAttributes = withSlot(args.attributes, timePickerSlots.trigger);
  attrs.type = "button";
  attrs.id = timePickerPartId(args.id, "trigger");
  attrs.class = cn(triggerTw, args.class);
  attrs["aria-haspopup"] = "dialog";
  attrs["aria-controls"] = timePickerPartId(args.id, "content");
  if (args.disabled) attrs.disabled = true;
  Object.assign(attrs, buildTriggerHandlers(args.id));

  const children = args.children === undefined ? renderIcon(CLOCK_ICON_BODY) : renderChildren(args.children);

  return `<button${renderAttributes(attrs)}>${children}</button>`;
}

/**
 * Inhalt mit den Spalten (native Popover API mit manueller Steuerung, CSS Anchor Positioning an der Eingabegruppe).
 * Die Klasse `anchor-positioned` muss im CSS des Pakets existieren.
 */
export function TimePickerContent(args: TimePickerContentArgs): string {
  const side = args.side ?? "bottom";
  const align = args.align ?? "start";
  const sideOffset = args.sideOffset ?? DEFAULT_SIDE_OFFSET;

  const positioning = [
    "position: absolute",
    "margin: 0",
    "z-index: 50",
    buildPositionAnchorStyle(args.id),
    "--anchor-width: anchor-size(width)",
    getAnchorPosition(side, align, sideOffset),
  ].join("; ");

  const attrs: HtmlAttributes = withSlot(args.attributes, timePickerSlots.content);
  attrs.id = timePickerPartId(args.id, "content");
  attrs.popover = "manual";
  attrs.class = cn(contentTw, "anchor-positioned", args.class);
  attrs.style = mergeStyle(positioning, args.attributes?.style);
  attrs["data-side"] = side;
  attrs["data-align"] = align;
  Object.assign(attrs, buildContentHandlers(args.id));

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

type ColumnKind = "hour" | "minute" | "second";

const COLUMN_DEFAULT_FORMAT: Record<ColumnKind, "numeric" | "2-digit"> = {
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
};

/** Spalte ohne Einträge: die Runtime füllt sie anhand von Schrittweite und Format */
function renderColumn(kind: ColumnKind, args: TimePickerColumnArgs): string {
  const attrs: HtmlAttributes = withSlot(args.attributes, timePickerSlots[kind]);
  attrs.class = cn(columnTw, scrollColumnTw, args.class);
  attrs["data-format"] = args.format ?? COLUMN_DEFAULT_FORMAT[kind];
  Object.assign(attrs, buildColumnHandlers(args.id));

  return `<div${renderAttributes(attrs)}></div>`;
}

export const TimePickerHour = (args: TimePickerColumnArgs): string => renderColumn("hour", args);

export const TimePickerMinute = (args: TimePickerColumnArgs): string => renderColumn("minute", args);

export const TimePickerSecond = (args: TimePickerColumnArgs): string => renderColumn("second", args);

/** AM/PM-Spalte. Die Runtime entfernt sie im 24-Stunden-Format */
export function TimePickerPeriod(args: TimePickerPeriodArgs): string {
  const attrs: HtmlAttributes = withSlot(args.attributes, timePickerSlots.period);
  attrs.class = cn(columnTw, periodColumnTw, args.class);
  attrs.style = mergeStyle("display: none", args.attributes?.style);
  Object.assign(attrs, buildColumnHandlers(args.id));

  return `<div${renderAttributes(attrs)}></div>`;
}

/** Button zum Löschen des Werts */
export function TimePickerClear(args: TimePickerClearArgs): string {
  const attrs: HtmlAttributes = withSlot(args.attributes, timePickerSlots.clear);
  attrs.type = "button";
  attrs.class = cn(clearTw, args.class);
  if (args.disabled) attrs.disabled = true;
  Object.assign(attrs, buildClearHandlers(args.id));

  return `<button${renderAttributes(attrs)}>${args.children === undefined ? "Clear" : renderChildren(args.children)}</button>`;
}
