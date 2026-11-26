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
 * Signal-State einer LogCard (Signal-Objekt $<id>).
 * Alle Zeiten sind Sekunden seit dem Start.
 */
export interface LogCardSignals {
  /** Untere Grenze des gewählten Bereichs (inklusive) */
  from: number;
  /** Obere Grenze des gewählten Bereichs (inklusive) */
  to: number;
  /** Größter wählbarer Wert des Sliders; wächst im Live-Betrieb mit jedem neuen Eintrag mit */
  max: number;
  /** true: Uhrzeit (UTC), false: Dauer */
  clock: boolean;
  /** Läuft der Kampf noch? Der Server setzt das am Ende per Signal-Patch auf false */
  live: boolean;
  /** Folgt die Ansicht dem neuesten Eintrag? Wird false, sobald der Nutzer nach oben scrollt */
  follow: boolean;
  /** Hängt die obere Grenze am Ende (to === max)? Dann wandert sie mit neuen Einträgen mit */
  tail: boolean;
  /** Anzahl der Einträge; ändert sich mit jedem neuen Eintrag und löst das Nachscrollen aus */
  count: number;
}

/** Teil-Update der Signale, z. B. { live: false } am Ende des Kampfes */
export type LogCardSignalsPatch = Partial<LogCardSignals>;

/** Eine Log-Zeile */
export interface LogEntryArgs {
  /** DOM-ID der Zeile (optional, z. B. damit der Server Duplikate erkennen kann) */
  id?: string;
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

/** Eine einzelne Zeile als HTML, z. B. für einen SSE-Patch in eine bestehende Section */
export interface LogCardEntryArgs extends LogEntryArgs {
  /** Pflicht: ID der LogCard (Root), zu der die Zeile gehört */
  cardId: string;
  /** Startzeitpunkt der Card (für die Uhrzeit-Darstellung) */
  startedAt?: LogCardStart;
  /** Schrittweite des Sliders in Sekunden (Standard: 10), bestimmt das neue Maximum beim Einfügen */
  step?: number;
  /**
   * Zeile meldet sich beim Einfügen in die Card an: erhöht count (löst das Nachscrollen aus)
   * und hebt max an. Für alles, was nachträglich per SSE eingefügt wird, auf true setzen.
   */
  announce?: boolean;
  /** Startwert der unteren Grenze (nur für die Anfangssichtbarkeit, Standard: sichtbar) */
  from?: number;
  /** Startwert der oberen Grenze (nur für die Anfangssichtbarkeit, Standard: sichtbar) */
  to?: number;
}

/** Eine Section: eine Gruppe zusammengehöriger Log-Zeilen */
export interface LogCardSectionArgs {
  /** Pflicht: ID der LogCard (Root), zu der die Section gehört */
  id: string;
  /** Startzeitpunkt der Card (für die Uhrzeit-Darstellung der Zeilen) */
  startedAt?: LogCardStart;
  /**
   * DOM-ID der Section. Die Zeilenliste bekommt die ID "<sectionId>-entries", damit der Server
   * weitere Zeilen per SSE anhängen kann. LogCard vergibt "<id>-section-<index>".
   */
  sectionId?: string;
  /** Schrittweite des Sliders in Sekunden (Standard: 10), nur relevant mit announce */
  step?: number;
  /** Die Zeilen der Section melden sich beim Einfügen an (siehe LogCardEntryArgs.announce) */
  announce?: boolean;
  /** Überschrift der Section (ohne Angabe gibt es keine Überschrift) */
  title?: string;
  /** Startwert der unteren Grenze (nur für die Anfangssichtbarkeit der Zeilen, Standard: alles sichtbar) */
  from?: number;
  /** Startwert der oberen Grenze (nur für die Anfangssichtbarkeit der Zeilen, Standard: alles sichtbar) */
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
  /**
   * Läuft der Kampf noch? Dann folgt die Ansicht standardmäßig dem neuesten Eintrag, die obere
   * Grenze des Sliders wandert mit, und ein "Live"-Hinweis wird angezeigt. (Standard: false)
   */
  live?: boolean;
  /** Folgt die Ansicht anfangs dem neuesten Eintrag? (Standard: live) */
  follow?: boolean;
  /**
   * URL des SSE-Streams (Datastar-Events). Die Card öffnet ihn beim Laden per @get.
   * Der Server hängt neue Zeilen und Sections per datastar-patch-elements an (siehe LogCardEntry,
   * LogCardSection und die Selector-Helfer) und beendet den Kampf mit logCardSignalsPatch(id, { live: false }).
   */
  sseUrl?: string;
  /** Tailwind-Klassen für den Scroller, vor allem die Höhe (Standard: "max-h-96") */
  scrollerClass?: string;
  /** Die Sections in der Reihenfolge der Anzeige */
  sections?: Omit<LogCardSectionArgs, "id" | "startedAt" | "sectionId" | "announce" | "step">[];
  class?: string;
  attributes?: HtmlAttributes;
}
