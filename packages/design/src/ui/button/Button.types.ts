import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

export type ButtonSize = "default" | "sm" | "lg" | "icon";

export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";


/** Entspricht ButtonArgs */
export interface ButtonArgs {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute, z. B. Datastar-Attribute */
  attributes?: HtmlAttributes;
  /** Disabled macht den Button nicht-interaktiv */
  disabled?: boolean;
  /** Type: "button" | "submit" | "reset" */
  type?: "button" | "submit" | "reset" | "";
  /** Inhalt des Buttons (bereits fertiges HTML/Text) */
  children?: Children;
}
