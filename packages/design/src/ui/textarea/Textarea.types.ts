import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

export interface TextareaArgs {
  /** Zusätzliche CSS-Klassen */
  class?: string;
  placeholder?: string;
  /** Inhalt der Textarea (wird als Text escaped) */
  value?: string;
  /** name-Attribut */
  name?: string;
  /** id-Attribut */
  id?: string;
  /** Optional: Form-ID für automatisches data-bind (nur zusammen mit name) */
  formId?: string;
  /** Anzahl der Zeilen (Standard: 4) */
  rows?: number;
  disabled?: boolean;
  required?: boolean;
  /** Entfernt Rahmen und Fokus-Styles */
  borderless?: boolean;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
}
