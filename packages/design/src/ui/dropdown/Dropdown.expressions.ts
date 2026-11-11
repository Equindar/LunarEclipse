import { createSignals } from "../../utils/SignalManager";
import type { DropdownSignals } from "./Dropdown.types";

/**
 * Datastar-Expressions und Positionierung des Dropdown-Menüs (ersetzt expressions.go).
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

const DEFAULT_SIDE_OFFSET = 4;

/** Signal-Manager eines Dropdowns (Signal-Name = ID mit "-" → "_") */
export const dropdownSignals = (id: string, open = false) => createSignals<DropdownSignals>(id, { open });

/** DOM-ID des Content-Elements; der Trigger nutzt sie, um die Position zu setzen */
export const dropdownMenuContentId = (id: string): string => `${id}-content`;

/** Click-outside: Dropdown schließen, wenn es offen ist */
export function buildClickOutsideHandler(id: string): string {
  const s = dropdownSignals(id);

  return s.conditionalAction(s.signal("open"), "open", "false");
}

/** Escape: Dropdown schließen, wenn es offen ist */
export function buildEscapeHandler(id: string): string {
  const s = dropdownSignals(id);

  return s.conditionalAction(`evt.key === 'Escape' && ${s.signal("open")}`, "open", "false");
}

/**
 * Klick auf den Trigger: Position des Triggers als CSS-Variablen am Content setzen, dann open umschalten.
 * `el` ist das Element, an dem Datastar den Handler registriert hat.
 */
export function buildTriggerClickExpr(id: string): string {
  const s = dropdownSignals(id);
  const contentId = JSON.stringify(dropdownMenuContentId(id));

  const positionExpr =
    `(function(){const c=document.getElementById(${contentId});if(c){const r=el.getBoundingClientRect();` +
    `c.style.setProperty('--dui-dropdown-trigger-top',r.top+'px');` +
    `c.style.setProperty('--dui-dropdown-trigger-right',r.right+'px');` +
    `c.style.setProperty('--dui-dropdown-trigger-bottom',r.bottom+'px');` +
    `c.style.setProperty('--dui-dropdown-trigger-left',r.left+'px');` +
    `c.style.setProperty('--dui-dropdown-trigger-center-x',(r.left+r.width/2)+'px');` +
    `c.style.setProperty('--dui-dropdown-trigger-center-y',(r.top+r.height/2)+'px');}})()`;

  return `${positionExpr}; ${s.toggle("open")}`;
}

/** Klick auf ein Item: Dropdown schließen, danach optional die onClick-Expression ausführen */
export function buildItemClickExpr(id: string, onClick = ""): string {
  const hideExpr = dropdownSignals(id).set("open", "false");

  return onClick ? `${hideExpr}; ${onClick}` : hideExpr;
}

/**
 * Inline-Style zur Positionierung des Contents anhand der Trigger-CSS-Variablen
 * (--dui-dropdown-trigger-*, vom Trigger-Klick gesetzt).
 * Der Offset wird in Tailwind-Spacing-Einheiten angegeben (1 = 0.25rem).
 */
export function buildContentPositionStyle(side?: string, align?: string, sideOffset = 0): string {
  const offset = sideOffset || DEFAULT_SIDE_OFFSET;
  const offsetCss = `${(offset * 0.25).toFixed(2)}rem`;

  let top = "";
  let left = "";
  const transforms: string[] = [];

  switch (side) {
    case "top":
      top = `calc(var(--dui-dropdown-trigger-top, 0px) - ${offsetCss})`;
      transforms.push("translateY(-100%)");
      break;
    case "left":
      left = `calc(var(--dui-dropdown-trigger-left, 0px) - ${offsetCss})`;
      transforms.push("translateX(-100%)");
      break;
    case "right":
      left = `calc(var(--dui-dropdown-trigger-right, 0px) + ${offsetCss})`;
      break;
    default:
      top = `calc(var(--dui-dropdown-trigger-bottom, 0px) + ${offsetCss})`;
  }

  if (side === "left" || side === "right") {
    // Seitlich: Ausrichtung entlang der vertikalen Achse
    switch (align) {
      case "end":
        top = "var(--dui-dropdown-trigger-bottom, 0px)";
        transforms.push("translateY(-100%)");
        break;
      case "center":
        top = "var(--dui-dropdown-trigger-center-y, 0px)";
        transforms.push("translateY(-50%)");
        break;
      default:
        top = "var(--dui-dropdown-trigger-top, 0px)";
    }
  } else {
    // Oben/unten: Ausrichtung entlang der horizontalen Achse
    switch (align) {
      case "end":
        left = "var(--dui-dropdown-trigger-right, 0px)";
        transforms.push("translateX(-100%)");
        break;
      case "center":
        left = "var(--dui-dropdown-trigger-center-x, 0px)";
        transforms.push("translateX(-50%)");
        break;
      default:
        left = "var(--dui-dropdown-trigger-left, 0px)";
    }
  }

  let style = `display: none; top: ${top}; left: ${left};`;
  if (transforms.length > 0) {
    style += ` transform: ${transforms.join(" ")};`;
  }

  return style;
}
