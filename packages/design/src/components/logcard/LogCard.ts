import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import {
    buildFromInputHandler,
    buildFromLayerExpression,
    buildModeExpression,
    buildPressedExpression,
    buildRangeLabelExpression,
    buildRangeStyleExpression,
    buildSetClockHandler,
    buildToInputHandler,
    buildVisibleExpression,
    ceilToStep,
    clampRange,
    createLogCardId,
    DEFAULT_RANGE_LABEL,
    DEFAULT_TIME_MODE,
    DEFAULT_TONE,
    formatClock,
    formatDuration,
    formatRangeLabel,
    isInRange,
    logCardAttributes,
    logCardSignals,
    parseDelta,
    parseStartedAt,
    resolveStep,
} from "./LogCard.expressions";
import type {
    LogCardArgs,
    LogCardRangeArgs,
    LogCardSectionArgs,
    LogCardTimeToggleArgs,
    LogEntryArgs,
    LogEntryTone,
    LogTimeMode,
} from "./LogCard.types";

/** Card-Klassen wie shadcn/ui Card (Base-Variante); group/log-card steuert die Zeitanzeige per data-mode */
const logCardTw = tw`group/log-card bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm`;
const logCardHeaderTw = tw`flex items-start justify-between gap-4 px-6`;
const logCardHeaderTextTw = tw`grid auto-rows-min gap-1.5`;
const logCardTitleTw = tw`leading-none font-semibold`;
const logCardDescriptionTw = tw`text-muted-foreground text-sm`;
const logCardContentTw = tw`flex flex-col gap-5 px-6`;

/** Umschalter Dauer / Uhrzeit: aktiv ist der Button, der zum data-mode der Card passt */
const logCardToggleTw = tw`ml-auto inline-flex shrink-0 items-center rounded-md border p-0.5 text-xs`;
const logCardToggleButtonTw = tw`text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 rounded-sm px-2 py-1 font-medium transition-colors outline-none focus-visible:ring-[3px]`;
const logCardToggleDurationTw = tw`group-data-[mode=duration]/log-card:bg-accent group-data-[mode=duration]/log-card:text-accent-foreground`;
const logCardToggleClockTw = tw`group-data-[mode=clock]/log-card:bg-accent group-data-[mode=clock]/log-card:text-accent-foreground`;

/** Bereich mit Beschriftung, Anzeige und Slider */
const logCardRangeTw = tw`flex flex-col gap-2 px-6`;
const logCardRangeHeaderTw = tw`flex items-center justify-between gap-2 text-sm`;

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
/** Dauer ist sichtbar, solange die Card nicht im Modus "clock" ist; die Uhrzeit umgekehrt */
const logCardTimeDurationTw = tw`group-data-[mode=clock]/log-card:hidden`;
const logCardTimeClockTw = tw`hidden group-data-[mode=clock]/log-card:inline`;

/** Farbe der Nachricht je Ton */
const logEntryToneTw: Record<LogEntryTone, string> = {
  default: tw`text-foreground`,
  muted: tw`text-muted-foreground`,
  success: tw`text-emerald-600 dark:text-emerald-400`,
  warning: tw`text-amber-600 dark:text-amber-400`,
  danger: tw`text-destructive`,
};

interface EntryContext {
  id: string;
  startMs?: number;
  /** Initialer Bereich: außerhalb wird die Zeile von Anfang an ausgeblendet */
  from?: number;
  to?: number;
}

function renderEntry(entry: LogEntryArgs, ctx: EntryContext): string {
  const tone = entry.tone ?? DEFAULT_TONE;
  const seconds = parseDelta(entry.time);

  const attrs: HtmlAttributes = {
    ...logCardAttributes("log-card-entry"),
    "data-tone": tone,
    "data-show": buildVisibleExpression(ctx.id, seconds, seconds),
    class: cn(logCardEntryTw, logEntryToneTw[tone]),
  };
  if (ctx.from !== undefined && ctx.to !== undefined && !isInRange(ctx.from, ctx.to, seconds, seconds)) {
    attrs.style = "display: none;";
  }

  const duration = `<span class="${escapeHtml(logCardTimeDurationTw)}">[${escapeHtml(formatDuration(seconds))}]</span>`;
  const clock =
    ctx.startMs === undefined
      ? ""
      : `<span class="${escapeHtml(logCardTimeClockTw)}">[${escapeHtml(formatClock(ctx.startMs, seconds))}]</span>`;

  return `<li${renderAttributes(attrs)}><span class="${escapeHtml(logCardTimeTw)}">${duration}${clock}</span><span>${escapeHtml(entry.message)}</span></li>`;
}

