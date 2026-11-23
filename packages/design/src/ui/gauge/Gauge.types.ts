import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Zustand des Gauges: ohne Wert, in Bearbeitung oder vollständig (value === max) */
export type GaugeState = "indeterminate" | "loading" | "complete";

/** Formatiert den angezeigten Text (Standard: Prozentwert ohne Einheit) */
export type GaugeValueTextFormatter = (value: number, min: number, max: number) => string;

/** Werte, aus denen der Root die gemeinsame Geometrie berechnet */
export interface GaugeOptions {
  /** Aktueller Wert. `null`/`undefined` ergibt den Zustand "indeterminate". Werte ausserhalb von min/max werden begrenzt */
  value?: number | null;
  /** Formatiert den Text, den GaugeValueText anzeigt (Standard: gerundeter Prozentwert) */
  getValueText?: GaugeValueTextFormatter;
  /** Untergrenze (Standard: 0) */
  min?: number;
  /** Obergrenze, muss grösser als 0 sein (Standard: 100). Ist max <= min, gilt min + 1 */
  max?: number;
  /** Kantenlänge des quadratischen SVG in Pixeln (Standard: 120) */
  size?: number;
  /** Strichstärke in Pixeln, sollte kleiner als size sein (Standard: 8) */
  thickness?: number;
  /** Startwinkel in Grad, 0 liegt oben, im Uhrzeigersinn (Standard: 0) */
  startAngle?: number;
  /** Endwinkel in Grad; muss grösser als startAngle sein, die Differenz wird auf 360 begrenzt (Standard: 360) */
  endAngle?: number;
}

/** Vermerkt, welche Teile gerendert wurden, damit der Root nur auf vorhandene IDs verweist */
export interface GaugeUsage {
  /** GaugeLabel wurde gerendert (aria-labelledby am Root) */
  label: boolean;
  /** GaugeValueText wurde gerendert (aria-describedby am Root) */
  valueText: boolean;
}

/**
 * Gemeinsame, berechnete Werte aller Teile (Ersatz für den React-Context der Vorlage).
 * Wird vom Root erzeugt und der Children-Funktion übergeben.
 */
export interface GaugeContext {
  value: number | null;
  valueText: string | undefined;
  min: number;
  max: number;
  state: GaugeState;
  /** Radius der Mittellinie des Bogens (size - thickness) / 2 */
  radius: number;
  thickness: number;
  size: number;
  /** Mittelpunkt (x und y) des SVG */
  center: number;
  /** Anteil zwischen 0 und 1, `null` im Zustand "indeterminate" */
  percentage: number | null;
  startAngle: number;
  endAngle: number;
  /** Länge des Bogens (Grundlage für stroke-dasharray) */
  arcLength: number;
  /** Y-Mitte der sichtbaren Bogenfläche (Position des Werttexts) */
  arcCenterY: number;
  ids: {
    label: string;
    valueText: string;
  };
  usage: GaugeUsage;
}

export interface GaugeArgs extends GaugeOptions {
  /** Basis für die IDs von Label und Werttext (`<id>-label`, `<id>-value-text`). Wird nur gerendert, wenn gesetzt. Ohne Angabe wird eine Zufalls-ID erzeugt */
  id?: string;
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Inhalt. Als Funktion erhält er den Context, den die Teile (Indicator, Track, ...) benötigen */
  children?: Children | ((context: GaugeContext) => Children);
}

export interface GaugeIndicatorArgs {
  /** Context des umgebenden Gauges */
  context: GaugeContext;
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute */
  attributes?: HtmlAttributes;
  /** Inhalt des SVG (GaugeTrack und GaugeRange) */
  children?: Children;
}

export interface GaugeTrackArgs {
  /** Context des umgebenden Gauges */
  context: GaugeContext;
  /** Zusätzliche CSS-Klassen, z. B. eigene Farbe ("text-blue-200") */
  class?: string;
  /** Zusätzliche HTML-Attribute */
  attributes?: HtmlAttributes;
}

export interface GaugeRangeArgs {
  /** Context des umgebenden Gauges */
  context: GaugeContext;
  /** Zusätzliche CSS-Klassen, z. B. eigene Farbe ("text-blue-500") */
  class?: string;
  /** Zusätzliche HTML-Attribute */
  attributes?: HtmlAttributes;
}

export interface GaugeValueTextArgs {
  /** Context des umgebenden Gauges */
  context: GaugeContext;
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute; ein `style` wird hinter die berechnete Position (`top`) gesetzt und kann sie überschreiben */
  attributes?: HtmlAttributes;
  /** Eigener Inhalt (roher HTML-String). Ohne Angabe wird der formatierte Wert angezeigt */
  children?: Children;
}

export interface GaugeLabelArgs {
  /** Context des umgebenden Gauges */
  context: GaugeContext;
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute */
  attributes?: HtmlAttributes;
  /** Text des Labels */
  children?: Children;
}

export interface GaugeCombinedArgs extends Omit<GaugeArgs, "children"> {
  /** Optionales Label unterhalb des Gauges (Text, wird escaped) */
  label?: string;
}
