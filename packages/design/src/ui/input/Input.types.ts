import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Gängige HTML-Input-Typen */
export type InputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "date"
  | "datetime-local"
  | "time"
  | "month"
  | "week"
  | "color"
  | "file";

export interface InputArgs {
  /** Input-Typ (text, password, email, ...) */
  type?: InputType;
  /** Zusätzliche CSS-Klassen */
  class?: string;
  placeholder?: string;
  value?: string;
  /** name-Attribut */
  name?: string;
  /** id-Attribut */
  id?: string;
  /** Optional: Form-ID für automatisches data-bind (nur zusammen mit name) */
  formId?: string;
  disabled?: boolean;
  required?: boolean;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
}
