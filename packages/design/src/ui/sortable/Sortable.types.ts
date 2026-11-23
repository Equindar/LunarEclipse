import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Eindeutiger Bezeichner eines Eintrags (entspricht UniqueIdentifier aus dnd-kit) */
export type SortableValue = string | number;

/** Richtung der Sortierung: bestimmt Tastatur-Pfeile und die Berechnung der Einfügeposition */
export type SortableOrientation = "vertical" | "horizontal" | "mixed";

/**
 * Signal-State einer Sortable-Instanz.
 * Die Werte in `order` sind Strings, weil sie zur Laufzeit aus `data-value` gelesen werden.
 */
export interface SortableSignals {
  /** Wert des aktuell gezogenen Eintrags, leer wenn nichts gezogen wird */
  activeId: string;
  /** Reihenfolge der Werte (Dokumentreihenfolge), wird nach jeder Änderung aktualisiert */
  order: string[];
  /** Text der Live-Region für Screenreader */
  announcement: string;
}

export interface SortableArgs {
  /** ID der Instanz (Signal-Name wird daraus gebildet). Ohne Angabe wird eine Zufalls-ID erzeugt */
  id?: string;
  /** Initiale Reihenfolge der Werte für das Signal `order`. Optional, `order` wird ohnehin nach der ersten Änderung gesetzt */
  value?: SortableValue[];
  /** Richtung der Sortierung (Standard: "vertical") */
  orientation?: SortableOrientation;
  /** Datastar-Expression nach einer Änderung der Reihenfolge, `evt.detail.value` enthält die neue Reihenfolge (Event `sortable-change`) */
  onValueChange?: string;
  /** Datastar-Expression beim Aufnehmen eines Eintrags (Event `sortable-start`) */
  onDragStart?: string;
  /** Datastar-Expression beim Ablegen eines Eintrags, auch ohne Änderung (Event `sortable-end`) */
  onDragEnd?: string;
  /** Datastar-Expression beim Abbrechen (Event `sortable-cancel`) */
  onDragCancel?: string;
  /** Zusätzliche CSS-Klassen für das Wurzelelement (Standard: "contents", das Element erzeugt kein eigenes Layout) */
  class?: string;
  attributes?: HtmlAttributes;
  /** Inhalt: ein oder mehrere SortableContent */
  children?: Children;
}

export interface SortableContentArgs {
  /** HTML-Tag des Containers (Standard: "div"), z. B. "tbody" oder "ul" */
  tag?: string;
  /** Wenn gesetzt, werden nur die Kinder ohne umschließendes Element ausgegeben */
  withoutSlot?: boolean;
  class?: string;
  attributes?: HtmlAttributes;
  /** Inhalt: SortableItem-Einträge */
  children?: Children;
}

export interface SortableItemArgs {
  /** Pflicht: eindeutiger Wert des Eintrags (darf kein leerer String sein) */
  value: SortableValue;
  /** Optionale ID des Elements (wird von SortableItemHandle über `itemId` referenziert) */
  id?: string;
  /** HTML-Tag des Eintrags (Standard: "div"), z. B. "tr" oder "li" */
  tag?: string;
  /** Eintrag kann nicht gezogen werden */
  disabled?: boolean;
  /** Der ganze Eintrag dient als Griff (statt eines SortableItemHandle) */
  asHandle?: boolean;
  /** Optional: ID des Sortable-Roots, verknüpft die Screenreader-Anleitung per aria-describedby (nur mit asHandle relevant) */
  sortableId?: string;
  /** Flacher Cursor statt grab/grabbing */
  flatCursor?: boolean;
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface SortableItemHandleArgs {
  /** Optional: ID des zugehörigen SortableItem (wird zu aria-controls) */
  itemId?: string;
  /** Optional: ID des Sortable-Roots, verknüpft die Screenreader-Anleitung per aria-describedby */
  sortableId?: string;
  /** Griff deaktivieren (sollte zum `disabled` des Eintrags passen) */
  disabled?: boolean;
  /** Flacher Cursor statt grab/grabbing */
  flatCursor?: boolean;
  class?: string;
  attributes?: HtmlAttributes;
  /** Inhalt des Griffs, meist ein Icon */
  children?: Children;
}
