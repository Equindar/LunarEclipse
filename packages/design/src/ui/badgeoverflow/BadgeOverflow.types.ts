import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Liefert das Label eines Eintrags. */
export interface GetBadgeLabel<T> {
  /**
   * Liefert den Label-Text je Eintrag.
   * Optional bei primitiven Arrays (string, number), erforderlich bei Arrays von Objekten.
   * @example getBadgeLabel: (item) => item.name
   */
  getBadgeLabel: (item: T) => string;
}

/**
 * Argumente des Badge-Overflows.
 * Bei Objekten ist `getBadgeLabel` Pflicht, bei primitiven Werten optional (dann gilt `String(item)`).
 */
export type BadgeOverflowArgs<T = string> = (T extends object ? GetBadgeLabel<T> : Partial<GetBadgeLabel<T>>) & {
  /** Alle Einträge. Welche davon sichtbar sind, entscheidet der Browser anhand der verfügbaren Breite */
  items: T[];
  /** Anzahl der Zeilen, die höchstens angezeigt werden (Standard: 1) */
  lineCount?: number;
  /**
   * Rendert ein Badge als HTML-String.
   * `label` ist bereits HTML-escaped und darf direkt als Text verwendet werden (nicht erneut escapen).
   */
  renderBadge: (item: T, label: string) => string;
  /**
   * Rendert den Überlauf-Indikator als HTML-String (Standard: "+N").
   * Der Parameter `count` ist (anders als in der Vorlage) kein number, sondern das HTML des Zählers
   * (ein `<span>`, dessen Text der Browser aktualisiert). Es muss genau einmal im Markup stehen.
   * @example renderOverflow: (count) => Badge({ variant: "secondary", children: ["+", count, " weitere"] })
   */
  renderOverflow?: (count: string) => string;
  /** HTML-Tag des Wurzelelements (Ersatz für die render-Prop der Vorlage, Standard: "div") */
  tag?: string;
  /** Zusätzliche CSS-Klassen für das Wurzelelement (z. B. Padding, Rahmen, eigener Abstand "gap-2") */
  class?: string;
  /**
   * Zusätzliche HTML-Attribute des Wurzelelements. `data-slot` ersetzt den Standardwert,
   * `data-init` und `data-measured` werden von der Komponente überschrieben.
   */
  attributes?: HtmlAttributes;
};
