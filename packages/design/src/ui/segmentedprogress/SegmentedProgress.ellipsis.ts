import { clampExpression, normalizeProgressValue, wrapSignal, type ProgressRange } from "../../utils/progressValue";
import type { SegmentedProgressEllipsisArgs } from "./SegmentedProgress.types";

/**
 * Hilfsfunktionen für die Darstellung mit Ellipsis (offene Skalen). Jedes Segment steht für einen Punkt,
 * der Platzhalter erscheint, sobald mehr Punkte vorhanden sind als Segmente (head + tail).
 * Kann bei Bedarf nach SegmentedProgress.expressions.ts verschoben werden.
 */

export const DEFAULT_ELLIPSIS_HEAD = 5;
export const DEFAULT_ELLIPSIS_TAIL = 3;
export const DEFAULT_ELLIPSIS_LABEL = "{count} more";
const MAX_SEGMENTS = 100;

export interface ResolvedEllipsis {
  head: number;
  tail: number;
  label: string;
}

function normalizeCount(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.min(MAX_SEGMENTS - 1, Math.max(1, Math.trunc(value)));
}

/** `null`, wenn kein Ellipsis gewünscht ist */
export function resolveEllipsis(option: boolean | SegmentedProgressEllipsisArgs | undefined): ResolvedEllipsis | null {
  if (!option) return null;
  const args: SegmentedProgressEllipsisArgs = option === true ? {} : option;

  const head = normalizeCount(args.head, DEFAULT_ELLIPSIS_HEAD);
  const tail = Math.min(MAX_SEGMENTS - head, normalizeCount(args.tail, DEFAULT_ELLIPSIS_TAIL));

  return { head, tail, label: args.label ?? DEFAULT_ELLIPSIS_LABEL };
}

/** Punkte (Wert minus min, nie negativ); 0 bei fehlendem Wert */
export function buildUnitCount(value: number | null | undefined, range: ProgressRange): number {
  const normalized = normalizeProgressValue(value, range);
  return normalized === null ? 0 : Math.max(0, normalized - range.min);
}

/** Füllung eines Segments in Prozent: 1 Punkt füllt genau ein Segment, Bruchteile füllen anteilig */
function unitFillPercent(count: number, index: number): number {
  return Number((Math.min(1, Math.max(0, count - index)) * 100).toFixed(2));
}

/** style des Indicators (statisch) */
export function buildUnitIndicatorStyle(value: number | null | undefined, range: ProgressRange, index: number): string {
  return `width: ${unitFillPercent(buildUnitCount(value, range), index)}%`;
}

/** Ausdruck für die Punkte (Datastar); 0 bei nicht endlichem Wert */
export function buildUnitCountExpression(valueSignal: string, range: ProgressRange): string {
  return `(Number.isFinite(${wrapSignal(valueSignal)}) ? Math.max(0, ${clampExpression(valueSignal, range)} - ${range.min}) : 0)`;
}

/** Ausdruck für `data-style:width` des Indicators */
export function buildUnitWidthExpression(valueSignal: string, range: ProgressRange, index: number): string {
  return `(Math.min(1, Math.max(0, ${buildUnitCountExpression(valueSignal, range)} - ${index})) * 100) + '%'`;
}

/** Ausdruck für `data-show` des Platzhalters: mehr Punkte als Segmente */
export function buildEllipsisVisibleExpression(valueSignal: string, range: ProgressRange, layout: ResolvedEllipsis): string {
  return `${buildUnitCountExpression(valueSignal, range)} > ${layout.head + layout.tail}`;
}

/** Beschriftung des Platzhalters (statisch) */
export function buildEllipsisLabel(layout: ResolvedEllipsis, count: number): string {
  const hidden = Math.max(0, Math.round(count - layout.head - layout.tail));
  return layout.label.replaceAll("{count}", String(hidden));
}

/** Ausdruck für `data-attr:title` des Platzhalters */
export function buildEllipsisLabelExpression(valueSignal: string, range: ProgressRange, layout: ResolvedEllipsis): string {
  const hidden = `Math.max(0, Math.round(${buildUnitCountExpression(valueSignal, range)} - ${layout.head + layout.tail}))`;
  return `${JSON.stringify(layout.label)}.replaceAll('{count}', String(${hidden}))`;
}

/** Nummer des Punktes, den das Segment `index` zeigt (ab 1): vorn fest, hinten die letzten Punkte */
function unitPoint(count: number, layout: ResolvedEllipsis, index: number): number {
  const total = layout.head + layout.tail;
  if (index < layout.head || count <= total) return index + 1;
  return count - layout.tail + 1 + (index - layout.head);
}

/** Punkte, die bereits bestehen (baseline minus min, nie negativ) */
export function buildBaselineUnits(baseline: number | undefined, range: ProgressRange): number | undefined {
  if (baseline === undefined || !Number.isFinite(baseline)) return undefined;
  return Math.max(0, baseline - range.min);
}

/** Ob das Segment einen neuen Punkt zeigt (statisch) */
export function isNewUnit(count: number, layout: ResolvedEllipsis, index: number, baselineUnits: number): boolean {
  return unitPoint(count, layout, index) > baselineUnits;
}

/**
 * Ausdruck für `data-new` eines Segments hinter dem Platzhalter. Vorn zeigen die Segmente feste Punkte
 * (dort genügt der statische Wert), hinten hängt der Punkt vom Wert ab.
 */
export function buildIsNewExpression(
  valueSignal: string,
  range: ProgressRange,
  layout: ResolvedEllipsis,
  index: number,
  baselineUnits: number
): string | undefined {
  if (index < layout.head) return undefined;

  const count = buildUnitCountExpression(valueSignal, range);
  const total = layout.head + layout.tail;
  const offset = index - layout.head;

  return `(${count} > ${total} ? ${count} - ${layout.tail} + 1 + ${offset} : ${index + 1}) > ${baselineUnits}`;
}
