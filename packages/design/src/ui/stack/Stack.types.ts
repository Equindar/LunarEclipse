import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Seite, an der die Items verankert sind (top: Items wachsen nach oben, bottom: nach unten) */
export type StackSide = "top" | "bottom";

/** Signal-State eines Stacks (nur vorhanden, wenn `expandOnHover` aktiv ist) */
export interface StackSignals {
  /** Ob der Stack gerade aufgefächert ist */
  expanded: boolean;
  /** Ob gerade ein Zeiger gedrückt gehalten wird (verhindert das Zuklappen beim Verlassen) */
  interacting: boolean;
}

export interface StackArgs {
  /**
   * Optional: ID des Stacks. Wird als `id`-Attribut gerendert und als Name des Signals genutzt
   * (Bindestriche werden zu Unterstrichen). Ohne Angabe wird intern eine Zufalls-ID erzeugt.
   */
  id?: string;
  /** Seite, an der die Items verankert sind (Standard: "bottom") */
  side?: StackSide;
  /** Anzahl der Items, die im eingeklappten Zustand sichtbar sind (Standard: 3) */
  itemCount?: number;
  /** Anzahl der Items, die im aufgefächerten Zustand sichtbar sind (Standard: Anzahl aller Items) */
  expandedItemCount?: number;
  /** Abstand zwischen den Items im aufgefächerten Zustand in Pixeln (Standard: 8) */
  gap?: number;
  /** Verkleinerung je Item im eingeklappten Zustand (0.05 entspricht 5 % je Item, Standard: 0.05) */
  scale?: number;
  /** Versatz je Item im eingeklappten Zustand in Pixeln (Standard: 10) */
  offset?: number;
  /** Ob der Stack beim Hover aufgefächert wird. Funktioniert nur mit Datastar (Standard: false) */
  expandOnHover?: boolean;
  /** Zusätzliche CSS-Klassen für den Stack */
  class?: string;
  /**
   * Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben).
   * Ein `style`-Wert wird hinter die CSS-Variablen des Stacks gehängt und kann sie überschreiben.
   */
  attributes?: HtmlAttributes;
  /**
   * Die Items des Stacks. Jedes Array-Element ist ein Item (in der Regel `StackItem(...)`),
   * ein einzelner String zählt als ein Item. Leere Strings werden ignoriert.
   */
  children?: Children;
}

export interface StackItemArgs {
  /** Zusätzliche CSS-Klassen für das Item */
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Inhalt des Items */
  children?: Children;
}

/** Eingabe für die Berechnung des Layouts eines Items im Stack */
export interface StackItemLayoutInput {
  /** Position des Items (0 = vorderstes Item) */
  index: number;
  /** Anzahl aller Items im Stack */
  childrenCount: number;
  itemCount: number;
  expandedItemCount: number;
  scale: number;
  offset: number;
}

/** Berechnetes Layout eines Items im eingeklappten Zustand (SSR-Startwerte) */
export interface StackItemLayout {
  index: number;
  /** Ist das vorderste Item */
  isFront: boolean;
  /** Sichtbar im eingeklappten Zustand */
  visibleCollapsed: boolean;
  /** Sichtbar im aufgefächerten Zustand */
  visibleExpanded: boolean;
  /** Verschiebung in Pixeln (eingeklappt) */
  translate: number;
  /** Skalierung (eingeklappt) */
  itemScale: number;
  opacity: number;
  zIndex: number;
}

/** Parameter für den Layout-Effekt eines Items (aufgefächerter Zustand) */
export interface StackItemEffectInput {
  /** Signal-ID des Stacks */
  stackId: string;
  layout: StackItemLayout;
  gap: number;
  /** Tailwind-Klasse, die im aufgefächerten Zustand gesetzt wird (Hover-Brücke zwischen den Items) */
  expandedClass: string;
  /** Tailwind-Klasse für nicht sichtbare Items */
  hiddenClass: string;
}
