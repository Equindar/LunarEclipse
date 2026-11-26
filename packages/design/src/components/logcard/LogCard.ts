import { Scroller } from "../../ui/scroller";
import { Status, StatusIndicator, StatusLabel } from "../../ui/status";
import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import {
    buildEmptyVisibleExpression,
    buildEntryAnnounceExpression,
    buildFollowHandler,
    buildFromInputHandler,
    buildFromLayerExpression,
    buildInputEffect,
    buildJumpToLatestHandler,
    buildJumpVisibleExpression,
    buildLiveVisibleExpression,
    buildModeExpression,
    buildPressedExpression,
    buildRangeLabelExpression,
    buildRangeStyleExpression,
    buildScrollEffect,
    buildSetClockHandler,
    buildSseInitExpression,
    buildTailEffect,
    buildToInputHandler,
    buildVisibleExpression,
    ceilToStep,
    clampRange,
    createLogCardId,
    DEFAULT_RANGE_LABEL,
    DEFAULT_SCROLLER_CLASS,
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
    signalKey,
} from "./LogCard.expressions";
import type {
    LogCardArgs,
    LogCardEntryArgs,
    LogCardRangeArgs,
    LogCardSectionArgs,
    LogCardSignalsPatch,
    LogCardTimeToggleArgs,
    LogEntryTone,
    LogTimeMode,
} from "./LogCard.types";

/** Card-Klassen wie shadcn/ui Card (Base-Variante); group/log-card steuert die Zeitanzeige per data-mode */
const logCardTw = tw`group/log-card bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm`;
const logCardHeaderTw = tw`flex items-start justify-between gap-4 px-6`;
const logCardHeaderTextTw = tw`grid auto-rows-min gap-1.5`;
const logCardHeaderActionsTw = tw`ml-auto flex shrink-0 items-center gap-3`;
const logCardTitleTw = tw`leading-none font-semibold`;
const logCardDescriptionTw = tw`text-muted-foreground text-sm`;

/** Umschalter Dauer / Uhrzeit: aktiv ist der Button, der zum data-mode der Card passt */
const logCardToggleTw = tw`inline-flex shrink-0 items-center rounded-md border p-0.5 text-xs`;
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

/** Bereich um den Scroller; relative für den "Zum Neuesten"-Button */
const logCardViewportTw = tw`relative`;
const logCardJumpTw = tw`bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 absolute right-6 bottom-3 rounded-full border px-3 py-1 text-xs font-medium shadow-sm transition-colors outline-none focus-visible:ring-[3px]`;
const logCardContentTw = tw`flex flex-col gap-5 px-6`;
const logCardEmptyTw = tw`text-muted-foreground px-6 text-sm`;

/**
 * Section: blendet sich selbst aus, wenn keine ihrer Zeilen sichtbar ist (Zeilen blenden sich per
 * style="display: none" aus). So bleibt die Section auch richtig, wenn der Server später weitere Zeilen anhängt.
 */
const logCardSectionTw = tw`flex flex-col gap-1.5 [&:not(:has(li:not([style*='display:_none'])))]:hidden`;
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

/** DOM-ID der Section mit dem Index index (0-basiert) */
export function logCardSectionId(id: string, index: number): string {
  return `${id}-section-${index}`;
}

/** Selector des Containers aller Sections: Ziel für neue Sections (datastar-patch-elements, mode append) */
export function logCardContentSelector(id: string): string {
  return `#${id}-content`;
}

/** Selector der Zeilenliste einer Section: Ziel für neue Zeilen (datastar-patch-elements, mode append) */
export function logCardEntriesSelector(id: string, sectionIndex: number): string {
  return `#${logCardSectionId(id, sectionIndex)}-entries`;
}

/**
 * Datenteil eines datastar-patch-signals-Events für die Card, z. B. { live: false } am Ende des Kampfes.
 * Der Rückgabewert ist das JSON, das hinter "signals " in die data-Zeile gehört.
 */
export function logCardSignalsPatch(id: string, patch: LogCardSignalsPatch): string {
  return JSON.stringify({ [signalKey(id)]: patch });
}

/**
 * Eine einzelne Zeile. Für nachträglich per SSE eingefügte Zeilen announce: true setzen:
 * die Zeile hebt dann beim Einfügen das Maximum des Sliders an und löst das Nachscrollen aus.
 */
