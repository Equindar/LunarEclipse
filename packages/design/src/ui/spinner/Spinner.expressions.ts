import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/**
 * Der Spinner hat keine Datastar-Logik; diese Datei enthält nur Attribut-Bausteine und das Icon.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_SPINNER_LABEL = "Loading";

/** Pfad des Icons "loader-circle" (lucide, in der Quelle als Loader2Icon eingebaut) */
export const SPINNER_ICON_PATHS = `<path d="M21 12a9 9 0 1 1-6.219-8.56"></path>`;

/**
 * Darstellungsattribute des SVG (wie lucide).
 * Sie werden vor den Nutzer-Attributen eingesetzt und lassen sich daher überschreiben.
 */
export function buildSpinnerSvgAttributes(): HtmlAttributes {
  return {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
  };
}

/** Standard-Attribute des Spinners: data-slot, role und aria-label (ein leeres Label fällt auf den Standard zurück) */
export function buildSpinnerAttributes(label?: string): HtmlAttributes {
  return { "data-slot": "spinner", role: "status", "aria-label": label || DEFAULT_SPINNER_LABEL };
}
