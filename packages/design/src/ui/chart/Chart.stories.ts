import type { Meta, StoryObj } from "@storybook/html-vite";

import {
    AreaChart,
    BarChart,
    ChartContainer,
    ChartLegendContent,
    ChartTooltip,
    LineChart,
} from "./Chart";
import type { ChartConfig, ChartCurve, ChartDatum, ChartIndicator } from "./Chart.types";

type ChartKind = "bar" | "line" | "area";

interface ChartStoryArgs {
  id: string;
  type: ChartKind;
  /** Beide Serien (Desktop und Mobile) statt nur Desktop */
  multiple: boolean;
  curve: ChartCurve;
  dots: boolean;
  radius: number;
  fillOpacity: number;
  showGrid: boolean;
  showXAxis: boolean;
  showYAxis: boolean;
  tooltip: boolean;
  indicator: ChartIndicator;
  hideLabel: boolean;
  hideIndicator: boolean;
  legend: boolean;
}

const kinds: ChartKind[] = ["bar", "line", "area"];
const curves: ChartCurve[] = ["linear", "monotone", "natural", "step"];
const indicators: ChartIndicator[] = ["dot", "line", "dashed"];

/** Daten wie in den Docs von shadcn/ui */
const chartData: ChartDatum[] = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

/** Die Fallback-Farben greifen, falls --chart-1 und --chart-2 im Theme nicht definiert sind */
const chartConfig: ChartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1, #2563eb)" },
  mobile: { label: "Mobile", color: "var(--chart-2, #60a5fa)" },
};

const shortMonth = (value: string): string => value.slice(0, 3);

/** Baut Container, SVG, Tooltip und Legende wie in den Docs: `ChartContainer` mit den Teilen als Kinder */
function renderChart(args: ChartStoryArgs, config: ChartConfig = chartConfig): string {
  const series = args.multiple ? ["desktop", "mobile"] : ["desktop"];
  const common = {
    id: args.id,
    config,
    data: chartData,
    xKey: "month",
    series,
    showGrid: args.showGrid,
    showXAxis: args.showXAxis,
    showYAxis: args.showYAxis,
    tooltip: args.tooltip,
    xTickFormatter: shortMonth,
    label: "Besucher pro Monat",
  };

  const svg =
    args.type === "line"
      ? LineChart({ ...common, curve: args.curve, dots: args.dots })
      : args.type === "area"
        ? AreaChart({ ...common, curve: args.curve, dots: args.dots, fillOpacity: args.fillOpacity })
        : BarChart({ ...common, radius: args.radius });

  const tooltip = args.tooltip
    ? ChartTooltip({
        id: args.id,
        config,
        series,
        indicator: args.indicator,
        hideLabel: args.hideLabel,
        hideIndicator: args.hideIndicator,
      })
    : "";

  const legend = args.legend ? ChartLegendContent({ config, series }) : "";

  return ChartContainer({ id: args.id, config, class: "w-full max-w-xl", children: [svg, tooltip, legend] });
}

const defaults: ChartStoryArgs = {
  id: "chart-playground",
  type: "bar",
  multiple: true,
  curve: "monotone",
  dots: false,
  radius: 4,
  fillOpacity: 0.4,
  showGrid: true,
  showXAxis: true,
  showYAxis: false,
  tooltip: true,
  indicator: "dot",
  hideLabel: false,
  hideIndicator: false,
  legend: false,
};

const hono = [
  "```ts",
  "// apps/web: Route, die das SVG jede Sekunde neu rendert und per SSE pusht",
  "app.get(\"/charts/live\", (c) =>",
  "  streamSSE(c, async (stream) => {",
  "    while (!stream.aborted) {",
  "      const svg = LineChart({ id: \"live-chart\", config, data: nextWindow(), xKey: \"time\" });",
  "      await stream.writeSSE({ event: \"datastar-patch-elements\", data: `elements ${svg}` });",
  "      await stream.sleep(1000);",
  "    }",
  "  }),",
  ");",
  "```",
  "",
  "```html",
  "<!-- Seite: der Container bleibt stehen, nur das SVG wird per id gemorpht -->",
  "<div data-init=\"@get('/charts/live')\">${ChartContainer({ id: \"live-chart\", config, children: [placeholderSvg, ChartTooltip({ id: \"live-chart\", config })] })}</div>",
  "```",
].join("\n");

