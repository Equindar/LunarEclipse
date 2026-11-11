import type { Children } from "../../types/Children";
import type { AnchorAlign, AnchorSide } from "../../utils/getAnchorPosition";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Signal-State eines Dropdown-Menüs */
export interface DropdownSignals {
  open: boolean;
}

/** Visueller Stil eines Menü-Items */
export type DropdownMenuItemVariant = "default" | "destructive";

export interface DropdownMenuArgs {
  /** Eindeutige ID (ohne Angabe wird eine zufällige ID erzeugt) */
  id?: string;
  class?: string;
  attributes?: HtmlAttributes;
  /** Open-Zustand (controlled) */
  open?: boolean;
  /** Initialer Open-Zustand */
  defaultOpen?: boolean;
  children?: Children;
}

export interface DropdownMenuTriggerArgs {
  /** ID des Dropdowns (verknüpft den Trigger mit dem richtigen Menü) */
  id: string;
  class?: string;
  attributes?: HtmlAttributes;
  /** Rendert einen Wrapper (span) um beliebige Kinder, z. B. einen Button; überträgt keine Attribute auf das Kind */
  asChild?: boolean;
  /** Macht den Trigger nicht interaktiv */
  disabled?: boolean;
  children?: Children;
}

export interface DropdownMenuContentArgs {
  /** ID des Dropdowns (verknüpft den Inhalt mit dem richtigen Menü) */
  id: string;
  class?: string;
  attributes?: HtmlAttributes;
  /** Ausrichtung relativ zum Trigger */
  align?: AnchorAlign;
  /** Seite relativ zum Trigger */
  side?: AnchorSide;
  /** Abstand zum Trigger in Tailwind-Spacing-Einheiten (1 = 0.25rem, Standard: 4) */
  sideOffset?: number;
  children?: Children;
}

export interface DropdownMenuItemArgs {
  /** ID des Dropdowns */
  id: string;
  class?: string;
  attributes?: HtmlAttributes;
  /** Linkes Padding für eingerückte Items */
  inset?: boolean;
  variant?: DropdownMenuItemVariant;
  disabled?: boolean;
  /** Rendert einen Wrapper für Kinder, ohne Klick-Handler und tabindex (nur zur Kompatibilität) */
  asChild?: boolean;
  /** Optionale Datastar-Expression, die nach dem Schließen des Dropdowns ausgeführt wird, z. B. "@post('/api/action')" */
  onClick?: string;
  children?: Children;
}

/** Menü-Item als Link (anchor) */
export interface DropdownMenuLinkItemArgs {
  /** ID des Dropdowns */
  id: string;
  /** Ziel-URL */
  href?: string;
  target?: string;
  rel?: string;
  variant?: DropdownMenuItemVariant;
  disabled?: boolean;
  /** Optionale Datastar-Expression, die nach dem Schließen des Dropdowns ausgeführt wird */
  onClick?: string;
  inset?: boolean;
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

/** Menü-Item als Formular mit Submit-Button */
export interface DropdownMenuFormItemArgs {
  /** ID des Dropdowns */
  id: string;
  /** Form-Action-URL */
  action?: string;
  /** Form-Methode (Standard: post) */
  method?: string;
  variant?: DropdownMenuItemVariant;
  disabled?: boolean;
  inset?: boolean;
  /** Zusätzliche CSS-Klassen für das Formular */
  class?: string;
  /** Zusätzliche HTML-Attribute für das Formular */
  attributes?: HtmlAttributes;
  /** Zusätzliche HTML-Attribute für den Submit-Button */
  buttonAttributes?: HtmlAttributes;
  children?: Children;
}

/** Menü-Item mit beliebigem Inhalt */
export interface DropdownMenuCustomItemArgs {
  /** ID des Dropdowns */
  id: string;
  variant?: DropdownMenuItemVariant;
  disabled?: boolean;
  /** Schließt das Dropdown beim Klick auf das Item */
  closeOnClick?: boolean;
  inset?: boolean;
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface DropdownMenuLabelArgs {
  /** Im Go-Original optional und ungenutzt */
  id?: string;
  class?: string;
  attributes?: HtmlAttributes;
  /** Linkes Padding für eingerückte Labels */
  inset?: boolean;
  children?: Children;
}

export interface DropdownMenuSeparatorArgs {
  /** Im Go-Original optional und ungenutzt */
  id?: string;
  class?: string;
  attributes?: HtmlAttributes;
}

export interface DropdownMenuShortcutArgs {
  /** Im Go-Original optional und ungenutzt */
  id?: string;
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface DropdownMenuGroupArgs {
  /** Im Go-Original optional und ungenutzt */
  id?: string;
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}
