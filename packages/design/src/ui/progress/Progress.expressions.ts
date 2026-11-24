import {
    clampExpression,
    getProgressPercent,
    wrapSignal,
    type ProgressRange,
} from "../../utils/progressValue";

/**
 * Progress-spezifische Ausdrücke (Breite des Indicators).
 * Die gemeinsame Wertlogik liegt in utils/progressValue.ts.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

/** Rundet auf zwei Nachkommastellen, damit keine Gleitkomma-Reste im Style landen */
function roundPercent(percent: number): number {
  return Number(percent.toFixed(2));
}

/** Style des Indicators (`width: X%`); bei unbestimmtem Fortschritt kein Style */
export function buildProgressIndicatorStyle(value: number | null | undefined, range: ProgressRange): string | undefined {
  const percent = getProgressPercent(value, range);
  return percent === null ? undefined : `width: ${roundPercent(percent)}%`;
}

/** Breite des Indicators: "X%" oder null (Style wird entfernt) */
export function buildProgressPercentExpression(valueSignal: string, range: ProgressRange): string {
  const v = wrapSignal(valueSignal);
  const span = range.max - range.min;
  return `Number.isFinite(${v}) ? (${clampExpression(valueSignal, range)} - ${range.min}) / ${span} * 100 + '%' : null`;
}
