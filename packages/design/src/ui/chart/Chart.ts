import { scaleBand } from "d3-scale";
import { area, curveLinear, curveMonotoneX, curveNatural, curveStep, line, type CurveFactory } from "d3-shape";

import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import {
    buildChartCss,
    buildChartRootAttributes,
    buildTooltipHandlers,
    buildTooltipOverlayAttributes,
    buildTooltipValueText,
    chartColorVar,
    chartId,
    chartKey,
    chartSignals,
    computeCartesianLayout,
    isSafeCssValue,
    resolveSeries,
    round2,
    toNumber,
} from "./Chart.expressions";
import type {
    AreaChartArgs,
    BarChartArgs,
    CartesianChartArgs,
    CartesianLayout,
    ChartContainerArgs,
    ChartCurve,
    ChartDatum,
    ChartLegendContentArgs,
    ChartStyleArgs,
    ChartTooltipArgs,
    ChartTooltipContentArgs,
    LineChartArgs,
} from "./Chart.types";

/*
 * Port von shadcn/ui Chart (Base). Die Quelle baut auf Recharts auf. Hier gibt es keine Client-Library:
 * Geometrie und Pfade berechnet der Server (d3-scale, d3-shape), der Client morpht das SVG per Datastar.
 * Die Klassen der Quelle (cn-chart-tooltip aus dem Style "vega") sind aufgelöst, die Recharts-Selektoren entfallen,
 * ihre Wirkung steckt direkt in den Klassen der SVG-Elemente.
 */

/** Container: Flex-Spalte, damit eine Legende unter dem SVG Platz bekommt (Quelle: Zeile ohne Legenden-Platz) */
const chartTw = tw`relative flex aspect-video flex-col justify-center text-xs`;
const chartSvgTw = tw`min-h-0 w-full flex-1`;
const chartTooltipOverlayTw = tw`pointer-events-none absolute top-0 left-0 z-10`;
const chartTooltipTw = tw`grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl`;
const chartTooltipRowTw = tw`flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground`;
const chartTooltipIndicatorTw = tw`shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)`;
const chartTooltipValueTw = tw`font-mono font-medium text-foreground tabular-nums`;
const chartLegendTw = tw`flex items-center justify-center gap-4`;
const chartLegendItemTw = tw`flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground`;

/** Übergänge der geometrischen Attribute: Datastar morpht nur die Werte, die Animation ist reines CSS */
const chartMotionTw = tw`transition-[d,x,y,width,height] duration-300 ease-out motion-reduce:transition-none`;
const chartDotTw = tw`origin-center [transform-box:fill-box] transition-[cx,cy,scale] duration-300 ease-out motion-reduce:transition-none`;
const chartGridTw = tw`stroke-border/50`;
const chartAxisTextTw = tw`fill-muted-foreground`;
const chartCrosshairTw = tw`stroke-border opacity-0 transition-opacity group-hover/point:opacity-100`;
const chartCursorTw = tw`fill-muted opacity-0 transition-opacity group-hover/point:opacity-100`;

const curves: Record<ChartCurve, CurveFactory> = {
  linear: curveLinear,
  monotone: curveMonotoneX,
  natural: curveNatural,
  step: curveStep,
};

/* ------------------------------------------------------------------ */
/* Container, Style, Tooltip, Legende                                  */
/* ------------------------------------------------------------------ */

/** `<style>` mit den Farb-Variablen `--color-<key>` für light und dark; leer, wenn die Config keine Farben hat */
export function ChartStyle(args: ChartStyleArgs): string {
  const css = buildChartCss(args.id, args.config);
  return css === "" ? "" : `<style>${css}</style>`;
}

/**
 * Container des Charts: hält Farb-Variablen und die Tooltip-Signale.
 * Das Chart-SVG wird als Kind übergeben und per SSE einzeln aktualisiert, der Container bleibt stehen.
 */
