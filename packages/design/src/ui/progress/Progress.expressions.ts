import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type {
    ProgressArgs,
    ProgressFormatArgs,
    ProgressMeasureArgs,
    ProgressRange,
    ProgressStatus,
} from "./Progress.types";

/**
 * Wertberechnung, Formatierung und Datastar-Ausdrücke des Progress.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_PROGRESS_MIN = 0;
export const DEFAULT_PROGRESS_MAX = 100;
export const DEFAULT_PROGRESS_LOCALE = "en-US";

/** Wert von aria-valuetext bei unbestimmtem Fortschritt */
export const INDETERMINATE_VALUE_TEXT = "indeterminate progress";

/** Ungültige Bereiche (nicht endlich oder max <= min) fallen auf 0 bis 100 zurück */
export function resolveProgressRange(args: Pick<ProgressMeasureArgs, "min" | "max">): ProgressRange {
  const min = args.min ?? DEFAULT_PROGRESS_MIN;
  const max = args.max ?? DEFAULT_PROGRESS_MAX;

  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) {
    return { min: DEFAULT_PROGRESS_MIN, max: DEFAULT_PROGRESS_MAX };
  }

  return { min, max };
}

/** Begrenzt den Wert auf den Bereich; `null` bei fehlendem oder nicht endlichem Wert */
export function normalizeProgressValue(value: number | null | undefined, range: ProgressRange): number | null {
  if (value === null || value === undefined || !Number.isFinite(value)) return null;
  return Math.min(range.max, Math.max(range.min, value));
}

/** Anteil am Wertebereich in Prozent (0 bis 100) oder `null` */
export function getProgressPercent(value: number | null | undefined, range: ProgressRange): number | null {
  const normalized = normalizeProgressValue(value, range);
  if (normalized === null) return null;
  return ((normalized - range.min) / (range.max - range.min)) * 100;
}

export function getProgressStatus(value: number | null | undefined, range: ProgressRange): ProgressStatus {
  const normalized = normalizeProgressValue(value, range);
  if (normalized === null) return "indeterminate";
  return normalized >= range.max ? "complete" : "progressing";
}

/** Rundet auf zwei Nachkommastellen, damit keine Gleitkomma-Reste im Style landen */
function roundPercent(percent: number): number {
  return Number(percent.toFixed(2));
}

/** Style des Indicators (`width: X%`); bei unbestimmtem Fortschritt kein Style */
export function buildProgressIndicatorStyle(value: number | null | undefined, range: ProgressRange): string | undefined {
  const percent = getProgressPercent(value, range);
  return percent === null ? undefined : `width: ${roundPercent(percent)}%`;
}

/** Nicht unterstützte oder ungültige Locales fallen auf die Standard-Locale zurück */
export function resolveProgressLocale(locale?: string): string {
  if (!locale) return DEFAULT_PROGRESS_LOCALE;

  try {
    return Intl.NumberFormat.supportedLocalesOf([locale]).length > 0 ? locale : DEFAULT_PROGRESS_LOCALE;
  } catch {
    return DEFAULT_PROGRESS_LOCALE;
  }
}

/** Formatierter Wert für die Anzeige und aria-valuetext; leerer String bei unbestimmtem Fortschritt */
export function formatProgressValue(
  value: number | null | undefined,
  range: ProgressRange,
  args: ProgressFormatArgs = {}
): string {
  const normalized = normalizeProgressValue(value, range);
  if (normalized === null) return "";

  const locale = resolveProgressLocale(args.locale);

  if (args.format) {
    return new Intl.NumberFormat(locale, args.format).format(normalized);
  }

  const fraction = (normalized - range.min) / (range.max - range.min);
  return new Intl.NumberFormat(locale, { style: "percent" }).format(fraction);
}

/** Static-Attribute für den Zustand: data-indeterminate, data-progressing, data-complete */
export function buildProgressStateAttributes(value: number | null | undefined, range: ProgressRange): HtmlAttributes {
  const status = getProgressStatus(value, range);

  return {
    "data-indeterminate": status === "indeterminate",
    "data-progressing": status === "progressing",
    "data-complete": status === "complete",
  };
}

/* ------------------------------------------------------------------ */
/* Datastar-Ausdrücke (nur mit valueSignal)                            */
/* ------------------------------------------------------------------ */

/** Klammert den Signal-Ausdruck, damit er in Verknüpfungen sicher bleibt */
function wrap(valueSignal: string): string {
  return `(${valueSignal})`;
}

function clampExpression(valueSignal: string, range: ProgressRange): string {
  return `Math.min(${range.max}, Math.max(${range.min}, ${wrap(valueSignal)}))`;
}

