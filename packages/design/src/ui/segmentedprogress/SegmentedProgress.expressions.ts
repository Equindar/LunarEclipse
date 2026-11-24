import {
    clampExpression,
    getProgressPercent,
    wrapSignal,
    type ProgressRange,
} from "../../utils/progressValue";

/**
 * Füllung der einzelnen Segmente. Die gemeinsame Wertlogik liegt in utils/progressValue.ts.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_SEGMENTED_PROGRESS_SEGMENTS = 10;
export const MAX_SEGMENTED_PROGRESS_SEGMENTS = 100;

/** Ganzzahl von 1 bis 100; ungültige Angaben ergeben den Standard (10) */
export function normalizeSegmentCount(segments?: number): number {
  if (segments === undefined || !Number.isFinite(segments) || segments < 1) {
    return DEFAULT_SEGMENTED_PROGRESS_SEGMENTS;
  }

  return Math.min(MAX_SEGMENTED_PROGRESS_SEGMENTS, Math.floor(segments));
}

/**
 * Füllung eines Segments in Prozent (0 bis 100): Segmente davor sind voll, das aktuelle
 * ist teilweise gefüllt, die folgenden sind leer. `null` bei unbestimmtem Fortschritt.
 */
export function getSegmentFillPercent(percent: number | null, index: number, count: number): number | null {
  if (percent === null) return null;
  return Math.min(1, Math.max(0, (percent / 100) * count - index)) * 100;
}

/** Style des Segment-Indicators (`width: X%`); bei unbestimmtem Fortschritt kein Style */
export function buildSegmentIndicatorStyle(
  value: number | null | undefined,
  range: ProgressRange,
  index: number,
  count: number
): string | undefined {
  const fill = getSegmentFillPercent(getProgressPercent(value, range), index, count);
  return fill === null ? undefined : `width: ${Number(fill.toFixed(2))}%`;
}

/** Breite des Segment-Indicators als Datastar-Ausdruck: "X%" oder null (Style wird entfernt) */
export function buildSegmentWidthExpression(
  valueSignal: string,
  range: ProgressRange,
  index: number,
  count: number
): string {
  const v = wrapSignal(valueSignal);
  const share = `(${clampExpression(valueSignal, range)} - ${range.min}) / ${range.max - range.min} * ${count}`;
  const fill = `Math.min(1, Math.max(0, ${share} - ${index})) * 100`;
  return `Number.isFinite(${v}) ? Number((${fill}).toFixed(2)) + '%' : null`;
}
