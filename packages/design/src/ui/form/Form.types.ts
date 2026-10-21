import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Content-Type der Formular-Übertragung ("json" z. B. für Connect RPC) */
export type FormContentType = "form" | "json";

export interface FormArgs {
  /** Form-ID (auch Basis für den Signal-Namen) */
  id?: string;
  /** Form-Action-URL (aktiviert den Datastar-Submit-Handler) */
  action?: string;
  /** Content-Type der Übertragung (Standard: "form") */
  contentType?: FormContentType;
  /** Felder für die JSON-Payload (Connect RPC); ist die Liste gesetzt, wird immer als JSON mit Signal-Filter gesendet */
  formDataFields?: string[];
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute; `data-target` wird als Ziel des @post verwendet */
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface FormItemArgs {
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface FormLabelArgs {
  /** HTML-for-Attribut (verknüpft das Label mit der ID eines Inputs) */
  for?: string;
  /** Ob das Feld einen Fehler hat (setzt data-error="true") */
  hasError?: boolean;
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

/** Im Go-Original nur als Args definiert, ohne zugehörige Komponente */
export interface FormControlArgs {
  id?: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
  attributes?: HtmlAttributes;
}

export interface FormDescriptionArgs {
  id?: string;
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface FormMessageArgs {
  id?: string;
  /** Fehlermeldung; ohne Text wird nichts gerendert */
  message?: string;
  class?: string;
  attributes?: HtmlAttributes;
}