export function ChartContainer(args: ChartContainerArgs): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildChartRootAttributes(args.id),
    class: cn(chartTw, args.class),
  };
  return `<div${renderAttributes(attrs)}>${ChartStyle({ id: args.id, config: args.config })}${renderChildren(args.children)}</div>`;
}

/** Farbwert für den Indikator: eigener Wert nur, wenn er als CSS-Wert unbedenklich ist */
function indicatorColorOf(color: string | undefined, key: string): string {
  return color !== undefined && isSafeCssValue(color) ? color : chartColorVar(key);
}

/**
 * Inhalt des Tooltips (Karte mit Kopfzeile und je einer Zeile pro Serie).
 * Die Werte kommen zur Laufzeit per data-text aus den Signalen `label` und `values`.
 */
export function ChartTooltipContent(args: ChartTooltipContentArgs): string {
  const keys = resolveSeries(args.config, args.series);
  const indicator = args.indicator ?? "dot";
  const signals = chartSignals(args.id);
  const nestLabel = keys.length === 1 && indicator !== "dot";

  let labelHtml = "";
  if (!args.hideLabel) {
    const labelAttrs: HtmlAttributes = { class: cn("font-medium", args.labelClass) };
    if (args.labelKey !== undefined) {
      // Quelle: mit labelKey dient das Label aus der Config als Kopfzeile, ohne Eintrag entfällt die Kopfzeile
      const text = args.config[args.labelKey]?.label;
      if (text) labelHtml = `<div${renderAttributes(labelAttrs)}>${escapeHtml(text)}</div>`;
    } else {
      labelAttrs["data-text"] = signals.signal("label");
      labelHtml = `<div${renderAttributes(labelAttrs)}></div>`;
    }
  }

  const rows = keys
    .map((key, index) => {
      const itemConfig = args.config[key];
      const color = indicatorColorOf(args.color, key);

      let indicatorHtml = "";
      if (itemConfig?.icon) {
        indicatorHtml = itemConfig.icon;
      } else if (!args.hideIndicator) {
        const indicatorAttrs: HtmlAttributes = {
          class: cn(chartTooltipIndicatorTw, {
            "h-2.5 w-2.5": indicator === "dot",
            "w-1": indicator === "line",
            "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
            "my-0.5": nestLabel && indicator === "dashed",
          }),
          style: `--color-bg: ${color}; --color-border: ${color};`,
        };
        indicatorHtml = `<div${renderAttributes(indicatorAttrs)}></div>`;
      }

      const valueAttrs: HtmlAttributes = {
        class: chartTooltipValueTw,
        "data-text": buildTooltipValueText(args.id, index),
      };

      return (
        `<div${renderAttributes({ class: cn(chartTooltipRowTw, indicator === "dot" && "items-center") })}>` +
        indicatorHtml +
        `<div${renderAttributes({ class: cn("flex flex-1 justify-between leading-none", nestLabel ? "items-end" : "items-center") })}>` +
        `<div class="grid gap-1.5">${nestLabel ? labelHtml : ""}<span class="text-muted-foreground">${escapeHtml(itemConfig?.label ?? key)}</span></div>` +
        `<span${renderAttributes(valueAttrs)}></span>` +
        `</div></div>`
      );
    })
    .join("");

  const attrs: HtmlAttributes = {
    "data-slot": "chart-tooltip-content",
    class: cn(chartTooltipTw, args.class),
  };
  return `<div${renderAttributes(attrs)}>${nestLabel ? "" : labelHtml}<div class="grid gap-1.5">${rows}</div></div>`;
}

/**
 * Tooltip-Overlay: ein HTML-`<div>` außerhalb des SVG, gesteuert über die Signale des Charts.
 * Gehört als direktes Kind in den `ChartContainer`.
 */
export function ChartTooltip(args: ChartTooltipArgs): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildTooltipOverlayAttributes(args.id),
    class: chartTooltipOverlayTw,
  };
  const content = args.children !== undefined ? renderChildren(args.children) : ChartTooltipContent(args);
  return `<div${renderAttributes(attrs)}>${content}</div>`;
}

