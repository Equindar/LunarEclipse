import type { ScaleLinear } from "d3-scale";

import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Farbmodus: "light" gilt ohne Klasse, "dark" unter `.dark` */
export type ChartThemeName = "light" | "dark";

/**
 * Eintrag der Chart-Konfiguration (shadcn: ChartConfig).
 * Entweder eine feste `color` oder ein `theme` mit je einer Farbe pro Farbmodus.
 * `icon` ist ein fertiger HTML-String (z. B. ein SVG) und wird ungeprüft eingefügt, nur vertrauenswürdige Quellen verwenden.
 */
export type ChartConfigItem = {
  label?: string;
  icon?: string;
} & (
  | { color?: string; theme?: never }
  | { color?: never; theme: Record<ChartThemeName, string> }
);

/** Konfiguration der Serien: Schlüssel = Datenschlüssel (z. B. "desktop") */
export type ChartConfig = Record<string, ChartConfigItem>;

/** Ein Datenpunkt, z. B. `{ month: "January", desktop: 186, mobile: 80 }` */
export type ChartDatum = Record<string, string | number | null | undefined>;

/** Darstellung des Farb-Indikators im Tooltip */
export type ChartIndicator = "line" | "dot" | "dashed";

/** Kurvenform für Line- und Area-Charts (d3-shape) */
export type ChartCurve = "linear" | "monotone" | "natural" | "step";

/** Abstände des Plot-Bereichs innerhalb der viewBox */
export interface ChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Datastar-Signale des Tooltips (pro Chart, Namensraum = Chart-id).
 * `values` enthält je Serie (in Reihenfolge von `series`) den bereits formatierten Wert.
 */
export interface ChartTooltipSignals {
  show: boolean;
  x: number;
  y: number;
  label: string;
  values: string[];
}

/** Interne Geometrie eines kartesischen Charts (serverseitig mit d3-scale berechnet) */
export interface CartesianLayout {
  width: number;
  height: number;
  margin: ChartMargin;
  innerWidth: number;
  innerHeight: number;
  /** Aufgelöste Serien-Schlüssel in Darstellungsreihenfolge */
  keys: string[];
  /** Breite einer Kategorie-Spalte */
  step: number;
  /** Linker Rand der Spalte des Datenpunkts */
  xStart: (index: number) => number;
  /** Mitte der Spalte des Datenpunkts */
  xCenter: (index: number) => number;
  y: ScaleLinear<number, number>;
  /** Y-Position der Nulllinie (auf die Domain begrenzt) */
  zero: number;
  yTicks: number[];
  /** Indizes der Datenpunkte, die eine X-Beschriftung bekommen */
  xTickIndices: number[];
}

export interface ChartContainerArgs {
  /** Muss der `id` des Charts (und des Tooltips) im Container entsprechen, sie bildet den Signal-Namensraum */
  id: string;
  /** Konfiguration der Serien (Labels, Icons, Farben) */
  config: ChartConfig;
  /** Zusätzliche CSS-Klassen, z. B. "h-[200px] w-full" */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Inhalt: SVG des Charts, Tooltip, Legende */
  children?: Children;
}

export interface ChartStyleArgs {
  id: string;
  config: ChartConfig;
}

export interface ChartTooltipContentArgs {
  /** id des Charts (Signal-Namensraum) */
  id: string;
  config: ChartConfig;
  /** Serien in derselben Reihenfolge wie im Chart (Standard: alle Schlüssel aus `config`) */
  series?: string[];
  /** Darstellung des Indikators (Standard: "dot") */
  indicator?: ChartIndicator;
  /** Kopfzeile (Label) ausblenden */
  hideLabel?: boolean;
  /** Farb-Indikator ausblenden */
  hideIndicator?: boolean;
  /** Config-Schlüssel, dessen Label statt des X-Werts als Kopfzeile dient */
  labelKey?: string;
  /** Feste Indikator-Farbe statt der Serienfarbe */
  color?: string;
  class?: string;
  labelClass?: string;
}

