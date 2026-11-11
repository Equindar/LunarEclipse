import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { createSignals } from "../../utils/SignalManager";
import type { CollapsibleSignals, CollapsibleState } from "./Collapsible.types";

/**
 * Datastar-Expressions und Attribut-Bausteine des Collapsibles.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_COLLAPSIBLE_OPEN = false;

/** Signal-Manager eines Collapsibles (Signal-Name = ID mit "-" zu "_") */
export const collapsibleSignals = (id: string, open: boolean = DEFAULT_COLLAPSIBLE_OPEN) =>
  createSignals<CollapsibleSignals>(id, { open });

/** DOM-ID des Contents (für aria-controls und id) */
export const buildContentId = (id: string): string => `${id}-content`;

/** Wert von data-state für den Server-Zustand */
export const toState = (open: boolean): CollapsibleState => (open ? "open" : "closed");

/** Klick-Handler des Triggers: open umschalten */
export const buildToggleHandler = (id: string): string => collapsibleSignals(id).toggle("open");

/** Reaktiver Wert für data-state: 'open' oder 'closed' */
const buildStateExpression = (id: string): string =>
  collapsibleSignals(id).conditional("open", "'open'", "'closed'");

/** Reaktiver Wert für aria-expanded: 'true' oder 'false' (Strings, damit das Attribut nicht entfernt wird) */
const buildExpandedExpression = (id: string): string =>
  collapsibleSignals(id).conditional("open", "'true'", "'false'");

/** Standard-Attribute der Wurzel: id, data-slot, Zustand und das Signal */
export function buildRootAttributes(id: string, open: boolean, disabled: boolean): HtmlAttributes {
  const attrs: HtmlAttributes = {
    id,
    "data-slot": "collapsible",
    "data-state": toState(open),
    "data-signals": collapsibleSignals(id, open).dataSignals,
    "data-attr:data-state": buildStateExpression(id),
  };

  if (disabled) attrs["data-disabled"] = true;

  return attrs;
}

/**
 * Standard-Attribute des Triggers. Ein deaktivierter Trigger bekommt keinen Klick-Handler,
 * damit er auch dann nichts umschaltet, wenn er über `render` in ein Nicht-Button-Element gerendert wird.
 */
export function buildTriggerAttributes(id: string, open: boolean, disabled: boolean): HtmlAttributes {
  const attrs: HtmlAttributes = {
    type: "button",
    "data-slot": "collapsible-trigger",
    "data-state": toState(open),
    "aria-controls": buildContentId(id),
    "aria-expanded": String(open),
    "data-attr:data-state": buildStateExpression(id),
    "data-attr:aria-expanded": buildExpandedExpression(id),
  };

  if (disabled) {
    attrs.disabled = true;
    attrs["data-disabled"] = true;
  } else {
    attrs["data-on:click"] = buildToggleHandler(id);
  }

  return attrs;
}

/**
 * Inline-Style des Contents. Geschlossen: `display: none;` (kein Flackern vor dem Laden von Datastar).
 * Ein vom Nutzer übergebener style bleibt erhalten und wird angehängt.
 */
export function buildContentStyle(open: boolean, userStyle?: string | number | boolean): string {
  const parts = [open ? "" : "display: none;", typeof userStyle === "string" ? userStyle : ""];

  return parts.filter(Boolean).join(" ");
}

/** Standard-Attribute des Contents: id, data-slot, Sichtbarkeit per data-show und Zustand */
export function buildContentAttributes(id: string, open: boolean, userStyle?: string | number | boolean): HtmlAttributes {
  const attrs: HtmlAttributes = {
    id: buildContentId(id),
    "data-slot": "collapsible-content",
    "data-state": toState(open),
    "data-show": collapsibleSignals(id).signal("open"),
    "data-attr:data-state": buildStateExpression(id),
  };

  const style = buildContentStyle(open, userStyle);
  if (style) attrs.style = style;

  return attrs;
}