/** Legende (Farbfeld oder Icon plus Label je Serie), gehört als Kind in den `ChartContainer` */
export function ChartLegendContent(args: ChartLegendContentArgs): string {
  const keys = resolveSeries(args.config, args.series);
  const items = keys
    .map((key) => {
      const itemConfig = args.config[key];
      const marker =
        itemConfig?.icon && !args.hideIcon
          ? itemConfig.icon
          : `<div class="h-2 w-2 shrink-0 rounded-xs" style="background-color: ${escapeHtml(chartColorVar(key))};"></div>`;
      return `<div class="${chartLegendItemTw}">${marker}${escapeHtml(itemConfig?.label ?? key)}</div>`;
    })
    .join("");

  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "chart-legend",
    class: cn(chartLegendTw, args.verticalAlign === "top" ? "pb-3" : "pt-3", args.class),
  };
  return `<div${renderAttributes(attrs)}>${items}</div>`;
}

/* ------------------------------------------------------------------ */
/* SVG-Bausteine                                                       */
/* ------------------------------------------------------------------ */

function svgTag(tag: string, attrs: HtmlAttributes, children = ""): string {
  return `<${tag}${renderAttributes(attrs)}>${children}</${tag}>`;
}

/** Text der X-Achse und der Kopfzeile: Wert als Text, `null`/`undefined` als leerer String */
function categoryOf(datum: ChartDatum, xKey: string): string {
  const value = datum[xKey];
  return value === null || value === undefined ? "" : String(value);
}

/** Kopfzeile des Tooltips: labelFormatter, sonst Label aus der Config (wie die Quelle), sonst der Wert */
function tooltipLabelOf(args: CartesianChartArgs, datum: ChartDatum): string {
  const raw = categoryOf(datum, args.xKey);
  if (args.labelFormatter) return args.labelFormatter(raw, datum);
  return args.config[raw]?.label ?? raw;
}

/** Formatierte Werte aller Serien eines Datenpunkts (leer bei Lücken) */
function tooltipValuesOf(args: CartesianChartArgs, keys: string[], datum: ChartDatum): string[] {
  return keys.map((key) => {
    const value = toNumber(datum[key]);
    if (value === null) return "";
    return args.valueFormatter ? args.valueFormatter(value, key, datum) : value.toLocaleString();
  });
}

function renderGrid(args: CartesianChartArgs, layout: CartesianLayout): string {
  if (!(args.showGrid ?? true) && !args.showVerticalGrid) return "";
  const lines: string[] = [];
  if (args.showGrid ?? true) {
    for (const tick of layout.yTicks) {
      const y = round2(layout.y(tick));
      lines.push(svgTag("line", { x1: 0, x2: round2(layout.innerWidth), y1: y, y2: y, class: chartGridTw }));
    }
  }
  if (args.showVerticalGrid) {
    args.data.forEach((_, index) => {
      const x = round2(layout.xCenter(index));
      lines.push(svgTag("line", { x1: x, x2: x, y1: 0, y2: round2(layout.innerHeight), class: chartGridTw }));
    });
  }
  return svgTag("g", { "data-slot": "chart-grid" }, lines.join(""));
}

function renderXAxis(args: CartesianChartArgs, layout: CartesianLayout): string {
  if (!(args.showXAxis ?? true)) return "";
  const labels = layout.xTickIndices.map((index) => {
    const datum = args.data[index];
    const raw = datum ? categoryOf(datum, args.xKey) : "";
    const text = args.xTickFormatter ? args.xTickFormatter(raw, index) : raw;
    return svgTag(
      "text",
      {
        x: round2(layout.xCenter(index)),
        y: round2(layout.innerHeight + 8),
        dy: "0.71em",
        "text-anchor": "middle",
        class: chartAxisTextTw,
      },
      escapeHtml(text),
    );
  });
  return svgTag("g", { "data-slot": "chart-x-axis" }, labels.join(""));
}

