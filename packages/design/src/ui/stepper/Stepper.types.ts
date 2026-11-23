import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Ausrichtung des Steppers */
export type StepperOrientation = "horizontal" | "vertical";

/** Schreibrichtung (beeinflusst die Pfeiltasten-Navigation) */
export type StepperDirection = "ltr" | "rtl";

/**
 * Aktivierung per Tastatur:
 * - "automatic": Fokus auf einen Schritt aktiviert ihn
 * - "manual": Fokus bewegt sich, aktiviert wird erst per Enter/Leertaste oder Klick
 */
export type StepperActivationMode = "automatic" | "manual";

/** Wert von data-state an Item, Trigger, Indicator und Separator */
export type StepperDataState = "inactive" | "active" | "completed";

/** Definition eines Schritts (Reihenfolge = Reihenfolge im Array) */
export interface StepperStep {
  /** Eindeutiger Wert des Schritts (ohne Leerzeichen, wird Teil von Element-IDs) */
  value: string;
  /** Schritt gilt unabhängig vom aktiven Schritt als abgeschlossen */
  completed?: boolean;
  /** Schritt ist nicht anwählbar */
  disabled?: boolean;
}

/**
 * Signal-State eines Steppers (Datastar).
 * Listen enthalten Schritt-Werte; sie sind zur Laufzeit über die Signale veränderbar.
 */
export interface StepperSignals {
  /** Wert des aktiven Schritts ("" = keiner aktiv) */
  value: string;
  /** Alle Schritte in Reihenfolge */
  steps: string[];
  /** Schritte, die als abgeschlossen gelten */
  completed: string[];
  /** Schritte, die deaktiviert sind */
  disabledSteps: string[];
  /** Gesamter Stepper deaktiviert (betrifft die Trigger) */
  disabled: boolean;
}

/** Gemeinsame Args der Teilkomponenten: id des Roots, Klasse, Attribute, Inhalt */
export interface StepperPartArgs {
  /** Pflicht: id des Steppers (StepperArgs.id), damit die Teile dieselben Signale nutzen */
  id: string;
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface StepperArgs {
  /**
   * ID des Steppers (Standard: zufällig, "stepper_<8 hex>").
   * Nur Buchstaben, Ziffern, "-" und "_" (daraus wird der Signal-Name gebildet).
   */
  id?: string;
  /** Pflicht: Schritte in Reihenfolge (ersetzt die Registrierung der Items im React-Original) */
  steps: StepperStep[];
  /** Aktiver Schritt beim Rendern. Gesteuert wird danach über das Signal (Standard: kein Schritt aktiv) */
  value?: string;
  /** Wie `value`; `value` hat Vorrang */
  defaultValue?: string;
  /**
   * Datastar-Ausdruck, der nach einem Schrittwechsel läuft.
   * Verfügbar: `value` (neuer Schritt). Beispiel: `console.log(value)`.
   */
  onValueChange?: string;
  /**
   * Synchroner Datastar-Ausdruck, der vor dem Wechsel prüft und einen Boolean liefert
   * (false bricht den Wechsel ab). Verfügbar: `value` (Zielschritt), `direction` ("next" | "prev").
   * Asynchrone Prüfungen (Promise) werden nicht unterstützt.
   */
  onValidate?: string;
  /** Standard: "automatic" */
  activationMode?: StepperActivationMode;
  /** Schreibrichtung; ohne Angabe wird sie vom Dokument geerbt */
  dir?: StepperDirection;
  /** Standard: "horizontal" */
  orientation?: StepperOrientation;
  /** Alle Trigger deaktivieren */
  disabled?: boolean;
  /** Pfeiltasten springen am Ende wieder zum Anfang */
  loop?: boolean;
  /** Schritte sind nur Anzeige: kein Klick, keine Aktivierung per Fokus oder Enter */
  nonInteractive?: boolean;
  class?: string;
  attributes?: HtmlAttributes;
  /** StepperList, StepperContent, StepperPrev, StepperNext ... */
  children?: Children;
}

export interface StepperListArgs {
  /** Muss zur Ausrichtung des Roots passen (Standard: "horizontal") */
  orientation?: StepperOrientation;
  class?: string;
  attributes?: HtmlAttributes;
  /** StepperItem-Elemente */
  children?: Children;
}

export interface StepperItemArgs extends StepperPartArgs {
  /** Pflicht: Wert des Schritts (muss in StepperArgs.steps vorkommen) */
  value: string;
  /** Muss zur Ausrichtung des Roots passen (Standard: "horizontal") */
  orientation?: StepperOrientation;
}

export interface StepperTriggerArgs extends StepperPartArgs {
  /** Pflicht: Wert des Schritts */
  value: string;
  /** Trigger fest deaktivieren (zusätzlich zu den Signalen disabled/disabledSteps) */
  disabled?: boolean;
}

export interface StepperIndicatorArgs extends StepperPartArgs {
  /** Pflicht: Wert des Schritts */
  value: string;
  /**
   * Icon (HTML-String) für abgeschlossene Schritte.
   * Wird nur ohne `children` verwendet. Standard: Häkchen (Lucide "Check").
   */
  completedIcon?: string;
}

export interface StepperSeparatorArgs extends StepperPartArgs {
  /** Pflicht: Wert des Schritts, zu dem die Linie gehört */
  value: string;
  /** Muss zur Ausrichtung des Roots passen (Standard: "horizontal") */
  orientation?: StepperOrientation;
  /** Auch beim letzten Schritt anzeigen (Standard: false) */
  forceMount?: boolean;
}

export interface StepperTitleArgs extends StepperPartArgs {
  /** Pflicht: Wert des Schritts */
  value: string;
}

export interface StepperDescriptionArgs extends StepperPartArgs {
  /** Pflicht: Wert des Schritts */
  value: string;
}

export interface StepperContentArgs extends StepperPartArgs {
  /** Pflicht: Wert des Schritts, zu dem der Inhalt gehört */
  value: string;
  /** Inhalt immer im Layout lassen, auch wenn der Schritt nicht aktiv ist (Standard: false) */
  forceMount?: boolean;
}

/** Args der Navigationsbuttons (Zurück/Weiter) */
export interface StepperNavButtonArgs extends StepperPartArgs {
  /**
   * Button fest deaktivieren. Ohne Angabe wird er automatisch
   * deaktiviert (erster Schritt bei Zurück, letzter Schritt bei Weiter).
   */
  disabled?: boolean;
}

export type StepperPrevArgs = StepperNavButtonArgs;
export type StepperNextArgs = StepperNavButtonArgs;
