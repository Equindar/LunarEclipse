import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import {
    buildFromInputHandler,
    buildFromLayerExpression,
    buildRangeLabelExpression,
    buildRangeStyleExpression,
    buildSectionVisibleExpression,
    buildToInputHandler,
    clampRange,
    createLogCardId,
    DEFAULT_RANGE_LABEL,
    DEFAULT_TONE,
    formatRangeLabel,
    logCardAttributes,
    logCardSignals,
} from "./LogCard.expressions";
import type {
    LogCardArgs,
    LogCardRangeArgs,
    LogCardSectionArgs,
    LogEntryArgs,
    LogEntryTone,
} from "./LogCard.types";

/** Card-Klassen wie shadcn/ui Card (Base-Variante) */
const logCardTw = tw`bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm`;
const logCardHeaderTw = tw`grid auto-rows-min gap-1.5 px-6`;
const logCardTitleTw = tw`leading-none font-semibold`;
const logCardDescriptionTw = tw`text-muted-foreground text-sm`;
const logCardContentTw = tw`flex flex-col gap-5 px-6`;

/** Bereich mit Beschriftung, Anzeige und Slider */
const logCardRangeTw = tw`flex flex-col gap-2 px-6`;
const logCardRangeHeaderTw = tw`flex items-center justify-between text-sm`;

/**
 * Der Slider besteht aus zwei übereinanderliegenden nativen Range-Inputs.
 * Die Inputs selbst sind für die Maus durchlässig (pointer-events-none), nur die Regler (Thumbs) nehmen Klicks an.
 */
const logCardSliderTw = tw`relative h-5`;
const logCardTrackTw = tw`absolute inset-x-2 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted`;
const logCardFillTw = tw`absolute inset-y-0 rounded-full bg-primary`;
const logCardInputTw = tw`pointer-events-none absolute inset-0 m-0 h-5 w-full appearance-none bg-transparent outline-none disabled:opacity-50 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:shadow-sm [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-sm [&:focus-visible::-moz-range-thumb]:ring-[3px] [&:focus-visible::-moz-range-thumb]:ring-ring/50 [&:focus-visible::-webkit-slider-thumb]:ring-[3px] [&:focus-visible::-webkit-slider-thumb]:ring-ring/50`;

/** Section und Log-Zeilen */
const logCardSectionTw = tw`flex flex-col gap-1.5`;
const logCardSectionTitleTw = tw`text-muted-foreground text-xs font-medium tracking-wide uppercase`;
const logCardEntriesTw = tw`flex flex-col gap-1 font-mono text-sm`;
const logCardEntryTw = tw`flex gap-2`;
const logCardTimeTw = tw`text-muted-foreground shrink-0 tabular-nums`;

/** Farbe der Nachricht je Ton */
const logEntryToneTw: Record<LogEntryTone, string> = {
  default: tw`text-foreground`,
  muted: tw`text-muted-foreground`,
  success: tw`text-emerald-600 dark:text-emerald-400`,
  warning: tw`text-amber-600 dark:text-amber-400`,
  danger: tw`text-destructive`,
};

function renderEntry(entry: LogEntryArgs): string {
  const tone = entry.tone ?? DEFAULT_TONE;

  return `<li class="${escapeHtml(cn(logCardEntryTw, logEntryToneTw[tone]))}" data-slot="log-card-entry" data-tone="${escapeHtml(tone)}"><span class="${escapeHtml(logCardTimeTw)}">[${escapeHtml(entry.time)}]</span><span>${escapeHtml(entry.message)}</span></li>`;
}

/**
 * Eine Section: die Log-Zeilen einer Minute.
 * Ihre Sichtbarkeit hängt per data-show vom Bereich der Card ab.
 */
export function LogCardSection(args: LogCardSectionArgs): string {
  const visible = args.visible ?? true;
  const title = args.title ?? `Minute ${args.minute}`;

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...logCardAttributes("log-card-section"),
    "data-minute": args.minute,
    "data-show": buildSectionVisibleExpression(args.id, args.minute),
    class: cn(logCardSectionTw, args.class),
  };
  // Vor dem Laden von Datastar nicht flackern: außerhalb des Startbereichs von Anfang an ausblenden
  if (!visible) attrs.style = "display: none;";

  const entries = (args.entries ?? []).map(renderEntry).join("");

  return `<section${renderAttributes(attrs)}><h3 class="${escapeHtml(logCardSectionTitleTw)}">${escapeHtml(title)}</h3><ul class="${escapeHtml(logCardEntriesTw)}">${entries}</ul></section>`;
}

/**
 * RangeSlider mit zwei Reglern (untere und obere Minute) und einer Anzeige des gewählten Bereichs.
 * Funktioniert nur mit geladenem Datastar, sonst bleiben alle Sections sichtbar.
 */