function renderYAxis(args: CartesianChartArgs, layout: CartesianLayout): string {
  if (!(args.showYAxis ?? false)) return "";
  const labels = layout.yTicks.map((tick) => {
    const text = args.yTickFormatter ? args.yTickFormatter(tick) : tick.toLocaleString();
    return svgTag(
      "text",
      { x: -8, y: round2(layout.y(tick)), dy: "0.32em", "text-anchor": "end", class: chartAxisTextTw },
      escapeHtml(text),
    );
  });
  return svgTag("g", { "data-slot": "chart-y-axis" }, labels.join(""));
}

/** Unsichtbare Spalte über die volle Plot-Höhe, steuert den Tooltip über die Signale */
function renderHitbox(args: CartesianChartArgs, layout: CartesianLayout, index: number, datum: ChartDatum): string {
  const cid = chartId(args.id);
  const attrs: HtmlAttributes = {
    id: `${cid}-hit-${index}`,
    "data-slot": "chart-hitbox",
    x: round2(layout.xStart(index)),
    y: 0,
    width: round2(layout.step),
    height: round2(layout.innerHeight),
    fill: "transparent",
    ...buildTooltipHandlers(cid, tooltipLabelOf(args, datum), tooltipValuesOf(args, layout.keys, datum)),
  };
  return svgTag("rect", attrs);
}

/** `<svg>` mit fester id und viewBox, das Plot-Gruppe und Inhalt aufnimmt */
function renderSvg(args: CartesianChartArgs, layout: CartesianLayout, content: string): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    id: chartId(args.id),
    "data-slot": "chart-svg",
    viewBox: `0 0 ${layout.width} ${layout.height}`,
    preserveAspectRatio: "xMidYMid meet",
    class: cn(chartSvgTw, args.class),
  };
  if (args.label) {
    attrs.role = "img";
    attrs["aria-label"] = args.label;
  }
  const plot = svgTag(
    "g",
    { "data-slot": "chart-plot", transform: `translate(${layout.margin.left} ${layout.margin.top})` },
    content,
  );
  return svgTag("svg", attrs, plot);
}

/* ------------------------------------------------------------------ */
/* Line und Area                                                       */
/* ------------------------------------------------------------------ */

interface LinePoint {
  x: number;
  y: number | null;
}

function pointsOf(args: CartesianChartArgs, layout: CartesianLayout, key: string): LinePoint[] {
  return args.data.map((datum, index) => {
    const value = toNumber(datum[key]);
    return { x: layout.xCenter(index), y: value === null ? null : layout.y(value) };
  });
}

function renderLineLike(args: LineChartArgs, filled: boolean, fillOpacity: number): string {
  const layout = computeCartesianLayout(args);
  const cid = chartId(args.id);
  const curve = curves[args.curve ?? "linear"];
  const dots = args.dots ?? false;
  const tooltip = args.tooltip ?? true;

  const lineGen = line<LinePoint>()
    .defined((p) => p.y !== null)
    .x((p) => p.x)
    .y((p) => p.y ?? 0)
    .curve(curve)
    .digits(2);
  const areaGen = area<LinePoint>()
    .defined((p) => p.y !== null)
    .x((p) => p.x)
    .y0(layout.zero)
    .y1((p) => p.y ?? 0)
    .curve(curve)
    .digits(2);

  const series = layout.keys
    .map((key) => {
      const points = pointsOf(args, layout, key);
      const color = chartColorVar(key);
      const parts: string[] = [];
      if (filled) {
        parts.push(
          svgTag("path", {
            id: `${cid}-area-${chartKey(key)}`,
            d: areaGen(points) ?? "",
            fill: color,
            "fill-opacity": fillOpacity,
            stroke: "none",
            class: chartMotionTw,
          }),
        );
      }
      parts.push(
        svgTag("path", {
          id: `${cid}-line-${chartKey(key)}`,
          d: lineGen(points) ?? "",
          fill: "none",
          stroke: color,
          "stroke-width": args.strokeWidth ?? 2,
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          class: chartMotionTw,
        }),
      );
      return parts.join("");
    })
    .join("");

  const showPoints = tooltip || dots;
  const groups = showPoints
    ? args.data
        .map((datum, index) => {
          const cx = round2(layout.xCenter(index));
          const parts: string[] = [];
          if (tooltip) {
            parts.push(
              svgTag("line", {
                id: `${cid}-cross-${index}`,
                x1: cx,
                x2: cx,
                y1: 0,
                y2: round2(layout.innerHeight),
                class: chartCrosshairTw,
              }),
            );
          }
          layout.keys.forEach((key) => {
            const value = toNumber(datum[key]);
            if (value === null) return;
            parts.push(
              svgTag("circle", {
                id: `${cid}-dot-${chartKey(key)}-${index}`,
                cx,
                cy: round2(layout.y(value)),
                r: 4,
                fill: chartColorVar(key),
                class: cn(chartDotTw, dots ? "scale-100 group-hover/point:scale-150" : "scale-0 group-hover/point:scale-100"),
              }),
            );
          });
          if (tooltip) parts.push(renderHitbox(args, layout, index, datum));
          return svgTag("g", { id: `${cid}-point-${index}`, "data-slot": "chart-point", class: "group/point" }, parts.join(""));
        })
        .join("")
    : "";

  return renderSvg(args, layout, renderGrid(args, layout) + series + groups + renderXAxis(args, layout) + renderYAxis(args, layout));
}

