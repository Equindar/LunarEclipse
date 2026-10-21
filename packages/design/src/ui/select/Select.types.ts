import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Signal-State eines Selects */
export interface SelectSignals {
  open: boolean;
  value: string;
  label: string;
  /** Index des hervorgehobenen Items (-1 = keins) */
  highlighted: number;
  _lastValue: string;
}

/** Positionierung des Contents relativ zum Trigger */
export type SelectPosition = "item-aligned" | "popper";

/** Eine Option des Selects */
export interface SelectOptionArgs {
  /** Wert dieser Option */
  value: string;
  /** Anzeigetext dieser Option */
  label: string;
  /** Macht die Option nicht auswählbar */
  disabled?: boolean;
  /** Optionaler Gruppenname */
  group?: string;
}

export interface SelectArgs {
  /** ID für das Scoping der Datastar-Signale (ohne Angabe wird eine zufällige ID erzeugt) */
  id?: string;
  /** Ob das Select offen ist (controlled) */
  open?: boolean;
  /** Initialer Open-Zustand (uncontrolled) */
  defaultOpen?: boolean;
  /** Aktuell ausgewählter Wert */
  value?: string;
  /** Initialer Wert (uncontrolled) */
  defaultValue?: string;
  /** Optionen: ist die Liste gesetzt, wird die komplette UI automatisch gerendert */
  options?: SelectOptionArgs[];
  /** Name für die Formularübertragung (rendert ein verstecktes Input) */
  name?: string;
  /** Macht das Select nicht interaktiv (nur mit options) */
  disabled?: boolean;
  /** Pflichtfeld für die Formularvalidierung */
  required?: boolean;
  /** Platzhalter, wenn nichts ausgewählt ist */
  placeholder?: string;
  /** Optionale Datastar-Expression bei Wertänderung, z. B. "@post('/api/update')" */
  onChange?: string;
  class?: string;
  attributes?: HtmlAttributes;
  /** Inhalt bei manueller Komposition (wird ignoriert, wenn options gesetzt ist) */
  children?: Children;
}

export interface SelectTriggerArgs {
  /** Muss mit der ID des Select übereinstimmen */
  id: string;
  class?: string;
  attributes?: HtmlAttributes;
  /** Macht den Trigger nicht interaktiv */
  disabled?: boolean;
  children?: Children;
}

export interface SelectValueArgs {
  /** Muss mit der ID des Select übereinstimmen */
  id: string;
  /** Platzhalter, wenn nichts ausgewählt ist */
  placeholder?: string;
  class?: string;
  attributes?: HtmlAttributes;
}

export interface SelectContentArgs {
  /** Muss mit der ID des Select übereinstimmen */
  id: string;
  position?: SelectPosition;
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface SelectItemArgs {
  /** Muss mit der ID des Select übereinstimmen */
  id: string;
  /** Wert dieses Items */
  value: string;
  /** Position in der Liste (für die Tastaturnavigation) */
  index?: number;
  /** Macht das Item nicht auswählbar */
  disabled?: boolean;
  class?: string;
  attributes?: HtmlAttributes;
  /** Anzeigetext (HTML) */
  children?: Children;
}

export interface SelectLabelArgs {
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface SelectSeparatorArgs {
  class?: string;
  attributes?: HtmlAttributes;
}

export interface SelectGroupArgs {
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}
