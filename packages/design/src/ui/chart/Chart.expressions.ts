import { scaleLinear } from "d3-scale";

import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { createSignals, type SignalManager } from "../../utils/SignalManager";
import type {
    CartesianChartArgs,
    CartesianLayout,
    ChartConfig,
    ChartMargin,
    ChartThemeName,
    ChartTooltipSignals,
} from "./Chart.types";

/**
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 * Enthält die Datastar-Expressions des Tooltips, die Sanitizer für ids, Schlüssel und Farben
 * sowie die serverseitige Geometrie (d3-scale, kein DOM, kein jsdom).
 */

export const DEFAULT_CHART_WIDTH = 640;
export const DEFAULT_CHART_HEIGHT = 360;
export const DEFAULT_Y_TICK_COUNT = 5;
export const DEFAULT_X_MAX_TICKS = 8;

/** Format: { Farbmodus: CSS-Selektor-Präfix } (wie THEMES in shadcn) */
const THEMES: Record<ChartThemeName, string> = { light: "", dark: ".dark" };

/** Zulässige Zeichen eines CSS-Wertes (Farben, var(...), oklch(... / ...)); alles andere wird verworfen */
const SAFE_CSS_VALUE = /^[A-Za-z0-9#%.,()\s/_+-]+$/;

/** Rundet auf zwei Nachkommastellen (kürzere, stabile Attributwerte für das Morphing) */
export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** id für DOM, CSS-Selektor und Signal-Namen: nur Buchstaben, Ziffern, "_" und "-" */
export function chartId(id: string): string {
  const safe = id.replace(/[^A-Za-z0-9_-]/g, "-");
  return safe === "" ? "chart" : safe;
}

/** Serien-Schlüssel für CSS-Variablen und ids */
export function chartKey(key: string): string {
  const safe = key.replace(/[^A-Za-z0-9_-]/g, "-");
  return safe === "" ? "series" : safe;
}

/** Farb-Variable einer Serie, wie sie ChartStyle definiert: `var(--color-<key>)` */
export function chartColorVar(key: string): string {
  return `var(--color-${chartKey(key)})`;
}

/** Prüft, ob ein CSS-Wert gefahrlos in ein style-Attribut oder ein style-Element passt */
export function isSafeCssValue(value: string): boolean {
  return SAFE_CSS_VALUE.test(value);
}

/** Serien in Darstellungsreihenfolge (Standard: alle Schlüssel der Config) */
export function resolveSeries(config: ChartConfig, series?: string[]): string[] {
  return series ?? Object.keys(config);
}

/** Wert als Zahl oder null (Lücke) */
export function toNumber(value: string | number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/**
 * JS-Literal für Datastar-Expressions.
 * Datastar ersetzt `$name` auch innerhalb von Strings durch einen Signal-Zugriff (z. B. "$1,200"),
 * deshalb wird das Dollarzeichen als \u0024 geschrieben.
 */
export function jsLiteral(value: unknown): string {
  return JSON.stringify(value).replaceAll("$", "\\u0024");
}

/* ------------------------------------------------------------------ */
/* Signale und Tooltip                                                 */
/* ------------------------------------------------------------------ */

const INITIAL_TOOLTIP_SIGNALS: ChartTooltipSignals = { show: false, x: 0, y: 0, label: "", values: [] };

/** Signale des Tooltips; Namensraum ist die (bereinigte) Chart-id, "-" wird zu "_" */
export function chartSignals(id: string): SignalManager<ChartTooltipSignals> {
  return createSignals(chartId(id), INITIAL_TOOLTIP_SIGNALS);
}

/** Standard-Attribute des Containers: data-slot, data-chart und die Signale des Tooltips */
export function buildChartRootAttributes(id: string): HtmlAttributes {
  return {
    "data-slot": "chart",
    "data-chart": `chart-${chartId(id)}`,
    "data-signals": chartSignals(id).dataSignals,
  };
}

/**
 * Attribute des Tooltip-Overlays: sichtbar über `show`, Position über `x` und `y`.
 * Rechts der Mitte klappt das Overlay nach links, damit es nicht aus dem Container ragt.
 * `el.parentElement` ist dabei der Container (das Overlay ist sein direktes Kind).
 */
export function buildTooltipOverlayAttributes(id: string): HtmlAttributes {
  const signals = chartSignals(id);
  const x = signals.signal("x");
  const y = signals.signal("y");
  const flipped = "'translate(calc(-100% - 12px), 12px)'";
  const normal = "'translate(12px, 12px)'";
  return {
    id: `${chartId(id)}-tooltip`,
    "data-slot": "chart-tooltip",
    "data-show": signals.signal("show"),
    "data-style": `{left: ${x} + 'px', top: ${y} + 'px', transform: ${x} > el.parentElement.clientWidth / 2 ? ${flipped} : ${normal}}`,
    style: "display: none;",
  };
}

/** Zeiger-Position relativ zum Container (statt evt.offsetX, das bei SVG-Elementen je nach Browser anders bezogen ist) */
const POINTER_X = "evt.clientX - el.closest('[data-chart]').getBoundingClientRect().left";
const POINTER_Y = "evt.clientY - el.closest('[data-chart]').getBoundingClientRect().top";

/**
 * Handler der Hitbox eines Datenpunkts: mouseenter setzt Position, Label und Werte und zeigt den Tooltip,
 * mousemove führt die Position nach, mouseleave blendet ihn aus.
 */
export function buildTooltipHandlers(id: string, label: string, values: string[]): HtmlAttributes {
  const signals = chartSignals(id);
  const position = [signals.set("x", POINTER_X), signals.set("y", POINTER_Y)].join("; ");
  const enter = [
    position,
    signals.set("label", jsLiteral(label)),
    signals.set("values", jsLiteral(values)),
    signals.set("show", "true"),
  ].join("; ");
  return {
    "data-on:mouseenter": enter,
    "data-on:mousemove": position,
    "data-on:mouseleave": signals.set("show", "false"),
  };
}

/** data-text-Expression für den Wert der Serie mit dem Index `index` */
export function buildTooltipValueText(id: string, index: number): string {
  return `${chartSignals(id).signal("values")}[${index}] ?? ''`;
}

/* ------------------------------------------------------------------ */
/* Farben (ChartStyle)                                                 */
/* ------------------------------------------------------------------ */

/**
 * CSS mit `--color-<key>` je Farbmodus, begrenzt auf den Container (`[data-chart="chart-<id>"]`).
 * Werte, die nicht in SAFE_CSS_VALUE passen, werden verworfen (kein Ausbruch aus dem style-Element).
 */
export function buildChartCss(id: string, config: ChartConfig): string {
  const entries = Object.entries(config).filter(([, item]) => item.theme ?? item.color);
  if (entries.length === 0) return "";

  const selector = `[data-chart="chart-${chartId(id)}"]`;
  const rules: string[] = [];

  for (const theme of Object.keys(THEMES) as ChartThemeName[]) {
    const declarations: string[] = [];
    for (const [key, item] of entries) {
      const color = item.theme?.[theme] ?? item.color;
      if (color && isSafeCssValue(color)) declarations.push(`  --color-${chartKey(key)}: ${color};`);
    }
    if (declarations.length > 0) {
      rules.push(`${THEMES[theme]} ${selector} {\n${declarations.join("\n")}\n}`);
    }
  }
  return rules.join("\n");
}

/* ------------------------------------------------------------------ */
/* Geometrie                                                           */
/* ------------------------------------------------------------------ */

/** Plot-Bereich mit Standard-Abständen, je nach sichtbaren Achsen */
function resolveMargin(args: CartesianChartArgs, showX: boolean, showY: boolean): ChartMargin {
  return {
    top: args.margin?.top ?? 12,
    right: args.margin?.right ?? 12,
    bottom: args.margin?.bottom ?? (showX ? 28 : 12),
    left: args.margin?.left ?? (showY ? 44 : 12),
  };
}

/** Indizes der X-Beschriftungen: alle, oder jeder n-te, wenn es mehr als `maxTicks` Datenpunkte gibt */
function resolveXTickIndices(count: number, maxTicks: number): number[] {
  const every = Math.max(1, Math.ceil(count / Math.max(1, maxTicks)));
  const indices: number[] = [];
  for (let i = 0; i < count; i += every) indices.push(i);
  return indices;
}

/**
 * Berechnet Skalen und Maße eines kartesischen Charts vollständig auf dem Server.
 * Jede Kategorie bekommt eine gleich breite Spalte (Mitte = Punkt bzw. Balkengruppe, ganze Spalte = Hitbox).
 */
export function computeCartesianLayout(args: CartesianChartArgs): CartesianLayout {
  const width = args.width ?? DEFAULT_CHART_WIDTH;
  const height = args.height ?? DEFAULT_CHART_HEIGHT;
  const showX = args.showXAxis ?? true;
  const showY = args.showYAxis ?? false;
  const margin = resolveMargin(args, showX, showY);
  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);
  const keys = resolveSeries(args.config, args.series);
  const count = args.data.length;
  const step = count > 0 ? innerWidth / count : innerWidth;

  let min = 0;
  let max = 0;
  for (const datum of args.data) {
    for (const key of keys) {
      const value = toNumber(datum[key]);
      if (value === null) continue;
      if (value < min) min = value;
      if (value > max) max = value;
    }
  }
  if (min === max) max = min + 1;

  const tickCount = args.yTickCount ?? DEFAULT_Y_TICK_COUNT;
  const y = scaleLinear()
    .domain(args.yDomain ?? [min, max])
    .range([innerHeight, 0]);
  if (!args.yDomain) y.nice(tickCount);

  const [d0, d1] = y.domain() as [number, number];
  const zero = y(Math.min(Math.max(0, d0), d1));

  return {
    width,
    height,
    margin,
    innerWidth,
    innerHeight,
    keys,
    step,
    xStart: (index) => index * step,
    xCenter: (index) => index * step + step / 2,
    y,
    zero,
    yTicks: y.ticks(tickCount),
    xTickIndices: resolveXTickIndices(count, args.xMaxTicks ?? DEFAULT_X_MAX_TICKS),
  };
}
