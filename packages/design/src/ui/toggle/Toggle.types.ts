import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Visueller Stil des Toggles */
export type ToggleVariant = "default" | "outline";

/** Grösse des Toggles */
export type ToggleSize = "default" | "sm" | "lg";

/** Signal-State eines Toggles */
export interface ToggleSignals {
  /** Ob der Toggle aktuell eingeschaltet ist */
  pressed: boolean;
}

export interface ToggleArgs {
  /**
   * ID des Toggles (Standard: Zufalls-ID "toggle_<8 Hex-Zeichen>").
   * Daraus wird der Signal-Name gebildet ("-" wird zu "_").
   */
  id?: string;
  /** Visueller Stil (Standard: "default") */
  variant?: ToggleVariant;
  /** Grösse (Standard: "default") */
  size?: ToggleSize;
  /** Anfangszustand: eingeschaltet (Standard: false). Entspricht `defaultPressed` in Base UI */
  defaultPressed?: boolean;
  /** Deaktiviert den Toggle */
  disabled?: boolean;
  /**
   * Datastar-Expression, die nach jedem Umschalten läuft, z. B. "@post('/toggle', {contentType: 'json'})".
   * Das Signal `$<id>.pressed` hat dann bereits den neuen Wert. Entspricht `onPressedChange` in Base UI.
   */
  onPressedChange?: string;
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute, z. B. `aria-label` (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
  /** Inhalt des Toggles (Text und/oder Icon) */
  children?: Children;
}