/**
 * Eine Section: eine Gruppe von Log-Zeilen.
 * Jede Zeile und die Section selbst blenden sich per data-show ein oder aus. Die Section ist sichtbar,
 * solange sich ihr Zeitfenster (erste bis letzte Zeile) mit dem gewählten Bereich überschneidet.
 */
export function LogCardSection(args: LogCardSectionArgs): string {
  const startMs = parseStartedAt(args.startedAt);
  const entries = args.entries ?? [];
  const seconds = entries.map((entry) => parseDelta(entry.time));

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...logCardAttributes("log-card-section"),
    class: cn(logCardSectionTw, args.class),
  };

  if (seconds.length > 0) {
    const start = Math.min(...seconds);
    const end = Math.max(...seconds);
    attrs["data-show"] = buildVisibleExpression(args.id, start, end);
    if (args.from !== undefined && args.to !== undefined && !isInRange(args.from, args.to, start, end)) {
      attrs.style = "display: none;";
    }
  }

  const title = args.title
    ? `<h3 class="${escapeHtml(logCardSectionTitleTw)}" data-slot="log-card-section-title">${escapeHtml(args.title)}</h3>`
    : "";
  const items = entries
    .map((entry) => renderEntry(entry, { id: args.id, startMs, from: args.from, to: args.to }))
    .join("");

  return `<section${renderAttributes(attrs)}>${title}<ul class="${escapeHtml(logCardEntriesTw)}">${items}</ul></section>`;
}

/**
 * Umschalter zwischen Dauer [mm:ss] und Uhrzeit [HH:MM:SS] (UTC).
 * Setzt das Signal clock der Card; die Card spiegelt es per data-mode, daran hängen die Sichtbarkeit der Zeitangaben
 * und die Hervorhebung des aktiven Buttons.
 */
export function LogCardTimeToggle(args: LogCardTimeToggleArgs): string {
  const mode = args.mode ?? DEFAULT_TIME_MODE;

  const rootAttrs: HtmlAttributes = {
    ...args.attributes,
    ...logCardAttributes("log-card-time-toggle"),
    role: "group",
    "aria-label": "Zeitanzeige",
    class: cn(logCardToggleTw, args.class),
  };

  const button = (forClock: boolean): string => {
    const attrs: HtmlAttributes = {
      type: "button",
      "data-slot": forClock ? "log-card-time-toggle-clock" : "log-card-time-toggle-duration",
      "aria-pressed": String((mode === "clock") === forClock),
      "data-attr:aria-pressed": buildPressedExpression(args.id, forClock),
      "data-on:click": buildSetClockHandler(args.id, forClock),
      class: cn(logCardToggleButtonTw, forClock ? logCardToggleClockTw : logCardToggleDurationTw),
    };
    return `<button${renderAttributes(attrs)}>${forClock ? "Uhrzeit (UTC)" : "Dauer"}</button>`;
  };

  return `<div${renderAttributes(rootAttrs)}>${button(false)}${button(true)}</div>`;
}

/**
 * RangeSlider mit zwei Reglern (untere und obere Grenze in Sekunden, standardmäßig in 10-Sekunden-Schritten)
 * und einer Anzeige des gewählten Bereichs, die dem Toggle folgt (Dauer oder Uhrzeit).
 * Funktioniert nur mit geladenem Datastar, sonst bleiben alle Zeilen im Startbereich sichtbar.
 */
