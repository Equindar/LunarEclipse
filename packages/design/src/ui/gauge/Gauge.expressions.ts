import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type { GaugeContext, GaugeOptions, GaugeState } from "./Gauge.types";

/**
 * Das Gauge hat keine Datastar-Logik. Diese Datei enthält die Berechnungen (Zustand, Bogen-Geometrie,
 * Position des Werttexts) und die Attribut-Bausteine. Sie ersetzt den React-Context der Vorlage.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_GAUGE_MIN = 0;
export const DEFAULT_GAUGE_MAX = 100;
export const DEFAULT_GAUGE_SIZE = 120;
export const DEFAULT_GAUGE_THICKNESS = 8;
export const DEFAULT_GAUGE_START_ANGLE = 0;
export const DEFAULT_GAUGE_END_ANGLE = 360;

/** Rundet auf drei Nachkommastellen (stabile, kurze Ausgabe in SVG-Attributen) */
function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function getIsValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function getGaugeState(value: number | null, max: number): GaugeState {
  return value === null ? "indeterminate" : value === max ? "complete" : "loading";
}

/** Standard-Text: Anteil in Prozent, gerundet, ohne Einheit */
export function getDefaultValueText(value: number, min: number, max: number): string {
  return Math.round(((value - min) / (max - min)) * 100).toString();
}

export function getNormalizedAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

/** Winkel 0 liegt oben, die Zählung läuft im Uhrzeigersinn */
export function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

/** Pfad-Daten (d) eines Kreisbogens von startAngle bis endAngle */
export function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
  const angleDiff = endAngle - startAngle;
  const start = polarToCartesian(x, y, radius, startAngle);

  // Ein SVG-Bogen mit gleichen Endpunkten zeichnet nichts, ein Vollkreis besteht deshalb aus zwei Hälften.
  if (Math.abs(angleDiff) >= 360) {
    const mid = polarToCartesian(x, y, radius, startAngle + 180);
    return [
      "M", round(start.x), round(start.y),
      "A", round(radius), round(radius), 0, 0, 1, round(mid.x), round(mid.y),
      "A", round(radius), round(radius), 0, 0, 1, round(start.x), round(start.y),
    ].join(" ");
  }

  const end = polarToCartesian(x, y, radius, endAngle);
  const largeArcFlag = angleDiff <= 180 ? 0 : 1;

  return [
    "M", round(start.x), round(start.y),
    "A", round(radius), round(radius), 0, largeArcFlag, 1, round(end.x), round(end.y),
  ].join(" ");
}

/** Liegt der Zielwinkel (modulo 360) im Bereich von start bis end? */
function arcCoversAngle(startAngle: number, endAngle: number, target: number): boolean {
  const turns = Math.ceil((startAngle - target) / 360);
  return target + turns * 360 <= endAngle;
}

/**
 * Y-Mitte der sichtbaren Bogenfläche (Position des Werttexts).
 * Der höchste Punkt liegt bei 0 Grad, der tiefste bei 180 Grad (Winkel 0 = oben, im Uhrzeigersinn).
 */
export function getArcCenterY(center: number, radius: number, startAngle: number, endAngle: number): number {
  if (Math.abs(endAngle - startAngle) >= 360) return center;

  const startY = center - radius * Math.cos((startAngle * Math.PI) / 180);
  const endY = center - radius * Math.cos((endAngle * Math.PI) / 180);

  let minY = Math.min(startY, endY);
  let maxY = Math.max(startY, endY);

  if (arcCoversAngle(startAngle, endAngle, 0)) minY = Math.min(minY, center - radius);
  if (arcCoversAngle(startAngle, endAngle, 180)) maxY = Math.max(maxY, center + radius);

  return (minY + maxY) / 2;
}

/** Zufalls-ID: gauge_<8 Hex-Zeichen> */
export function createGaugeId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return `gauge_${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Berechnet alle gemeinsamen Werte (Ersatz für den React-Context).
 * Ungültige Eingaben werden still korrigiert: ungültiges max ergibt 100, ungültiges min ergibt 0,
 * der Wert wird auf min bis max begrenzt, ein nicht endlicher Wert ergibt "indeterminate".
 */
export function createGaugeContext(options: GaugeOptions, id: string = createGaugeId()): GaugeContext {
  const {
    value: valueOption = null,
    getValueText = getDefaultValueText,
    min: minOption = DEFAULT_GAUGE_MIN,
    max: maxOption,
    size = DEFAULT_GAUGE_SIZE,
    thickness = DEFAULT_GAUGE_THICKNESS,
    startAngle = DEFAULT_GAUGE_START_ANGLE,
    endAngle = DEFAULT_GAUGE_END_ANGLE,
  } = options;

  const min = getIsValidNumber(minOption) ? minOption : DEFAULT_GAUGE_MIN;
  const rawMax = getIsValidNumber(maxOption) && maxOption > 0 ? maxOption : DEFAULT_GAUGE_MAX;
  const max = rawMax <= min ? min + 1 : rawMax;

  const value = getIsValidNumber(valueOption) ? Math.min(Math.max(valueOption, min), max) : null;
  const valueText = value === null ? undefined : getValueText(value, min, max);
  const percentage = value === null ? null : (value - min) / (max - min);

  const radius = Math.max(0, (size - thickness) / 2);
  const center = size / 2;
  const arcLength = (Math.min(Math.abs(endAngle - startAngle), 360) / 360) * (2 * Math.PI * radius);

  return {
    value,
    valueText,
    min,
    max,
    state: getGaugeState(value, max),
    radius,
    thickness,
    size,
    center,
    percentage,
    startAngle,
    endAngle,
    arcLength,
    arcCenterY: getArcCenterY(center, radius, startAngle, endAngle),
    ids: { label: `${id}-label`, valueText: `${id}-value-text` },
    usage: { label: false, valueText: false },
  };
}

/** Nur data-state (Track, Werttext, Label) */
export function buildGaugeStateAttributes(context: GaugeContext): HtmlAttributes {
  return { "data-state": context.state };
}

/** data-state, data-value, data-max und data-min (Range). Ohne Wert entfällt data-value */
export function buildGaugeRangeDataAttributes(context: GaugeContext): HtmlAttributes {
  return {
    "data-state": context.state,
    "data-value": context.value ?? undefined,
    "data-max": context.max,
    "data-min": context.min,
  };
}

/** Wie der Range, zusätzlich data-percentage (Root und Indicator) */
export function buildGaugeDataAttributes(context: GaugeContext): HtmlAttributes {
  return {
    ...buildGaugeRangeDataAttributes(context),
    "data-percentage": context.percentage ?? undefined,
  };
}

/** stroke-dashoffset des Range: 0 = voll gezeichnet, arcLength = leer (ohne Wert ebenfalls voll, wie in der Vorlage) */
export function getRangeDashOffset(context: GaugeContext): number {
  if (context.state === "indeterminate") return 0;
  return context.percentage !== null ? context.arcLength - context.percentage * context.arcLength : context.arcLength;
}

export { round as roundGaugeNumber };
