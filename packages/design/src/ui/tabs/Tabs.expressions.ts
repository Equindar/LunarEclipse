import { createSignals } from "../../utils/SignalManager";
import type { TabsSignals } from "./Tabs.types";

/**
 * Datastar-Expressions und Attribut-Bausteine der Tabs.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 *
 * Das Signal "value" hält den aktiven Tab. Trigger und Panel leiten ihren Zustand daraus ab.
 * Werte stehen als JS-Literale (JSON.stringify) in den Expressions, damit Anführungszeichen im Wert nichts zerbrechen.
 */

/** Signal-Manager eines Tabs-Blocks (Signal-Name = ID mit "-" zu "_") */
export const tabsSignals = (tabsId: string, value = "") => createSignals<TabsSignals>(tabsId, { value });

/** DOM-ID von Trigger oder Panel. Zeichen ausserhalb von A-Z a-z 0-9 _ - werden kollisionsfrei kodiert (~hex) */
export function tabsPartId(tabsId: string, part: "trigger" | "content", value: string): string {
  const token = value.replace(/[^A-Za-z0-9_-]/g, (char) => `~${char.codePointAt(0)?.toString(16)}`);

  return `${tabsId}-${part}-${token}`;
}

/** Bedingung: Dieser Tab ist aktiv */
export function buildIsActive(tabsId: string, value: string): string {
  return `${tabsSignals(tabsId).signal("value")} === ${JSON.stringify(value)}`;
}

/** Trigger: Tab aktivieren */
export function buildActivateHandler(tabsId: string, value: string): string {
  return tabsSignals(tabsId).set("value", JSON.stringify(value));
}

/** Trigger: data-state ("active" oder "inactive"), Ziel der Tailwind-Selektoren data-[state=active] */
export function buildStateExpression(tabsId: string, value: string): string {
  return `${buildIsActive(tabsId, value)} ? 'active' : 'inactive'`;
}

/** Trigger: aria-selected als Text ("true" oder "false"), damit das Attribut auch bei false erhalten bleibt */
export function buildSelectedExpression(tabsId: string, value: string): string {
  return `${buildIsActive(tabsId, value)} ? 'true' : 'false'`;
}

/**
 * Trigger: Roving Tabindex. Nur der aktive Tab ist per Tab-Taste erreichbar.
 * Ist kein Tab aktiv (leeres Signal), bleiben alle erreichbar, damit die Liste nicht unerreichbar wird.
 */
export function buildTabIndexExpression(tabsId: string, value: string): string {
  const signal = tabsSignals(tabsId).signal("value");

  return `(${buildIsActive(tabsId, value)} || ${signal} === '') ? '0' : '-1'`;
}

/**
 * Liste: Pfeiltasten, Home und End bewegen nur den Fokus (wie Base UI, Aktivieren per Enter oder Leertaste).
 * Die Ausrichtung wird zur Laufzeit vom nächsten Wurzelelement gelesen (data-orientation).
 * Deaktivierte Tabs werden übersprungen.
 */
export function buildListKeydownHandler(): string {
  return [
    "(() => {",
    "const root = el.closest('[data-tabs-id]');",
    "const vertical = root?.getAttribute('data-orientation') === 'vertical';",
    "const prevKey = vertical ? 'ArrowUp' : 'ArrowLeft';",
    "const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';",
    "const tabs = [...el.querySelectorAll('[role=\"tab\"]:not([disabled])')];",
    "const index = tabs.indexOf(document.activeElement);",
    "if (index < 0) return;",
    "const target = evt.key === nextKey ? tabs[(index + 1) % tabs.length]",
    " : evt.key === prevKey ? tabs[(index - 1 + tabs.length) % tabs.length]",
    " : evt.key === 'Home' ? tabs[0]",
    " : evt.key === 'End' ? tabs[tabs.length - 1]",
    " : null;",
    "if (!target) return;",
    "evt.preventDefault();",
    "target.focus();",
    "})()",
  ].join(" ");
}

/** Liste: aria-orientation einmalig aus dem Wurzelelement übernehmen */
export function buildOrientationEffect(): string {
  return "el.setAttribute('aria-orientation', el.closest('[data-tabs-id]')?.getAttribute('data-orientation') ?? 'horizontal')";
}