/** Liniendiagramm als `<svg>`; wird bei jedem SSE-Update komplett neu gerendert und per id gemorpht */
export function LineChart(args: LineChartArgs): string {
  return renderLineLike(args, false, 0);
}

/** Flächendiagramm als `<svg>` (Fläche plus Linie je Serie, nicht gestapelt) */
export function AreaChart(args: AreaChartArgs): string {
  return renderLineLike(args, true, args.fillOpacity ?? 0.4);
}

/* ------------------------------------------------------------------ */
/* Bar                                                                 */
/* ------------------------------------------------------------------ */

/** Balkendiagramm als `<svg>` (Serien nebeneinander gruppiert) */
export function BarChart(args: BarChartArgs): string {
  const layout = computeCartesianLayout(args);
  const cid = chartId(args.id);
  const tooltip = args.tooltip ?? true;
  const radius = args.radius ?? 4;

  // Je Kategorie bleiben 10 % Abstand links und rechts, die Serien teilen sich den Rest
  const groupPadding = layout.step * 0.1;
  const inner = scaleBand<string>()
    .domain(layout.keys)
    .range([0, layout.step * 0.8])
    .paddingInner(0.1);

  const groups = args.data
    .map((datum, index) => {
      const parts: string[] = [];
      if (tooltip) {
        parts.push(
          svgTag("rect", {
            id: `${cid}-cursor-${index}`,
            x: round2(layout.xStart(index)),
            y: 0,
            width: round2(layout.step),
            height: round2(layout.innerHeight),
            class: chartCursorTw,
          }),
        );
      }
      layout.keys.forEach((key) => {
        const value = toNumber(datum[key]);
        const top = value === null ? layout.zero : Math.min(layout.y(value), layout.zero);
        const barHeight = value === null ? 0 : Math.abs(layout.y(value) - layout.zero);
        parts.push(
          svgTag("rect", {
            id: `${cid}-bar-${chartKey(key)}-${index}`,
            x: round2(layout.xStart(index) + groupPadding + (inner(key) ?? 0)),
            y: round2(top),
            width: round2(inner.bandwidth()),
            height: round2(barHeight),
            rx: radius,
            fill: chartColorVar(key),
            class: chartMotionTw,
          }),
        );
      });
      if (tooltip) parts.push(renderHitbox(args, layout, index, datum));
      return svgTag("g", { id: `${cid}-point-${index}`, "data-slot": "chart-point", class: "group/point" }, parts.join(""));
    })
    .join("");

  return renderSvg(args, layout, renderGrid(args, layout) + groups + renderXAxis(args, layout) + renderYAxis(args, layout));
}
