import { newDataClass } from "../../utils/DataClass";
import { newExpression } from "../../utils/DatastarExpression";
import { createSignals } from "../../utils/SignalManager";
import type { SelectSignals } from "./Select.types";

/**
 * Datastar-Expressions des Selects (ersetzt expressions.go).
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 *
 * Signal-Referenzen entstehen über den SignalManager (ID mit "-" → "_"),
 * DOM-Abfragen (data-select-id) verwenden dagegen die originale ID.
 */

export const selectDefaultSignals: SelectSignals = {
  open: false,
  value: "",
  label: "",
  highlighted: -1,
  _lastValue: "",
};

/** Signal-Manager eines Selects */
export const selectSignals = (id: string, initial: SelectSignals = selectDefaultSignals) =>
  createSignals<SelectSignals>(id, initial);

/** `document.querySelector(...)` auf das Select-Root */
const rootQuery = (selectId: string): string => `document.querySelector('[data-select-id="${selectId}"]')`;

/** Anzahl der auswählbaren Items minus 1 (Index des letzten Items) */
const lastItemIndexExpr = (selectId: string): string =>
  `${rootQuery(selectId)}.querySelectorAll('[data-select-item]:not([data-disabled])').length - 1`;

/** data-class-Expression für das hervorgehobene Item */
export function highlightedItem(selectId: string, index: number): string {
  const condition = `${selectSignals(selectId).signal("highlighted")} === ${index}`;

  return newDataClass().add("bg-accent", condition).add("text-accent-foreground", condition).build();
}

/** JS-String-Literal (inkl. Anführungszeichen und Escaping) */
export function jsStringLiteral(value: string): string {
  return JSON.stringify(value);
}

/** Item auswählen: value und label setzen, Select schließen */
export function selectItemExpression(selectId: string, value: string, labelExpr: string): string {
  const s = selectSignals(selectId);

  return [s.set("value", jsStringLiteral(value)), s.set("label", labelExpr), s.set("open", "false")].join("; ");
}

/** data-effect: führt onChange aus, sobald sich der Wert gegenüber _lastValue geändert hat */
export function selectOnChangeEffect(selectId: string, onChange: string): string {
  if (!onChange) return "";

  const s = selectSignals(selectId);

  return `if (${s.signal("value")} !== ${s.signal("_lastValue")}) { ${s.set("_lastValue", s.signal("value"))}; ${onChange} }`;
}

export function selectValueEqualsExpression(signalExpr: string, value: string): string {
  return `${signalExpr} === ${jsStringLiteral(value)}`;
}

/* Trigger */

/** Klick auf den Trigger: Select öffnen bzw. schließen, Highlight zurücksetzen */
export function buildTriggerClickHandler(selectId: string): string {
  const s = selectSignals(selectId);

  return `${s.signal("open")} ? (${s.set("open", "false")}, ${s.set("highlighted", "-1")}) : (${s.set("open", "true")}, ${s.set("highlighted", "-1")})`;
}

/** Tastatur am Trigger: Pfeile, Leertaste und Enter öffnen das Select */
export function buildTriggerKeyboardHandler(selectId: string): string {
  const s = selectSignals(selectId);
  const closed = `!${s.signal("open")}`;
  const open = (highlighted: string, key: string): string =>
    `evt.key === '${key}' && ${closed} ? (${s.set("open", "true")}, ${s.set("highlighted", highlighted)}, evt.preventDefault()) : null`;

  return newExpression()
    // ArrowDown: öffnen und erstes Item hervorheben
    .statement(open("0", "ArrowDown"))
    // ArrowUp: öffnen und letztes Item hervorheben
    .statement(open(lastItemIndexExpr(selectId), "ArrowUp"))
    // Space: öffnen ohne Highlight
    .statement(open("-1", " "))
    // Enter: nur öffnen, nichts hervorheben
    .statement(open("-1", "Enter"))
    .build();
}

/* Content */

/** Tastatur im geöffneten Select (window-weit): Navigation, Auswahl, Escape, Tab */
export function buildContentKeyboardHandler(selectId: string): string {
  const s = selectSignals(selectId);
  const highlighted = s.signal("highlighted");
  const openCheck = `${rootQuery(selectId)} && ${s.signal("open")}`;

  // Mehrere Statements pro Zweig werden mit dem Komma-Operator verbunden
  const arrowDown = `evt.key === 'ArrowDown' && ${openCheck} ? (evt.preventDefault(), evt.stopPropagation(), ${s.set("highlighted", `Math.min(${lastItemIndexExpr(selectId)}, ${highlighted} + 1)`)}) : null`;

  const arrowUp = `evt.key === 'ArrowUp' && ${openCheck} ? (evt.preventDefault(), evt.stopPropagation(), ${s.set("highlighted", `Math.max(0, ${highlighted} - 1)`)}) : null`;

  const enterSpace = `(evt.key === 'Enter' || evt.key === ' ') && ${openCheck} && ${highlighted} >= 0 ? (evt.preventDefault(), evt.stopPropagation(), ${rootQuery(selectId)}.querySelector('[data-select-item][data-index="' + ${highlighted} + '"]')?.click()) : null`;

  const escape = `evt.key === 'Escape' && ${openCheck} ? (evt.preventDefault(), evt.stopPropagation(), ${s.set("open", "false")}) : null`;

  const tab = `evt.key === 'Tab' && ${openCheck} ? ${s.set("open", "false")} : null`;

  return newExpression()
    .statement(arrowDown)
    .statement(arrowUp)
    .statement(enterSpace)
    .statement(escape)
    .statement(tab)
    .build();
}

/* Item */

/** Klick auf ein Item: Label aus dem Item lesen und Wert übernehmen */
export function buildItemClickHandler(selectId: string, value: string): string {
  const labelExpr = "evt.currentTarget.querySelector('.select-item-text')?.textContent.trim() || ''";

  return selectItemExpression(selectId, value, labelExpr);
}

/** Enter oder Leertaste am Item löst einen Klick aus */
export function buildItemKeyboardHandler(): string {
  return `(evt.key === 'Enter' || evt.key === ' ') ? (evt.preventDefault(), evt.target.click()) : null`;
}