export function LogCardRange(args: LogCardRangeArgs): string {
  const step = resolveStep(args.step);
  const { from, to } = clampRange(args.min, args.max, step, args.from, args.to);
  const mode = args.mode ?? DEFAULT_TIME_MODE;
  const startMs = parseStartedAt(args.startedAt);
  const disabled = args.min === args.max;
  const span = Math.max(args.max - args.min, 1);
  const label = args.label ?? DEFAULT_RANGE_LABEL;

  // Startwerte für die Darstellung ohne Datastar (identisch zu den Expressions)
  const fillStyle = `left: ${((from - args.min) / span) * 100}%; right: ${((args.max - to) / span) * 100}%`;
  const fromLayer = from >= (args.min + args.max) / 2 ? "z-index: 30" : "z-index: 10";

  const inputBase: HtmlAttributes = {
    type: "range",
    min: args.min,
    max: args.max,
    step,
    disabled,
    class: logCardInputTw,
  };

  const fromAttrs: HtmlAttributes = {
    ...inputBase,
    value: from,
    style: fromLayer,
    "aria-label": "Von",
    "data-slot": "log-card-range-from",
    "data-on:input": buildFromInputHandler(args.id),
    "data-attr:style": buildFromLayerExpression(args.id, args.min, args.max),
  };

  const toAttrs: HtmlAttributes = {
    ...inputBase,
    class: cn(logCardInputTw, "z-20"),
    value: to,
    "aria-label": "Bis",
    "data-slot": "log-card-range-to",
    "data-on:input": buildToInputHandler(args.id),
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
    "data-text": buildRangeLabelExpression(args.id, startMs),
  };

  const fillAttrs: HtmlAttributes = {
    class: logCardFillTw,
    style: fillStyle,
    "data-attr:style": buildRangeStyleExpression(args.id, args.min, args.max),
  };

  return `<div${renderAttributes(rootAttrs)}><div class="${escapeHtml(logCardRangeHeaderTw)}"><span class="text-muted-foreground">${escapeHtml(label)}</span><span${renderAttributes(valueAttrs)}>${escapeHtml(formatRangeLabel(from, to, mode, startMs))}</span></div><div class="${escapeHtml(logCardSliderTw)}"><div class="${escapeHtml(logCardTrackTw)}"><div${renderAttributes(fillAttrs)}></div></div><input${renderAttributes(fromAttrs)}><input${renderAttributes(toAttrs)}></div></div>`;
}

/**
 * Card, deren Content aus Sections mit Log-Zeilen besteht.
 * Die Zeilen enthalten nur das Delta zum Start ("mm:ss"); mit startedAt (UTC) lässt sich per Toggle zwischen
 * Dauer [mm:ss] und Uhrzeit [HH:MM:SS] umschalten. Ein RangeSlider über dem Content wählt den Zeitraum,
 * nur die Zeilen und Sections in diesem Bereich werden angezeigt.
 * Alles ist über das Signal-Objekt $<id> = { from, to, clock } verbunden.
 */
export function LogCard(args: LogCardArgs = {}): string {
  const id = args.id ?? createLogCardId();
  const sections = args.sections ?? [];
  const startMs = parseStartedAt(args.startedAt);
  const hasClock = startMs !== undefined;
  const mode: LogTimeMode = hasClock ? (args.timeMode ?? DEFAULT_TIME_MODE) : "duration";
  const step = resolveStep(args.step);

  const allSeconds = sections.flatMap((section) => (section.entries ?? []).map((entry) => parseDelta(entry.time)));
  const hasEntries = allSeconds.length > 0;
  const min = 0;
  const max = hasEntries ? ceilToStep(Math.max(...allSeconds), step) : 0;

  const { from, to } = clampRange(min, max, step, args.from, args.to);
  const signals = logCardSignals(id, from, to, mode === "clock");

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...logCardAttributes("log-card"),
    id,
    "data-mode": mode,
    "data-signals": signals.dataSignals,
    class: cn(logCardTw, args.class),
  };
  if (hasClock) attrs["data-attr:data-mode"] = buildModeExpression(id);

  const hasText = Boolean(args.title || args.description);
  const toggle = hasClock && hasEntries ? LogCardTimeToggle({ id, mode }) : "";
  const headerText = hasText
    ? `<div class="${escapeHtml(logCardHeaderTextTw)}">${
        args.title ? `<div class="${escapeHtml(logCardTitleTw)}" data-slot="log-card-title">${escapeHtml(args.title)}</div>` : ""
      }${
        args.description
          ? `<div class="${escapeHtml(logCardDescriptionTw)}" data-slot="log-card-description">${escapeHtml(args.description)}</div>`
          : ""
      }</div>`
    : "";
  const header =
    hasText || toggle
      ? `<div class="${escapeHtml(logCardHeaderTw)}" data-slot="log-card-header">${headerText}${toggle}</div>`
      : "";

  const range = hasEntries
    ? LogCardRange({ id, min, max, step, from, to, startedAt: startMs, mode, label: args.rangeLabel })
    : "";

  const content = sections.map((section) => LogCardSection({ ...section, id, startedAt: startMs, from, to })).join("");

  return `<div${renderAttributes(attrs)}>${header}${range}<div class="${escapeHtml(logCardContentTw)}" data-slot="log-card-content">${content}</div></div>`;
}
