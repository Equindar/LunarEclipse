import type { Children } from "../../types/Children";
import type { AnchorAlign, AnchorSide } from "../../utils/getAnchorPosition";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Segment eines Zeitfelds */
export type TimePickerSegment = "hour" | "minute" | "second" | "period";

/** Darstellung der Werte in den Spalten: "numeric" ergibt 1, "2-digit" ergibt 01 */
export type TimePickerSegmentFormat = "numeric" | "2-digit";

/** Platzhalter für leere Segmente: ein String für alle Segmente oder je Segment */
export type TimePickerPlaceholder = string | Partial<Record<TimePickerSegment, string>>;

/** Aktion beim Klick auf freie Fläche der Eingabegruppe */
export type TimePickerClickAction = "focus" | "open";

/**
 * Signal-State eines Time-Pickers.
 * Der Wert liegt immer im 24-Stunden-Format vor ("HH:mm" oder "HH:mm:ss"), leere Segmente stehen als "--".
 * Kontrollierter Zustand entsteht durch Lesen und Schreiben dieser Signale (`$<id>.value`, `$<id>.open`).
 */
export interface TimePickerSignals {
  value: string;
  open: boolean;
}

export interface TimePickerArgs {
  /** ID des Roots (Standard: zufällig, `time-picker_<8 hex>`). Alle Teilkomponenten bekommen dieselbe ID */
  id?: string;
  class?: string;
  /** Initialer Wert im 24-Stunden-Format ("HH:mm" oder "HH:mm:ss") */
  defaultValue?: string;
  /** Ob der Inhalt (Popover) initial geöffnet ist */
  defaultOpen?: boolean;
  /** Datastar-Expression, die bei jeder Änderung des Werts läuft (`$<id>.value` enthält den neuen Wert) */
  onValueChange?: string;
  /** Datastar-Expression, die bei jeder Änderung des Öffnungszustands läuft (`$<id>.open`) */
  onOpenChange?: string;
  /** Inhalt beim Fokussieren eines Segments öffnen (Standard: false) */
  openOnFocus?: boolean;
  /** Aktion beim Klick auf freie Fläche der Eingabegruppe (Standard: "focus") */
  inputGroupClickAction?: TimePickerClickAction;
  /** In der Vorlage definiert, aber nirgends ausgewertet (kein Mindestwert-Check) */
  min?: string;
  /** In der Vorlage definiert, aber nirgends ausgewertet (kein Höchstwert-Check) */
  max?: string;
  /** Schrittweite der Stunden-Spalte (Standard: 1) */
  hourStep?: number;
  /** Schrittweite der Minuten-Spalte (Standard: 1) */
  minuteStep?: number;
  /** Schrittweite der Sekunden-Spalte (Standard: 1) */
  secondStep?: number;
  /** Platzhalter für leere Segmente (Standard: "--") */
  segmentPlaceholder?: TimePickerPlaceholder;
  /** Locale für die Erkennung von 12-/24-Stunden-Format (Standard: Locale des Browsers) */
  locale?: string;
  /** Name des versteckten Formularfelds (ohne Name wird kein Formularfeld gerendert) */
  name?: string;
  disabled?: boolean;
  invalid?: boolean;
  readOnly?: boolean;
  /** Wird nur an das versteckte Formularfeld weitergegeben (bei type="hidden" ohne Wirkung) */
  required?: boolean;
  /** Sekunden anzeigen und im Wert führen (Standard: false) */
  showSeconds?: boolean;
  attributes?: HtmlAttributes;
  /** Label, Eingabegruppe und Inhalt */
  children?: Children;
}

export interface TimePickerLabelArgs {
  /** Pflicht: ID des Roots */
  id: string;
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface TimePickerInputGroupArgs {
  /** Pflicht: ID des Roots (wird auch als Anchor-Name für den Inhalt genutzt) */
  id: string;
  class?: string;
  attributes?: HtmlAttributes;
  /** Segmente, Trenner und Trigger */
  children?: Children;
}

export interface TimePickerInputArgs {
  /** Pflicht: ID des Roots */
  id: string;
  /** Pflicht: Segment, das dieses Feld bearbeitet */
  segment: TimePickerSegment;
  class?: string;
  disabled?: boolean;
  readOnly?: boolean;
  attributes?: HtmlAttributes;
}

export interface TimePickerSeparatorArgs {
  class?: string;
  attributes?: HtmlAttributes;
  /** Standard: ":" */
  children?: Children;
}

export interface TimePickerTriggerArgs {
  /** Pflicht: ID des Roots */
  id: string;
  class?: string;
  disabled?: boolean;
  attributes?: HtmlAttributes;
  /** Standard: Uhr-Icon */
  children?: Children;
}

export interface TimePickerContentArgs {
  /** Pflicht: ID des Roots */
  id: string;
  class?: string;
  /** Seite relativ zur Eingabegruppe (Standard: "bottom") */
  side?: AnchorSide;
  /** Ausrichtung relativ zur Eingabegruppe (Standard: "start") */
  align?: AnchorAlign;
  /** Abstand zur Eingabegruppe in Pixeln (Standard: 6) */
  sideOffset?: number;
  attributes?: HtmlAttributes;
  /** Spalten und Clear-Button */
  children?: Children;
}

/** Args der Stunden-, Minuten- und Sekunden-Spalte */
export interface TimePickerColumnArgs {
  /** Pflicht: ID des Roots */
  id: string;
  class?: string;
  /** Darstellung der Werte (Stunde: "numeric", Minute und Sekunde: "2-digit") */
  format?: TimePickerSegmentFormat;
  attributes?: HtmlAttributes;
}

export interface TimePickerPeriodArgs {
  /** Pflicht: ID des Roots */
  id: string;
  class?: string;
  attributes?: HtmlAttributes;
}

export interface TimePickerClearArgs {
  /** Pflicht: ID des Roots */
  id: string;
  class?: string;
  disabled?: boolean;
  attributes?: HtmlAttributes;
  /** Standard: "Clear" */
  children?: Children;
}

/** Konfiguration, die der Root an die Runtime übergibt (intern) */
export interface TimePickerRuntimeConfig {
  id: string;
  locale: string | null;
  showSeconds: boolean;
  hourStep: number;
  minuteStep: number;
  secondStep: number;
  ph: Record<TimePickerSegment, string>;
  disabled: boolean;
  readOnly: boolean;
  openOnFocus: boolean;
  groupAction: TimePickerClickAction;
  itemClass: string;
}
