import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

export type SidebarSide = "left" | "right";
export type SidebarVariant = "sidebar" | "floating" | "inset";
export type SidebarCollapsible = "offcanvas" | "icon" | "none";
export type SidebarMenuButtonVariant = "default" | "outline";
export type SidebarMenuButtonSize = "default" | "sm" | "lg";
export type SidebarMenuSubButtonSize = "sm" | "md";

/**
 * Signal-State der Sidebar (ersetzt den React-Context der Vorlage).
 * Der Root (SidebarProvider) rendert data-signals, alle Teile bilden ihre Referenzen über dieselbe id.
 */
export interface SidebarSignals {
  /** Desktop: Sidebar ausgeklappt (entspricht `open` der Vorlage) */
  open: boolean;
  /** Mobil: Sidebar als Overlay geöffnet (entspricht `openMobile`) */
  openMobile: boolean;
}

/** Gemeinsame Args für Teile ohne eigene Logik */
export interface SidebarBaseArgs {
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface SidebarProviderArgs extends SidebarBaseArgs {
  /** ID der Sidebar-Instanz; alle Teile (Sidebar, Trigger, Rail, MenuButton) verwenden dieselbe ID. Ohne Angabe wird `sidebar_<8 hex>` erzeugt */
  id?: string;
  /** Startzustand der Desktop-Sidebar (Standard: true) */
  defaultOpen?: boolean;
}

export interface SidebarArgs extends SidebarBaseArgs {
  /** Pflicht: ID des SidebarProviders */
  id: string;
  /** Seite (Standard: "left") */
  side?: SidebarSide;
  /** Darstellung (Standard: "sidebar") */
  variant?: SidebarVariant;
  /** Einklappverhalten (Standard: "offcanvas") */
  collapsible?: SidebarCollapsible;
  /**
   * Startzustand für das statische HTML (vor dem Laden von Datastar).
   * Muss zu `SidebarProviderArgs.defaultOpen` passen (Standard: true).
   */
  defaultOpen?: boolean;
}

export interface SidebarTriggerArgs extends SidebarBaseArgs {
  /** Pflicht: ID des SidebarProviders */
  id: string;
}

export interface SidebarRailArgs extends SidebarBaseArgs {
  /** Pflicht: ID des SidebarProviders */
  id: string;
}

export type SidebarInsetArgs = SidebarBaseArgs;

/** Wird an `Input` weitergereicht, children gibt es nicht */
export type SidebarInputArgs = Omit<SidebarBaseArgs, "children">;

export type SidebarHeaderArgs = SidebarBaseArgs;
export type SidebarFooterArgs = SidebarBaseArgs;
export type SidebarSeparatorArgs = Omit<SidebarBaseArgs, "children">;
export type SidebarContentArgs = SidebarBaseArgs;
export type SidebarGroupArgs = SidebarBaseArgs;
export type SidebarGroupContentArgs = SidebarBaseArgs;
export type SidebarMenuArgs = SidebarBaseArgs;
export type SidebarMenuItemArgs = SidebarBaseArgs;
export type SidebarMenuBadgeArgs = SidebarBaseArgs;
export type SidebarMenuSubArgs = SidebarBaseArgs;
export type SidebarMenuSubItemArgs = SidebarBaseArgs;

export interface SidebarGroupLabelArgs extends SidebarBaseArgs {
  /** Ersatz für `render` der Vorlage: mit href wird ein Link statt eines div gerendert */
  href?: string;
}

export interface SidebarGroupActionArgs extends SidebarBaseArgs {
  /** Ersatz für `render` der Vorlage: mit href wird ein Link statt eines button gerendert */
  href?: string;
}

export interface SidebarMenuButtonArgs extends SidebarBaseArgs {
  /** Ersatz für `render` der Vorlage: mit href wird ein Link statt eines button gerendert */
  href?: string;
  /** Aktiver Eintrag (rendert `data-active`) */
  isActive?: boolean;
  variant?: SidebarMenuButtonVariant;
  size?: SidebarMenuButtonSize;
  /** Tooltip-Text, wird nur bei eingeklappter Desktop-Sidebar gezeigt. Erfordert `sidebarId` */
  tooltip?: string;
  /** ID des SidebarProviders (Pflicht, sobald `tooltip` gesetzt ist) */
  sidebarId?: string;
}

export interface SidebarMenuActionArgs extends SidebarBaseArgs {
  /** Ersatz für `render` der Vorlage: mit href wird ein Link statt eines button gerendert */
  href?: string;
  /** Nur bei Hover/Fokus des Eintrags sichtbar (ab md-Breite) */
  showOnHover?: boolean;
}

export interface SidebarMenuSkeletonArgs extends Omit<SidebarBaseArgs, "children"> {
  /** Icon-Platzhalter anzeigen */
  showIcon?: boolean;
  /** Breite des Text-Platzhalters, z. B. "70%". Ohne Angabe zufällig zwischen 50% und 89% (wie die Vorlage) */
  width?: string;
}

export interface SidebarMenuSubButtonArgs extends SidebarBaseArgs {
  href?: string;
  size?: SidebarMenuSubButtonSize;
  isActive?: boolean;
}
