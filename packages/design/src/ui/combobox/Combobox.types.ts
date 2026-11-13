import type { Children } from "../../types/Children";
import type { AnchorAlign, AnchorSide } from "../../utils/getAnchorPosition";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Signal-State einer Combobox (ein Signal-Objekt pro Root, Name = ID mit "-" zu "_") */
export interface ComboboxSignals {
  /** Ob das Popup geöffnet ist */
  open: boolean;
  /** Ausgewählter Wert (Einfachauswahl, leer = nichts ausgewählt) */
  value: string;
  /** Anzeigetext des ausgewählten Werts (Einfachauswahl) */
  label: string;
  /** Ausgewählte Werte (Mehrfachauswahl) */
  values: string[];
}

/** Root der Combobox. Hält Signale und Click-Outside-Handler, rendert selbst keine eigene Optik. */
export interface ComboboxArgs {
  /** Pflicht: ID der Combobox, alle Teilkomponenten bekommen dieselbe ID */
  id: string;
  /** Mehrfachauswahl (Chips). Entspricht `multiple` der Quelle. */
  multiple?: boolean;
  /** Hebt beim Filtern automatisch den ersten Treffer hervor */
  autoHighlight?: boolean;
  /** Vorausgewählter Wert (Einfachauswahl) */
  value?: string;
  /** Anzeigetext des vorausgewählten Werts (Standard: `value`) */
  label?: string;
  /** Vorausgewählte Werte (Mehrfachauswahl) */
  values?: string[];
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface ComboboxInputArgs {
  /** Pflicht: ID des Roots */
  id: string;
  /** Klassen für die Input-Group (Standard der Quelle: `w-auto`) */
  class?: string;
  placeholder?: string;
  /** Feldname: rendert ein verstecktes Input mit dem ausgewählten Wert (nur Einfachauswahl) */
  name?: string;
  disabled?: boolean;
  /** Setzt aria-invalid="true" am Input */
  invalid?: boolean;
  /** Trigger-Button (Chevron) anzeigen (Standard: true) */
  showTrigger?: boolean;
  /** Clear-Button anzeigen (Standard: false) */
  showClear?: boolean;
  /** Ob die Input-Group als Anchor für das Popup dient (Standard: true). Im Popup-Muster (Input im Content) auf false setzen. */
  anchor?: boolean;
  /** Attribute des Input-Elements */
  attributes?: HtmlAttributes;
  /** Zusätzlicher Inhalt der Input-Group, z. B. ein InputGroupAddon */
  children?: Children;
}

export interface ComboboxTriggerArgs {
  /** Pflicht: ID des Roots */
  id: string;
  class?: string;
  disabled?: boolean;
  /** Ob der Trigger als Anchor für das Popup dient (Standard: true) */
  anchor?: boolean;
  attributes?: HtmlAttributes;
  /** Inhalt vor dem Chevron-Icon */
  children?: Children;
}

export interface ComboboxClearArgs {
  /** Pflicht: ID des Roots */
  id: string;
  class?: string;
  disabled?: boolean;
  attributes?: HtmlAttributes;
}

export interface ComboboxValueArgs {
  /** Pflicht: ID des Roots */
  id: string;
  /**
   * Einfachauswahl (ohne `chip`): zeigt den Anzeigetext des ausgewählten Werts.
   * Platzhaltertext, solange nichts ausgewählt ist.
   */
  placeholder?: string;
  /**
   * Mehrfachauswahl: Chip-Vorlage mit den Platzhaltern aus `comboboxChipPlaceholder`.
   * Für jeden ausgewählten Wert wird die Vorlage im Browser gerendert (Ersatz für `value.map(...)` der Quelle).
   */
  chip?: string;
  class?: string;
  attributes?: HtmlAttributes;
}

export interface ComboboxContentArgs {
  /** Pflicht: ID des Roots (auch Anchor-Name) */
  id: string;
  class?: string;
  /** Seite relativ zum Anchor (Standard: bottom) */
  side?: AnchorSide;
  /** Abstand zum Anchor in Pixeln (Standard: 6) */
  sideOffset?: number;
  /** Ausrichtung relativ zum Anchor (Standard: start) */
  align?: AnchorAlign;
  /** In der Quelle vorhanden, im Port ohne Wirkung (CSS Anchor Positioning kennt keinen align-Offset) */
  alignOffset?: number;
  /** true, wenn das Popup an einer Chips-Gruppe hängt (entspricht `anchor` der Quelle, Standard: false) */
  chips?: boolean;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface ComboboxListArgs {
  /** Pflicht: ID des Roots (für aria-controls des Inputs) */
  id: string;
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface ComboboxItemArgs {
  /** Pflicht: ID des Roots */
  id: string;
  /** Pflicht: Wert des Items */
  value: string;
  /** Text für Filter und Eingabefeld (entspricht `itemToStringValue`, Standard: `value`) */
  label?: string;
  disabled?: boolean;
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

/** Args für Teile ohne eigene Logik (Group, Label, Collection, Empty, Separator) */
export interface ComboboxPlainArgs {
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export type ComboboxGroupArgs = ComboboxPlainArgs;
export type ComboboxLabelArgs = ComboboxPlainArgs;
export type ComboboxCollectionArgs = ComboboxPlainArgs;
export type ComboboxEmptyArgs = ComboboxPlainArgs;
export type ComboboxSeparatorArgs = Omit<ComboboxPlainArgs, "children">;

export interface ComboboxChipsArgs {
  /** Pflicht: ID des Roots (Anchor-Name des Popups) */
  id: string;
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface ComboboxChipArgs {
  /** Pflicht: ID des Roots */
  id: string;
  /** Wert des Chips (in einer Chip-Vorlage `comboboxChipPlaceholder.value`) */
  value: string;
  /** Remove-Button anzeigen (Standard: true) */
  showRemove?: boolean;
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface ComboboxChipsInputArgs {
  /** Pflicht: ID des Roots */
  id: string;
  class?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Setzt aria-invalid="true" (die Chips-Gruppe stylt sich darüber per has-aria-invalid) */
  invalid?: boolean;
  attributes?: HtmlAttributes;
}
