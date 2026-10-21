import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

export interface AvatarArgs {
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute */
  attributes?: HtmlAttributes;
  /** Hintergrundfarbe des Default-Avatars (z. B. "#3b82f6" oder "hsl(210, 100%, 50%)") */
  backgroundColor?: string;
  /** Textfarbe des Default-Avatars (Standard: weiß) */
  textColor?: string;
  /**
   * Bildquelle (URL, Pfad oder Data-URI, vorgesehen für .webp oder .png).
   * Ist sie gesetzt, wird das Bild anstelle von children, backgroundColor und textColor angezeigt.
   */
  source?: string;
  /** Alternativtext des Bildes (nur mit source; Standard: leer = dekorativ) */
  alt?: string;
  /** Inhalt des Default-Avatars, z. B. Initialen (wird bei gesetztem source nicht gerendert) */
  children?: Children;
}