const meta: Meta<ChartStoryArgs> = {
  title: "UI-Library/Chart",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Echtzeit-fähige Charts ohne Client-Library. Port von shadcn/ui (Base), das auf Recharts aufbaut. Hier berechnet der Server Skalen und Pfade (d3-scale, d3-shape), rendert ein `<svg>` mit fester `id` und `viewBox` und pusht Updates per SSE; Datastar morpht nur die geänderten Attribute (`d`, `y`, `height`, `cx`, `cy`), die Animation übernehmen CSS-Transitions.",
          "",
          "Der Tooltip funktioniert nur mit geladenem Datastar. Die Übergänge auf `d` laufen in Chromium und Firefox, Safari springt direkt zum neuen Wert. Die Farben kommen aus `--chart-1` bis `--chart-5` (die Stories nutzen Fallback-Werte).",
          "",
          "Aufbau wie in shadcn: `ChartContainer` (Farben, Signale) mit `LineChart`, `AreaChart` oder `BarChart`, `ChartTooltip` und optional `ChartLegendContent` als Kindern. `series` muss bei Chart, Tooltip und Legende gleich sein.",
          "",
          hono,
        ].join("\n"),
      },
    },
  },
  argTypes: {
    id: { control: "text" },
    type: { control: "select", options: kinds },
    multiple: { control: "boolean" },
    curve: { control: "select", options: curves, if: { arg: "type", neq: "bar" } },
    dots: { control: "boolean", if: { arg: "type", neq: "bar" } },
    radius: { control: { type: "number", min: 0, max: 12 }, if: { arg: "type", eq: "bar" } },
    fillOpacity: { control: { type: "range", min: 0, max: 1, step: 0.05 }, if: { arg: "type", eq: "area" } },
    showGrid: { control: "boolean" },
    showXAxis: { control: "boolean" },
    showYAxis: { control: "boolean" },
    tooltip: { control: "boolean" },
    indicator: { control: "select", options: indicators },
    hideLabel: { control: "boolean" },
    hideIndicator: { control: "boolean" },
    legend: { control: "boolean" },
  },
  args: defaults,
  render: (args) => renderChart(args),
};

export default meta;
type Story = StoryObj<ChartStoryArgs>;

export const Playground: Story = {};

/** Balkendiagramm mit einer Serie */
export const Bar: Story = {
  args: { id: "chart-bar", type: "bar", multiple: false },
};

/** Zwei Serien nebeneinander gruppiert, mit Legende */
export const BarMultiple: Story = {
  args: { id: "chart-bar-multiple", type: "bar", multiple: true, legend: true },
};

/** Liniendiagramm; die Punkte erscheinen beim Hover über einer Spalte */
export const Line: Story = {
  args: { id: "chart-line", type: "line", multiple: false, curve: "natural" },
};

/** Mit `dots: true` sind die Punkte dauerhaft sichtbar und wachsen beim Hover */
export const LineWithDots: Story = {
  args: { id: "chart-line-dots", type: "line", multiple: true, curve: "linear", dots: true, legend: true },
};

/** Flächendiagramm (nicht gestapelt), `fillOpacity` steuert die Deckkraft */
export const Area: Story = {
  args: { id: "chart-area", type: "area", multiple: true, curve: "monotone", legend: true },
};

/** Y-Achse mit eigener Beschriftung und senkrechtes Gitter */
export const Axes: Story = {
  render: () =>
    ChartContainer({
      id: "chart-axes",
      config: chartConfig,
      class: "w-full max-w-xl",
      children: [
        LineChart({
          id: "chart-axes",
          config: chartConfig,
          data: chartData,
          xKey: "month",
          series: ["desktop"],
          showYAxis: true,
          showVerticalGrid: true,
          yTickFormatter: (value) => `${value} Besucher`,
          margin: { left: 80 },
          xTickFormatter: shortMonth,
        }),
        ChartTooltip({ id: "chart-axes", config: chartConfig, series: ["desktop"] }),
      ],
    }),
};

/** Indikatoren des Tooltips: Punkt, Linie, gestrichelt, jeweils mit einer Serie (Label wandert neben den Wert) und ohne Indikator */
export const TooltipIndicators: Story = {
  render: () => {
    const variants: Array<{ id: string; label: string; indicator: ChartIndicator; hideIndicator?: boolean; hideLabel?: boolean }> = [
      { id: "chart-indicator-dot", label: "dot", indicator: "dot" },
      { id: "chart-indicator-line", label: "line", indicator: "line" },
      { id: "chart-indicator-dashed", label: "dashed", indicator: "dashed" },
      { id: "chart-indicator-none", label: "ohne Indikator und Label", indicator: "dot", hideIndicator: true, hideLabel: true },
    ];
    return `<div class="grid w-full max-w-3xl gap-6 md:grid-cols-2">${variants
      .map(
        (variant) =>
          `<div class="grid gap-2"><span class="text-sm font-medium">${variant.label}</span>${renderChart({
            ...defaults,
            id: variant.id,
            multiple: variant.indicator === "dot" && !variant.hideIndicator,
            indicator: variant.indicator,
            hideIndicator: variant.hideIndicator ?? false,
            hideLabel: variant.hideLabel ?? false,
          })}</div>`,
      )
      .join("")}</div>`;
  },
};

/** Legende unter dem Chart (oder darüber, wenn sie vor dem SVG steht und `verticalAlign: "top"` hat) */
export const Legend: Story = {
  args: { id: "chart-legend", type: "bar", multiple: true, legend: true },
};