export function LogCardRange(args: LogCardRangeArgs): string {
  const { from, to } = clampRange(args.min, args.max, args.from, args.to);
  const disabled = args.min === args.max;
  const span = Math.max(args.max - args.min, 1);
  const label = args.label ?? DEFAULT_RANGE_LABEL;

  const fromHandler = buildFromInputHandler(args.id);
  const toHandler = buildToInputHandler(args.id);

  // Startwerte für die Darstellung ohne Datastar (identisch zu den Expressions)
  const fillStyle = `left: ${((from - args.min) / span) * 100}%; right: ${((args.max - to) / span) * 100}%`;
  const fromLayer = from >= (args.min + args.max) / 2 ? "z-index: 30" : "z-index: 10";

  const inputBase: HtmlAttributes = {
    type: "range",
    min: args.min,
    max: args.max,
    step: 1,
    disabled,
    class: logCardInputTw,
  };

  const fromAttrs: HtmlAttributes = {
    ...inputBase,
    value: from,
    style: fromLayer,
    "aria-label": "Von Minute",
    "data-slot": "log-card-range-from",
    "data-on:input": fromHandler,
    "data-attr:style": buildFromLayerExpression(args.id, args.min, args.max),
  };

  const toAttrs: HtmlAttributes = {
    ...inputBase,
    class: cn(logCardInputTw, "z-20"),
    value: to,
    "aria-label": "Bis Minute",
    "data-slot": "log-card-range-to",
    "data-on:input": toHandler,
  };

  const rootAttrs: HtmlAttributes = {
    ...args.attributes,
    ...logCardAttributes("log-card-range"),
    class: cn(logCardRangeTw, args.class),
  };

  const valueAttrs: HtmlAttributes = {
    "data-slot": "log-card-range-value",
    class: "font-medium tabular-nums",
    "aria-live": "polite",
    "data-text": buildRangeLabelExpression(args.id),
  };

  const fillAttrs: HtmlAttributes = {
    class: logCardFillTw,
    style: fillStyle,
    "data-attr:style": buildRangeStyleExpression(args.id, args.min, args.max),
  };

  return `<div${renderAttributes(rootAttrs)}><div class="${escapeHtml(logCardRangeHeaderTw)}"><span class="text-muted-foreground">${escapeHtml(label)}</span><span${renderAttributes(valueAttrs)}>${escapeHtml(formatRangeLabel(from, to))}</span></div><div class="${escapeHtml(logCardSliderTw)}"><div class="${escapeHtml(logCardTrackTw)}"><div${renderAttributes(fillAttrs)}></div></div><input${renderAttributes(fromAttrs)}><input${renderAttributes(toAttrs)}></div></div>`;
}

/**
 * Card, deren Content aus Sections mit Log-Zeilen besteht ("[mm:ss] Nachricht").
 * Ein RangeSlider über dem Content wählt den Minutenbereich, nur dessen Sections werden angezeigt.
 * Slider und Sections sind über das Signal-Objekt $<id> = { from, to } verbunden.
 */
export function LogCard(args: LogCardArgs = {}): string {
  const id = args.id ?? createLogCardId();
  const sections = args.sections ?? [];

  const minutes = sections.map((section) => section.minute);
  const hasSections = minutes.length > 0;
  const min = hasSections ? Math.min(...minutes) : 0;
  const max = hasSections ? Math.max(...minutes) : 0;

  const { from, to } = clampRange(min, max, args.from, args.to);
  const signals = logCardSignals(id, from, to);

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...logCardAttributes("log-card"),
    id,
    "data-signals": signals.dataSignals,
    class: cn(logCardTw, args.class),
  };

  const hasHeader = Boolean(args.title || args.description);
  const header = hasHeader
    ? `<div class="${escapeHtml(logCardHeaderTw)}" data-slot="log-card-header">${
        args.title ? `<div class="${escapeHtml(logCardTitleTw)}" data-slot="log-card-title">${escapeHtml(args.title)}</div>` : ""
      }${
        args.description
          ? `<div class="${escapeHtml(logCardDescriptionTw)}" data-slot="log-card-description">${escapeHtml(args.description)}</div>`
          : ""
      }</div>`
    : "";

  const range = hasSections ? LogCardRange({ id, min, max, from, to, label: args.rangeLabel }) : "";

  const content = sections
    .map((section) => LogCardSection({ ...section, id, visible: from <= section.minute && section.minute <= to }))
    .join("");

  return `<div${renderAttributes(attrs)}>${header}${range}<div class="${escapeHtml(logCardContentTw)}" data-slot="log-card-content">${content}</div></div>`;
}
