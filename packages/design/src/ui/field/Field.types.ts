import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Ausrichtung von Label und Steuerelement im Field */
export type FieldOrientation = "vertical" | "horizontal" | "responsive";

/** Darstellung der FieldLegend: "legend" (grösser) oder "label" (Label-Grösse, z. B. für verschachtelte FieldSets) */
export type FieldLegendVariant = "legend" | "label";

/** Ein Fehlereintrag für FieldError (kompatibel mit Validierungs-Bibliotheken, die `message` liefern) */
export type FieldErrorItem = { message?: string } | undefined;

/** Gemeinsame Args aller Field-Teile */
export interface FieldPartArgs {
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben, ausser `data-slot`) */
  attributes?: HtmlAttributes;
  /** Inhalt (HTML-String oder Liste von HTML-Strings) */
  children?: Children;
}

/** Container für ein einzelnes Feld (Label, Steuerelement, Beschreibung, Fehler) */
export interface FieldArgs extends FieldPartArgs {
  /** Ausrichtung (Standard: "vertical") */
  orientation?: FieldOrientation;
  /** Setzt `data-invalid="true"`: das gesamte Feld wird im Fehlerzustand dargestellt */
  invalid?: boolean;
  /** Setzt `data-disabled="true"`: Label und Titel werden abgedunkelt */
  disabled?: boolean;
}

/** Semantisches `<fieldset>` */
export type FieldSetArgs = FieldPartArgs;

/** `<legend>` eines FieldSets */
export interface FieldLegendArgs extends FieldPartArgs {
  /** Darstellung (Standard: "legend") */
  variant?: FieldLegendVariant;
}

/** Layout-Container, der Fields stapelt und Container-Queries für `responsive` aktiviert */
export type FieldGroupArgs = FieldPartArgs;

/** Spalte für Label und Beschreibung, wenn das Label neben dem Steuerelement steht */
export type FieldContentArgs = FieldPartArgs;

/** Label eines Fields (nutzt die Label-Komponente) */
export interface FieldLabelArgs extends FieldPartArgs {
  /** Wert des `for`-Attributs (ID des Steuerelements) */
  for?: string;
}

/** Titel mit Label-Darstellung (z. B. innerhalb von FieldContent) */
export type FieldTitleArgs = FieldPartArgs;

/** Hilfetext unter oder neben dem Steuerelement */
export type FieldDescriptionArgs = FieldPartArgs;

/** Trennlinie zwischen Feldern; `children` ist optionaler Text in der Mitte */
export type FieldSeparatorArgs = FieldPartArgs;

/** Fehlermeldung (`role="alert"`) */
export interface FieldErrorArgs extends FieldPartArgs {
  /**
   * Fehlereinträge. Wird nur verwendet, wenn `children` leer ist.
   * Eine eindeutige Meldung wird als Text ausgegeben, mehrere als Liste.
   */
  errors?: FieldErrorItem[];
}
