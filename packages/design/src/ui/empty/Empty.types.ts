import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Darstellung des Medien-Bereichs: ohne Hintergrund oder als Icon-Kachel */
export type EmptyMediaVariant = "default" | "icon";

/** Gemeinsame Args aller Teile des Empty-States */
export interface EmptyBaseArgs {
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben, ein data-slot ersetzt den Standardwert) */
  attributes?: HtmlAttributes;
  /** Inhalt */
  children?: Children;
}

/** Wurzel des Empty-States, umschliesst EmptyHeader und EmptyContent */
export type EmptyArgs = EmptyBaseArgs;

/** Umschliesst Medien-Bereich, Titel und Beschreibung */
export type EmptyHeaderArgs = EmptyBaseArgs;

/** Medien-Bereich, z. B. ein Icon, ein Bild oder ein Avatar */
export interface EmptyMediaArgs extends EmptyBaseArgs {
  /** "icon" rendert eine Kachel mit Hintergrund (Standard: "default") */
  variant?: EmptyMediaVariant;
}

/** Titel des Empty-States */
export type EmptyTitleArgs = EmptyBaseArgs;

/** Beschreibung des Empty-States (rendert wie in der Vorlage ein `div`, kein `p`) */
export type EmptyDescriptionArgs = EmptyBaseArgs;

/** Inhalt unterhalb des Headers, z. B. Buttons, Eingabefelder oder Links */
export type EmptyContentArgs = EmptyBaseArgs;