export interface ChartTooltipArgs extends ChartTooltipContentArgs {
  attributes?: HtmlAttributes;
  /** Eigener Inhalt statt `ChartTooltipContent` */
  children?: Children;
}

export interface ChartLegendContentArgs {
  config: ChartConfig;
  /** Serien in derselben Reihenfolge wie im Chart (Standard: alle Schlüssel aus `config`) */
  series?: string[];
  /** Icons aus der Config nicht anzeigen, nur Farbfeld */
  hideIcon?: boolean;
  /** Abstand passend zur Position der Legende (Standard: "bottom") */
  verticalAlign?: "top" | "bottom";
  class?: string;
  attributes?: HtmlAttributes;
}

/** Formatierer laufen auf dem Server, ihre Ergebnisse landen im SVG bzw. in den Tooltip-Signalen */
export interface ChartFormatters {
  /** Beschriftung der X-Achse (Standard: Wert als Text) */
  xTickFormatter?: (value: string, index: number) => string;
  /** Beschriftung der Y-Achse (Standard: `toLocaleString()`) */
  yTickFormatter?: (value: number) => string;
  /** Kopfzeile des Tooltips (Standard: Label aus `config` oder der X-Wert) */
  labelFormatter?: (value: string, datum: ChartDatum) => string;
  /** Wert im Tooltip (Standard: `toLocaleString()`) */
  valueFormatter?: (value: number, seriesKey: string, datum: ChartDatum) => string;
}

export interface CartesianChartArgs extends ChartFormatters {
  /** Feste id des `<svg>` (Ziel für das Morphing per SSE) und Signal-Namensraum des Tooltips */
  id: string;
  config: ChartConfig;
  data: ChartDatum[];
  /** Schlüssel der Kategorie (X-Achse) */
  xKey: string;
  /** Darzustellende Serien (Standard: alle Schlüssel aus `config`) */
  series?: string[];
  /** Breite der viewBox (Standard: 640) */
  width?: number;
  /** Höhe der viewBox (Standard: 360) */
  height?: number;
  margin?: Partial<ChartMargin>;
  /** Horizontale Gitterlinien (Standard: true) */
  showGrid?: boolean;
  /** Vertikale Gitterlinien (Standard: false) */
  showVerticalGrid?: boolean;
  /** X-Achsen-Beschriftung (Standard: true) */
  showXAxis?: boolean;
  /** Y-Achsen-Beschriftung (Standard: false) */
  showYAxis?: boolean;
  /** Feste Y-Domain, sonst automatisch aus den Daten (inklusive 0) */
  yDomain?: [number, number];
  /** Gewünschte Anzahl Y-Ticks (Standard: 5) */
  yTickCount?: number;
  /** Höchstzahl der X-Beschriftungen, bei mehr Datenpunkten wird ausgedünnt (Standard: 8) */
  xMaxTicks?: number;
  /** Hitboxen, Hover-Effekte und Tooltip-Anbindung rendern (Standard: true) */
  tooltip?: boolean;
  /** Zusätzliche CSS-Klassen am `<svg>` */
  class?: string;
  /** Zusätzliche HTML-Attribute am `<svg>` (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Zugänglicher Name des Charts (aria-label, setzt role="img") */
  label?: string;
}

export interface LineChartArgs extends CartesianChartArgs {
  /** Kurvenform (Standard: "linear") */
  curve?: ChartCurve;
  /** Punkte dauerhaft zeigen; sonst erscheinen sie nur beim Hover (Standard: false) */
  dots?: boolean;
  /** Linienstärke (Standard: 2) */
  strokeWidth?: number;
}

export interface AreaChartArgs extends LineChartArgs {
  /** Deckkraft der Fläche (Standard: 0.4) */
  fillOpacity?: number;
}

export interface BarChartArgs extends CartesianChartArgs {
  /** Eckenradius der Balken (Standard: 4) */
  radius?: number;
}