export function LogCardEntry(args: LogCardEntryArgs): string {
  const tone = args.tone ?? DEFAULT_TONE;
  const startMs = parseStartedAt(args.startedAt);
  const seconds = parseDelta(args.time);

  const attrs: HtmlAttributes = {
    id: args.id,
    ...logCardAttributes("log-card-entry"),
    "data-tone": tone,
    "data-show": buildVisibleExpression(args.cardId, seconds, seconds),
    class: cn(logCardEntryTw, logEntryToneTw[tone]),
  };
  if (args.announce) {
    attrs["data-init"] = buildEntryAnnounceExpression(args.cardId, ceilToStep(seconds, resolveStep(args.step)));
  }
  if (args.from !== undefined && args.to !== undefined && !isInRange(args.from, args.to, seconds, seconds)) {
    attrs.style = "display: none;";
  }

  const duration = `<span class="${escapeHtml(logCardTimeDurationTw)}">[${escapeHtml(formatDuration(seconds))}]</span>`;
  const clock =
    startMs === undefined
      ? ""
      : `<span class="${escapeHtml(logCardTimeClockTw)}">[${escapeHtml(formatClock(startMs, seconds))}]</span>`;

  return `<li${renderAttributes(attrs)}><span class="${escapeHtml(logCardTimeTw)}">${duration}${clock}</span><span>${escapeHtml(args.message)}</span></li>`;
}

/**
 * Eine Section: eine Gruppe von Log-Zeilen mit optionaler Überschrift.
 * Jede Zeile blendet sich per data-show selbst ein oder aus, die Section verschwindet, wenn keine Zeile sichtbar ist
 * (auch eine Section ohne Zeilen bleibt unsichtbar).
 */
export function LogCardSection(args: LogCardSectionArgs): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    id: args.sectionId,
    ...logCardAttributes("log-card-section"),
    class: cn(logCardSectionTw, args.class),
  };

  const title = args.title
    ? `<h3 class="${escapeHtml(logCardSectionTitleTw)}" data-slot="log-card-section-title">${escapeHtml(args.title)}</h3>`
    : "";

  const items = (args.entries ?? [])
    .map((entry) =>
      LogCardEntry({
        ...entry,
        cardId: args.id,
        startedAt: args.startedAt,
        step: args.step,
        announce: args.announce,
        from: args.from,
        to: args.to,
      })
    )
    .join("");

  const listAttrs: HtmlAttributes = {
    id: args.sectionId ? `${args.sectionId}-entries` : undefined,
    class: logCardEntriesTw,
  };

  return `<section${renderAttributes(attrs)}>${title}<ul${renderAttributes(listAttrs)}>${items}</ul></section>`;
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
 * Das Maximum ist das Signal max und wächst im Live-Betrieb mit; die Inputs folgen ihm per data-effect.
 * Funktioniert nur mit geladenem Datastar, sonst bleiben alle Zeilen im Startbereich sichtbar.
 */
export function LogCardRange(args: LogCardRangeArgs): string {
  const step = resolveStep(args.step);
  const { from, to } = clampRange(args.min, args.max, step, args.from, args.to);
  const mode = args.mode ?? DEFAULT_TIME_MODE;
  const startMs = parseStartedAt(args.startedAt);
  const disabled = args.max <= args.min;
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
    "data-effect": buildInputEffect(args.id, "from", args.min),
    "data-attr:style": buildFromLayerExpression(args.id, args.min),
  };

  const toAttrs: HtmlAttributes = {
    ...inputBase,
    class: cn(logCardInputTw, "z-20"),
    value: to,
    "aria-label": "Bis",
    "data-slot": "log-card-range-to",
    "data-on:input": buildToInputHandler(args.id),
    "data-effect": buildInputEffect(args.id, "to", args.min),
  };

  const rootAttrs: HtmlAttributes = {
    ...args.attributes,
    ...logCardAttributes("log-card-range"),
    class: cn(logCardRangeTw, args.class),
  };

  const valueAttrs: HtmlAttributes = {
    "data-slot": "log-card-range-value",
    class: "font-medium tabular-nums",
    "aria-live": "off",
    "data-text": buildRangeLabelExpression(args.id, startMs),
  };

  const fillAttrs: HtmlAttributes = {
    class: logCardFillTw,
    style: fillStyle,
    "data-attr:style": buildRangeStyleExpression(args.id, args.min),
  };

  return `<div${renderAttributes(rootAttrs)}><div class="${escapeHtml(logCardRangeHeaderTw)}"><span class="text-muted-foreground">${escapeHtml(label)}</span><span${renderAttributes(valueAttrs)}>${escapeHtml(formatRangeLabel(from, to, mode, startMs))}</span></div><div class="${escapeHtml(logCardSliderTw)}"><div class="${escapeHtml(logCardTrackTw)}"><div${renderAttributes(fillAttrs)}></div></div><input${renderAttributes(fromAttrs)}><input${renderAttributes(toAttrs)}></div></div>`;
}

/**
 * Card, deren Content aus Sections mit Log-Zeilen besteht, in einem Scroller.
 * Die Zeilen enthalten nur das Delta zum Start ("mm:ss"); mit startedAt (UTC) lässt sich per Toggle zwischen
 * Dauer [mm:ss] und Uhrzeit [HH:MM:SS] umschalten. Ein RangeSlider über dem Content wählt den Zeitraum,
 * nur die Zeilen und Sections in diesem Bereich werden angezeigt.
 *
 * Live-Betrieb (live: true, optional sseUrl): Neue Zeilen und Sections kommen per SSE, der Slider wächst mit,
 * seine obere Grenze wandert mit, solange sie am Maximum steht, und der Scroller bleibt auf dem neuesten Eintrag,
 * bis der Nutzer nach oben scrollt. Ein Button "Zum Neuesten" setzt das Folgen wieder.
 *
 * Alles ist über das Signal-Objekt $<id> verbunden (siehe LogCardSignals).
 */