/** Breite des Indicators: "X%" oder null (Style wird entfernt) */
export function buildProgressPercentExpression(valueSignal: string, range: ProgressRange): string {
  const v = wrap(valueSignal);
  const span = range.max - range.min;
  return `Number.isFinite(${v}) ? (${clampExpression(valueSignal, range)} - ${range.min}) / ${span} * 100 + '%' : null`;
}

/** Formatierter Wert (ohne Prüfung auf endliche Zahl) */
function buildProgressFormatExpression(valueSignal: string, range: ProgressRange, args: ProgressFormatArgs): string {
  const locale = JSON.stringify(resolveProgressLocale(args.locale));

  if (args.format) {
    return `new Intl.NumberFormat(${locale}, ${JSON.stringify(args.format)}).format(${clampExpression(valueSignal, range)})`;
  }

  const span = range.max - range.min;
  return `new Intl.NumberFormat(${locale}, {style: 'percent'}).format((${clampExpression(valueSignal, range)} - ${range.min}) / ${span})`;
}

/** Anzeigetext für ProgressValue; leerer String bei unbestimmtem Fortschritt */
export function buildProgressTextExpression(valueSignal: string, range: ProgressRange, args: ProgressFormatArgs): string {
  return `Number.isFinite(${wrap(valueSignal)}) ? ${buildProgressFormatExpression(valueSignal, range, args)} : ''`;
}

/** Ausdrücke für data-indeterminate, data-progressing und data-complete */
export function buildProgressStateExpressions(valueSignal: string, range: ProgressRange): Record<string, string> {
  const v = wrap(valueSignal);

  return {
    "data-indeterminate": `!Number.isFinite(${v})`,
    "data-progressing": `Number.isFinite(${v}) && ${v} < ${range.max}`,
    "data-complete": `Number.isFinite(${v}) && ${v} >= ${range.max}`,
  };
}

/** Ausdrücke für aria-valuenow und aria-valuetext am Root */
export function buildProgressAriaExpressions(
  valueSignal: string,
  range: ProgressRange,
  args: ProgressFormatArgs
): Record<string, string> {
  const v = wrap(valueSignal);

  return {
    "aria-valuenow": `Number.isFinite(${v}) ? ${clampExpression(valueSignal, range)} : null`,
    "aria-valuetext": `Number.isFinite(${v}) ? ${buildProgressFormatExpression(valueSignal, range, args)} : ${JSON.stringify(INDETERMINATE_VALUE_TEXT)}`,
  };
}

/** Wert für `data-attr` als Objekt-Literal: {"attr": ausdruck, ...} */
export function buildProgressDataAttr(expressions: Record<string, string>): string {
  const entries = Object.entries(expressions).map(([name, expression]) => `${JSON.stringify(name)}: ${expression}`);
  return `{${entries.join(", ")}}`;
}

/* ------------------------------------------------------------------ */
/* Attribut-Bausteine                                                  */
/* ------------------------------------------------------------------ */

/**
 * data-slot, Zustandsattribute und, mit valueSignal, ein data-attr mit den reaktiven Zuständen.
 * `extraExpressions` ergänzt das data-attr (der Root hängt hier die ARIA-Werte an).
 */
export function buildProgressPartAttributes(
  slot: string,
  measure: ProgressMeasureArgs,
  extraExpressions: Record<string, string> = {}
): HtmlAttributes {
  const range = resolveProgressRange(measure);

  const attrs: HtmlAttributes = {
    "data-slot": slot,
    ...buildProgressStateAttributes(measure.value, range),
  };

  if (measure.valueSignal) {
    attrs["data-attr"] = buildProgressDataAttr({
      ...buildProgressStateExpressions(measure.valueSignal, range),
      ...extraExpressions,
    });
  }

  return attrs;
}

/** Attribute des Roots: role, ARIA-Werte, id, aria-labelledby und die Teil-Attribute */
export function buildProgressRootAttributes(args: ProgressArgs): HtmlAttributes {
  const range = resolveProgressRange(args);
  const normalized = normalizeProgressValue(args.value, range);

  const extraExpressions = args.valueSignal ? buildProgressAriaExpressions(args.valueSignal, range, args) : {};

  const attrs: HtmlAttributes = {
    ...buildProgressPartAttributes("progress", args, extraExpressions),
    role: "progressbar",
    "aria-valuemin": range.min,
    "aria-valuemax": range.max,
    "aria-valuetext": normalized === null ? INDETERMINATE_VALUE_TEXT : formatProgressValue(normalized, range, args),
  };

  if (normalized !== null) attrs["aria-valuenow"] = normalized;
  if (args.id) attrs.id = args.id;
  if (args.id && args.hasLabel) attrs["aria-labelledby"] = `${args.id}-label`;

  return attrs;
}
