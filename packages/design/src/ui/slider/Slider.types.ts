import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Ausrichtung des Sliders */
export type SliderOrientation = "horizontal" | "vertical";

/** Schreibrichtung des Sliders (für RTL-Sprachen) */
export type SliderDirection = "ltr" | "rtl";

/** Signal-State eines Sliders */
export interface SliderSignals {
  /** Aktuelle Werte, je Thumb einer (Reihenfolge = Thumb-Index) */
  values: number[];
  /** Index des Thumbs, der gerade gezogen wird (-1 = keiner) */
  active: number;
}

/** Aufgelöste Konfiguration (Defaults angewendet, Werte geprüft) */
export interface SliderConfig {
  min: number;
  max: number;
  step: number;
  orientation: SliderOrientation;
}

export interface SliderArgs {
  /**
   * ID des Sliders (Standard: Zufalls-ID `slider_<8 hex>`).
   * Sie bestimmt auch den Signal-Namen (`-` wird zu `_`), z. B. `$slider_temperatur.values`.
   */
  id?: string;
  /** Zusätzliche CSS-Klassen für das Root-Element */
  class?: string;
  /**
   * Startwerte, je Thumb einer (ein Wert = ein Thumb, zwei Werte = Bereich, mehr Werte = mehrere Thumbs).
   * Ohne Angabe (oder bei leerer Liste) entsteht wie in der Quelle ein Bereich von min bis max.
   * Die Werte werden auf min/max begrenzt und auf `step` gerundet.
   */
  defaultValue?: number[];
  /** Kleinster Wert (Standard: 0) */
  min?: number;
  /** Größter Wert (Standard: 100) */
  max?: number;
  /** Schrittweite (Standard: 1, muss größer als 0 sein) */
  step?: number;
  /** Ausrichtung (Standard: "horizontal") */
  orientation?: SliderOrientation;
  /** Deaktiviert den Slider (kein Ziehen, kein Fokus, Werte werden nicht abgeschickt) */
  disabled?: boolean;
  /** Schreibrichtung; bei "rtl" läuft ein horizontaler Slider von rechts nach links */
  dir?: SliderDirection;
  /** Feldname; wenn gesetzt, wird je Thumb ein verstecktes Input mit dem Wert gerendert */
  name?: string;
  /** Zugänglicher Name, wird an jeden Thumb gesetzt */
  ariaLabel?: string;
  /** ID eines Label-Elements, wird an jeden Thumb gesetzt (`htmlFor` erreicht die Thumbs nicht) */
  ariaLabelledby?: string;
  /** Zusätzliche HTML-Attribute für das Root-Element (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
}