export function LogCard(args: LogCardArgs = {}): string {
  const id = args.id ?? createLogCardId();
  const sections = args.sections ?? [];
  const startMs = parseStartedAt(args.startedAt);
  const hasClock = startMs !== undefined;
  const mode: LogTimeMode = hasClock ? (args.timeMode ?? DEFAULT_TIME_MODE) : "duration";
  const step = resolveStep(args.step);
  const live = args.live ?? false;

  const allSeconds = sections.flatMap((section) => (section.entries ?? []).map((entry) => parseDelta(entry.time)));
  const count = allSeconds.length;
  const min = 0;
  const max = count > 0 ? ceilToStep(Math.max(...allSeconds), step) : 0;
  const hasRange = count > 0 || live;

  const { from, to } = clampRange(min, max, step, args.from, args.to);
  const follow = args.follow ?? live;
  const signals = logCardSignals(id, {
    from,
    to,
    max,
    clock: mode === "clock",
    live,
    follow,
    tail: live && to === max,
    count,
  });

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...logCardAttributes("log-card"),
    id,
    "data-mode": mode,
    "data-signals": signals.dataSignals,
    "data-effect": buildTailEffect(id),
    class: cn(logCardTw, args.class),
  };
  if (hasClock) attrs["data-attr:data-mode"] = buildModeExpression(id);
  if (args.sseUrl) attrs["data-init"] = buildSseInitExpression(args.sseUrl);

  // Header: Titel und Beschreibung links, Live-Hinweis und Toggle rechts
  const hasText = Boolean(args.title || args.description);
  const toggle = hasClock && hasRange ? LogCardTimeToggle({ id, mode }) : "";

  const liveBadge = live ?
    Status({ variant: "error",
      attributes: { "data-slot": "log-card-live", "data-show": buildLiveVisibleExpression(id) },
      children: [StatusIndicator(), StatusLabel({ children: "live" })]}) :
    Status({ variant: "default", children: [StatusIndicator({ pulse: false}), StatusLabel({ children: "beendet" })]});
  // const liveBadge = live
  //   ? `<span class="${escapeHtml(logCardLiveTw)}" data-slot="log-card-live" data-show="${escapeHtml(buildLiveVisibleExpression(id))}"><span class="${escapeHtml(logCardLiveDotTw)}" aria-hidden="true"></span>Live</span>`
  //   : "";
  const actions = liveBadge || toggle ? `<div class="${escapeHtml(logCardHeaderActionsTw)}">${liveBadge}${toggle}</div>` : "";
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
    hasText || actions
      ? `<div class="${escapeHtml(logCardHeaderTw)}" data-slot="log-card-header">${headerText}${actions}</div>`
      : "";

  const range = hasRange
    ? LogCardRange({ id, min, max, step, from, to, startedAt: startMs, mode, label: args.rangeLabel })
    : "";

  // Content im Scroller: Leer-Hinweis und Container der Sections (Ziel für SSE-Patches)
  const emptyAttrs: HtmlAttributes = {
    ...logCardAttributes("log-card-empty"),
    "data-show": buildEmptyVisibleExpression(id),
    class: logCardEmptyTw,
  };
  if (count > 0) emptyAttrs.style = "display: none;";
  const empty = live ? `<p${renderAttributes(emptyAttrs)}>Noch keine Einträge</p>` : "";

  const sectionsHtml = sections
    .map((section, index) =>
      LogCardSection({ ...section, id, sectionId: logCardSectionId(id, index), startedAt: startMs, from, to })
    )
    .join("");
  const content = `<div id="${escapeHtml(id)}-content" class="${escapeHtml(logCardContentTw)}" data-slot="log-card-content">${sectionsHtml}</div>`;

  const scroller = Scroller({
    class: args.scrollerClass ?? DEFAULT_SCROLLER_CLASS,
    attributes: {
      id: `${id}-viewport`,
      "data-slot": "log-card-viewport",
      "data-on:scroll": buildFollowHandler(id),
      "data-effect": buildScrollEffect(id),
    },
    children: `${empty}${content}`,
  });

  const jump = live
    ? `<button type="button" data-slot="log-card-jump" style="display: none;" class="${escapeHtml(logCardJumpTw)}" data-show="${escapeHtml(buildJumpVisibleExpression(id))}" data-on:click="${escapeHtml(buildJumpToLatestHandler(id))}">Zum Neuesten</button>`
    : "";

  return `<div${renderAttributes(attrs)}>${header}${range}<div class="${escapeHtml(logCardViewportTw)}">${scroller}${jump}</div></div>`;
}
