import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Farbton einer Log-Zeile */
export type LogEntryTone = "default" | "muted" | "success" | "warning" | "danger";

/**
 * Darstellung der Zeitangaben:
 * - "duration": Dauer seit dem Start, [mm:ss]
 * - "clock": Uhrzeit in UTC, [HH:MM:SS]
 */
export type LogTimeMode = "duration" | "clock";

/**
 * Zeitpunkt des Starts in UTC:
 * - ISO-8601-String mit Zeitzone, z. B. "2026-11-24T20:15:00Z" (ohne Zeitzone wird abgelehnt, sonst gälte die lokale Zeit)
 * - oder Epoch in Millisekunden (z. B. Date.now() oder Date.UTC(...))
 */
export type LogCardStart = string | number;

/**
 * Signal-State einer LogCard.
 * from und to sind Sekunden seit dem Start (beide Grenzen inklusive), clock schaltet die Zeitanzeige um.
 */
export interface LogCardSignals {
  /** Untere Grenze des Bereichs in Sekunden */
  from: number;
  /** Obere Grenze des Bereichs in Sekunden */
  to: number;
  /** true: Uhrzeit (UTC), false: Dauer */
  clock: boolean;
}

/** Eine Log-Zeile */
export interface LogEntryArgs {
  /**
   * Delta zum Start im Format "mm:ss", z. B. "02:15" (mm darf größer als 59 sein, z. B. "75:00").
   * Die Uhrzeit ergibt sich aus startedAt der Card.
   */
  time: string;
  /** Log-Nachricht (Klartext, wird escaped) */
  message: string;
  /** Farbton (Standard: "default") */
  tone?: LogEntryTone;
}

/** Eine Section: eine Gruppe zusammengehöriger Log-Zeilen */
export interface LogCardSectionArgs {
  /** Pflicht: ID der LogCard (Root), zu der die Section gehört */
  id: string;
  /** Startzeitpunkt der Card (für die Uhrzeit-Darstellung der Zeilen) */
  startedAt?: LogCardStart;
  /** Überschrift der Section (ohne Angabe gibt es keine Überschrift) */
  title?: string;
  /** Startwert der unteren Grenze in Sekunden (nur für die Anfangssichtbarkeit, Standard: alles sichtbar) */
  from?: number;
  /** Startwert der oberen Grenze in Sekunden (nur für die Anfangssichtbarkeit, Standard: alles sichtbar) */
  to?: number;
  class?: string;
  attributes?: HtmlAttributes;
  entries?: LogEntryArgs[];
}

/** Umschalter zwischen Dauer und Uhrzeit */
export interface LogCardTimeToggleArgs {
  /** Pflicht: ID der LogCard (Root) */
  id: string;
  /** Initial gewählte Darstellung (Standard: "duration") */
  mode?: LogTimeMode;
  class?: string;
  attributes?: HtmlAttributes;
}

/** Der RangeSlider über dem Content (alle Werte in Sekunden seit dem Start) */
export interface LogCardRangeArgs {
  /** Pflicht: ID der LogCard (Root) */
  id: string;
  /** Kleinster wählbarer Wert in Sekunden */
  min: number;
  /** Größter wählbarer Wert in Sekunden */
  max: number;
  /** Schrittweite in Sekunden (Standard: 10) */
  step?: number;
  /** Startwert der unteren Grenze (Standard: min) */
  from?: number;
  /** Startwert der oberen Grenze (Standard: max) */
  to?: number;
  /** Startzeitpunkt der Card (für die Uhrzeit-Darstellung der Bereichsanzeige) */
  startedAt?: LogCardStart;
  /** Initial gewählte Darstellung der Bereichsanzeige (Standard: "duration") */
  mode?: LogTimeMode;
  /** Beschriftung links über dem Slider (Standard: "Zeitraum") */
  label?: string;
  class?: string;
  attributes?: HtmlAttributes;
}

export interface LogCardArgs {
  /** ID der Card. Ohne Angabe wird eine Zufalls-ID erzeugt (log_card_<8 hex>) */
  id?: string;
  /**
   * Startzeitpunkt (UTC) des Geschehens.
   * Mit startedAt gibt es den Toggle zwischen Dauer [mm:ss] und Uhrzeit [HH:MM:SS];
   * ohne startedAt werden nur Dauern angezeigt und der Toggle entfällt.
   */
  startedAt?: LogCardStart;
  /** Initial gewählte Darstellung (Standard: "duration"; ohne startedAt immer "duration") */
  timeMode?: LogTimeMode;
  /** Titel im Header */
  title?: string;
  /** Beschreibung unter dem Titel */
  description?: string;
  /** Beschriftung des Sliders (Standard: "Zeitraum") */
  rangeLabel?: string;
  /** Schrittweite des Sliders in Sekunden (Standard: 10) */
  step?: number;
  /** Startwert der unteren Grenze in Sekunden (Standard: 0) */
  from?: number;
  /** Startwert der oberen Grenze in Sekunden (Standard: größte Zeit, auf die Schrittweite aufgerundet) */
  to?: number;
  /** Die Sections in der Reihenfolge der Anzeige */
  sections?: Omit<LogCardSectionArgs, "id" | "startedAt">[];
  class?: string;
  attributes?: HtmlAttributes;
}