/** Farben pro Farbmodus über `theme`; im Dark Mode (Klasse `.dark`) gelten die hellen Töne */
export const Theming: Story = {
  render: () =>
    renderChart(
      { ...defaults, id: "chart-theming", multiple: true, legend: true },
      {
        desktop: { label: "Desktop", theme: { light: "#1d4ed8", dark: "#93c5fd" } },
        mobile: { label: "Mobile", theme: { light: "#be123c", dark: "#fda4af" } },
      },
    ),
};

/** Kopfzeile aus der Config: `labelKey` zeigt das Label eines Config-Eintrags statt des Monats */
export const TooltipLabelKey: Story = {
  render: () =>
    ChartContainer({
      id: "chart-label-key",
      config: { ...chartConfig, visitors: { label: "Seitenaufrufe", color: "var(--chart-3, #64748b)" } },
      class: "w-full max-w-xl",
      children: [
        BarChart({ id: "chart-label-key", config: chartConfig, data: chartData, xKey: "month", series: ["desktop"], xTickFormatter: shortMonth }),
        ChartTooltip({
          id: "chart-label-key",
          config: { ...chartConfig, visitors: { label: "Seitenaufrufe" } },
          series: ["desktop"],
          labelKey: "visitors",
          indicator: "line",
        }),
      ],
    }),
};

/** Werte mit Währung: das Dollarzeichen im Tooltip-Wert darf Datastar nicht als Signal deuten */
export const ValueFormatter: Story = {
  render: () =>
    ChartContainer({
      id: "chart-format",
      config: chartConfig,
      class: "w-full max-w-xl",
      children: [
        BarChart({
          id: "chart-format",
          config: chartConfig,
          data: chartData,
          xKey: "month",
          series: ["desktop"],
          xTickFormatter: shortMonth,
          labelFormatter: (value) => `${value} 2026`,
          valueFormatter: (value) => `$${value.toLocaleString("en-US")}.00`,
        }),
        ChartTooltip({ id: "chart-format", config: chartConfig, series: ["desktop"] }),
      ],
    }),
};

/* ------------------------------------------------------------------ */
/* Live-Simulation                                                     */
/* ------------------------------------------------------------------ */

/**
 * Überträgt geänderte Attribute und Texte von `source` auf `target` (gleiche Struktur vorausgesetzt).
 * Ersetzt in der Story den Server-Push: Datastar würde dasselbe per Idiomorph erledigen. Die Elemente bleiben
 * erhalten, deshalb laufen die CSS-Transitions.
 */
function patchTree(target: Element, source: Element): void {
  for (const attribute of Array.from(source.attributes)) {
    if (target.getAttribute(attribute.name) !== attribute.value) target.setAttribute(attribute.name, attribute.value);
  }
  if (source.children.length === 0) {
    if (target.textContent !== source.textContent) target.textContent = source.textContent;
    return;
  }
  const count = Math.min(target.children.length, source.children.length);
  for (let i = 0; i < count; i += 1) {
    const targetChild = target.children[i];
    const sourceChild = source.children[i];
    if (targetChild && sourceChild) patchTree(targetChild, sourceChild);
  }
}

/**
 * Simuliert den SSE-Strom: jede Sekunde rutscht das Fenster um einen Punkt weiter, das SVG wird neu gerendert
 * und in das bestehende SVG gemorpht. Der Tooltip bleibt dabei per Datastar bedienbar.
 */
export const Live: Story = {
  render: () => {
    const id = "chart-live";
    const config: ChartConfig = { load: { label: "Auslastung", color: "var(--chart-1, #2563eb)" } };
    const size = 12;
    let second = 0;
    let value = 50;

    const next = (): ChartDatum => {
      second += 1;
      value = Math.min(95, Math.max(5, value + Math.round((Math.random() - 0.5) * 30)));
      return { time: `${second}s`, load: value };
    };

    let data: ChartDatum[] = Array.from({ length: size }, next);
    const build = (): string =>
      AreaChart({
        id,
        config,
        data,
        xKey: "time",
        series: ["load"],
        curve: "monotone",
        yDomain: [0, 100],
        showYAxis: true,
        yTickFormatter: (tick) => `${tick} %`,
        valueFormatter: (point) => `${point} %`,
        xMaxTicks: 6,
        label: "Auslastung der letzten zwölf Sekunden",
      });

    const root = document.createElement("div");
    root.innerHTML = ChartContainer({
      id,
      config,
      class: "w-full max-w-xl",
      children: [build(), ChartTooltip({ id, config, series: ["load"] })],
    });

    let wasConnected = false;
    const timer = window.setInterval(() => {
      if (root.isConnected) wasConnected = true;
      else if (wasConnected) {
        window.clearInterval(timer);
        return;
      }
      data = [...data.slice(1), next()];
      const template = document.createElement("template");
      template.innerHTML = build();
      const fresh = template.content.firstElementChild;
      const current = root.querySelector(`#${id}`);
      if (fresh && current) patchTree(current, fresh);
    }, 1000);

    return root;
  },
};
