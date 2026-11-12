
import { buildConditional } from "../../utils/buildConditional";
import { newExpression } from "../../utils/DatastarExpression";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { createSignals } from "../../utils/SignalManager";
import type { SidebarCollapsible, SidebarSignals } from "./Sidebar.types";

/**
 * Datastar-Expressions und Attribut-Bausteine der Sidebar
 * (ersetzt SidebarContext, useSidebar und die Effekte der React-Vorlage).
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const SIDEBAR_COOKIE_NAME = "sidebar_state";
/** Eine Woche in Sekunden */
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const SIDEBAR_WIDTH = "16rem";
export const SIDEBAR_WIDTH_MOBILE = "18rem";
export const SIDEBAR_WIDTH_ICON = "3rem";
export const SIDEBAR_KEYBOARD_SHORTCUT = "b";
/** Entspricht useIsMobile der Vorlage (Breakpoint 768px) */
export const SIDEBAR_MOBILE_QUERY = "(max-width: 767px)";

/** Initialer Signal-State */
export const sidebarInitialSignals = (defaultOpen = true): SidebarSignals => ({
  open: defaultOpen,
  openMobile: false,
});

/** Signal-Manager der Sidebar (Signal-Name = ID mit "-" zu "_") */
export const sidebarSignals = (id: string, defaultOpen = true) =>
  createSignals<SidebarSignals>(id, sidebarInitialSignals(defaultOpen));

const isMobile = `window.matchMedia('${SIDEBAR_MOBILE_QUERY}').matches`;

/**
 * toggleSidebar der Vorlage: mobil das Overlay, sonst die Desktop-Sidebar.
 * Wie setOpen der Vorlage wird auf dem Desktop der Zustand im Cookie abgelegt.
 */
export function buildToggleHandler(id: string): string {
  const s = sidebarSignals(id);
  const desktop = `(${s.toggle("open")}, document.cookie = '${SIDEBAR_COOKIE_NAME}=' + ${s.signal("open")} + '; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}')`;
  const mobile = `(${s.toggle("openMobile")})`;

  return buildConditional(isMobile, mobile, desktop);
}

/** Tastenkürzel Strg/Cmd + B (am Wrapper mit __window) */
export function buildKeyboardShortcutHandler(id: string): string {
  const condition = `evt.key === '${SIDEBAR_KEYBOARD_SHORTCUT}' && (evt.metaKey || evt.ctrlKey)`;

  return buildConditional(condition, `(evt.preventDefault(), ${buildToggleHandler(id)})`, "void 0");
}

/** Mobiles Overlay schließen (Klick auf den Hintergrund) */
export function buildCloseMobileHandler(id: string): string {
  return sidebarSignals(id).set("openMobile", "false");
}

/** Escape schließt das mobile Overlay */
export function buildEscapeHandler(id: string): string {
  const s = sidebarSignals(id);

  return s.conditionalAction(`evt.key === 'Escape' && ${s.signal("openMobile")}`, "openMobile", "false");
}

/**
 * Zustandsattribute der Desktop-Sidebar (data-state und data-collapsible) als data-attr-Objekt.
 * data-collapsible ist nur im eingeklappten Zustand gesetzt, wie in der Vorlage.
 */
export function buildStateAttrExpression(id: string, collapsible: SidebarCollapsible): string {
  const open = sidebarSignals(id).signal("open");

  return `{'data-state': ${open} ? 'expanded' : 'collapsed', 'data-collapsible': ${open} ? '' : '${collapsible}'}`;
}

/** Statische Zustandsattribute (vor dem Laden von Datastar) */
export function buildStateAttributes(open: boolean, collapsible: SidebarCollapsible): HtmlAttributes {
  return {
    "data-state": open ? "expanded" : "collapsed",
    "data-collapsible": open ? "" : collapsible,
  };
}

/** Tooltip des MenuButtons nur zeigen, wenn die Desktop-Sidebar eingeklappt ist (hidden-Bedingung der Vorlage) */
export function buildTooltipShowHandler(sidebarId: string, tooltipId: string): string {
  const open = sidebarSignals(sidebarId).signal("open");

  return newExpression()
    .conditional(
      `!${open} && !${isMobile}`,
      `document.getElementById(${JSON.stringify(tooltipId)}).showPopover()`,
      "null"
    )
    .build();
}

export function buildTooltipHideHandler(tooltipId: string): string {
  return `document.getElementById(${JSON.stringify(tooltipId)})?.hidePopover()`;
}

/** data-slot und data-sidebar, wie sie useRender/state der Vorlage rendert */
export function buildSidebarDataAttributes(slot: string, sidebar?: string): HtmlAttributes {
  const attrs: HtmlAttributes = { "data-slot": slot };
  if (sidebar) attrs["data-sidebar"] = sidebar;
  return attrs;
}

/** Zufällige ID im Format `<prefix>_<8 hex>` */
export function createRandomId(prefix: string): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return `${prefix}_${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
}

/** Zufällige Breite des Skeleton-Texts zwischen 50% und 89% (wie die Vorlage) */
export function randomSkeletonWidth(): string {
  return `${Math.floor(Math.random() * 40) + 50}%`;
}
