import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/**
 * Datastar-Expression und Attribut-Bausteine des Dark-Mode-Toggles.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

/** Klasse am html-Element für den dunklen Modus (ohne diese Klasse gilt der helle Modus) */
export const DARK_MODE_CLASS = "dark";

export const DEFAULT_DARK_MODE_TOGGLE_LABEL = "Dunkelmodus umschalten";

/** Click-Handler: schaltet die Klasse "dark" am html-Element um */
export function buildDarkModeToggleClickHandler(): string {
  return `document.documentElement.classList.toggle('${DARK_MODE_CLASS}')`;
}

/** Standard-Attribute des Buttons */
export function buildDarkModeToggleAttributes(label: string): HtmlAttributes {
  return {
    type: "button",
    "data-slot": "dark-mode-toggle",
    "aria-label": label,
    title: label,
    "data-on:click": buildDarkModeToggleClickHandler(),
  };
}
