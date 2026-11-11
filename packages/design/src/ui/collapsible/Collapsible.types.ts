import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Signal-State eines Collapsibles (Wurzel, Trigger und Content teilen ihn über die gemeinsame ID) */
export interface CollapsibleSignals {
  /** Ob der Bereich geöffnet ist */
  open: boolean;
}

/** Wert des data-state-Attributs */
export type CollapsibleState = "open" | "closed";

export interface CollapsibleArgs {
  /**
   * Pflicht: ID der Wurzel (auch DOM-ID). Trigger und Content bekommen dieselbe ID als Arg,
   * weil es im HTML-String-Port keinen React-Context gibt.
   */
  id: string;
  /** Anfangszustand (Standard: false). Entspricht `defaultOpen` bzw. dem Startwert von `open` */
  open?: boolean;
  /** Deaktiviert das Collapsible (setzt data-disabled); der Trigger bekommt `disabled` separat */
  disabled?: boolean;
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Trigger und Content */
  children?: Children;
}

export interface CollapsibleTriggerArgs {
  /** Pflicht: ID der Wurzel, die gesteuert wird */
  id: string;
  /** Anfangszustand für das Server-HTML vor Datastar (muss zur Wurzel passen, Standard: false) */
  open?: boolean;
  /** Deaktiviert den Trigger (natives disabled-Attribut, kein Klick-Handler) */
  disabled?: boolean;
  /** Zusätzliche CSS-Klassen. Wird bei gesetztem `render` nicht angewendet (das Element bringt seine Klassen selbst mit) */
  class?: string;
  /**
   * Ersatz für das `render`-Prop der Quelle: bekommt die berechneten Trigger-Attribute und liefert
   * das fertige Element, z. B. `(attributes) => Button({ attributes, children: "Toggle" })`.
   * Ohne `render` wird ein `<button type="button">` mit `children` gerendert.
   */
  render?: (attributes: HtmlAttributes) => string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Inhalt des Standard-Buttons (bei gesetztem `render` ungenutzt) */
  children?: Children;
}

export interface CollapsibleContentArgs {
  /** Pflicht: ID der Wurzel, die diesen Bereich steuert (die DOM-ID des Contents ist `<id>-content`) */
  id: string;
  /** Anfangszustand für das Server-HTML vor Datastar (muss zur Wurzel passen, Standard: false) */
  open?: boolean;
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben, `style` wird ergänzt) */
  attributes?: HtmlAttributes;
  /** Auf- und zuklappbarer Inhalt */
  children?: Children;
}
