import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Farbton einer Log-Zeile */
export type LogEntryTone = "default" | "muted" | "success" | "warning" | "danger";

/** Signal-State einer LogCard: der gewählte Minutenbereich (beide Grenzen inklusive) */
export interface LogCardSignals {
  /** Untere Grenze (Minute) */
  from: number;
  /** Obere Grenze (Minute) */
  to: number;
}

/** Eine Log-Zeile, dargestellt als "[mm:ss] Nachricht" */
export interface LogEntryArgs {
  /** Zeitangabe im Format "mm:ss", z. B. "02:15" */
  time: string;
  /** Log-Nachricht (Klartext, wird escaped) */
  message: string;
  /** Farbton (Standard: "default") */
  tone?: LogEntryTone;
}

/** Eine Section: alle Log-Zeilen einer Minute */
export interface LogCardSectionArgs {
  /** Pflicht: ID der LogCard (Root), zu der die Section gehört */
  id: string;
  /** Minute, der die Section zugeordnet ist (die Zeiten der Einträge sollten dazu passen) */
  minute: number;
  /** Überschrift der Section (Standard: "Minute <n>") */
  title?: string;
  /** Initial sichtbar? (Standard: true). Der Root setzt das aus dem Startbereich ab */
  visible?: boolean;
  class?: string;
  attributes?: HtmlAttributes;
  entries?: LogEntryArgs[];
}

/** Der RangeSlider über dem Content */
export interface LogCardRangeArgs {
  /** Pflicht: ID der LogCard (Root) */
  id: string;
  /** Kleinste wählbare Minute */
  min: number;
  /** Größte wählbare Minute */
  max: number;
  /** Startwert der unteren Grenze (Standard: min) */
  from?: number;
  /** Startwert der oberen Grenze (Standard: max) */
  to?: number;
  /** Beschriftung links über dem Slider (Standard: "Zeitraum") */
  label?: string;
  class?: string;
  attributes?: HtmlAttributes;
}

export interface LogCardArgs {
  /** ID der Card. Ohne Angabe wird eine Zufalls-ID erzeugt (log_card_<8 hex>) */
  id?: string;
  /** Titel im Header */
  title?: string;
  /** Beschreibung unter dem Titel */
  description?: string;
  /** Beschriftung des Sliders (Standard: "Zeitraum") */
  rangeLabel?: string;
  /** Startwert der unteren Grenze (Standard: kleinste Minute) */
  from?: number;
  /** Startwert der oberen Grenze (Standard: größte Minute) */
  to?: number;
  /** Die Sections in der Reihenfolge der Anzeige */
  sections?: Omit<LogCardSectionArgs, "id">[];
  class?: string;
  attributes?: HtmlAttributes;
}
