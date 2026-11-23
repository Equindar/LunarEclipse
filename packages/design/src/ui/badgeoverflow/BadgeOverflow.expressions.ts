/**
 * Datastar-Expressions und Bausteine des Badge-Overflows.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 *
 * Die Vorlage misst die Breiten in React (versteckter Mess-Container, useLayoutEffect, ResizeObserver) und
 * rechnet die sichtbaren Einträge nach. Der Port rendert alle Einträge und lässt den Browser die Zeilen messen:
 * Der Handler in `data-init` blendet Einträge aus, bis höchstens `lineCount` Zeilen belegt sind und der
 * Indikator noch in die letzte Zeile passt.
 */

export const DEFAULT_LINE_COUNT = 1;

/** Höhe eines Badges (h-5) und Abstand (gap-1) in Pixeln, wie die Startwerte der Vorlage (20 und 4) */
export const DEFAULT_BADGE_HEIGHT = 20;
export const DEFAULT_BADGE_GAP = 4;

export const BADGE_OVERFLOW_ITEM_SLOT = "badge-overflow-item";
export const BADGE_OVERFLOW_INDICATOR_SLOT = "badge-overflow-indicator";
export const BADGE_OVERFLOW_COUNT_ATTRIBUTE = "data-badge-overflow-count";

const TAG_PATTERN = /^[a-z][a-z0-9-]*$/;

/** Zeilenanzahl auf eine ganze Zahl >= 1 normalisieren */
export function normalizeLineCount(value?: number): number {
  if (value === undefined || !Number.isFinite(value)) return DEFAULT_LINE_COUNT;
  return Math.max(1, Math.floor(value));
}

/** Nur einfache Tag-Namen zulassen, sonst "div" (verhindert Markup-Einschleusung über `tag`) */
export function resolveTag(tag?: string): string {
  return tag && TAG_PATTERN.test(tag) ? tag : "div";
}

/**
 * Label eines Eintrags. Objekte brauchen `getBadgeLabel`, primitive Werte werden mit String() umgewandelt
 * (die Vorlage castet nur und liefert bei Zahlen deshalb keinen String).
 */
export function resolveBadgeLabel<T>(item: T, getBadgeLabel?: (item: T) => string): string {
  if (getBadgeLabel) return getBadgeLabel(item);
  if (item !== null && typeof item === "object") {
    throw new Error("`getBadgeLabel` ist erforderlich, wenn items ein Array von Objekten ist");
  }
  return String(item);
}

/**
 * Startwert der Zeilenhöhe als CSS-Variable. Bis zur ersten Messung (data-measured="false") begrenzt sie die
 * Höhe, damit nicht kurz alle Einträge in vielen Zeilen sichtbar sind (Ersatz für den minHeight-Platzhalter).
 */
export function buildInitialHeightStyle(lineCount: number): string {
  const lines = normalizeLineCount(lineCount);
  const px = lines * DEFAULT_BADGE_HEIGHT + (lines - 1) * DEFAULT_BADGE_GAP;
  return `--badge-overflow-initial-height: ${px}px`;
}

/**
 * Handler für `data-init`. Läuft beim Einfügen ins DOM und danach bei jeder Breitenänderung (ResizeObserver).
 * Hinweise: `el` ist das Wurzelelement (von Datastar bereitgestellt). Der Code enthält bewusst kein Dollarzeichen
 * und kein At-Zeichen vor Namen, weil Datastar diese als Signal- bzw. Action-Verweise umschreibt.
 * Die Suche nach der Anzahl sichtbarer Einträge ist eine binäre Suche (wenige Layout-Durchläufe).
 */
export function buildInitHandler(lineCount: number): string {
  const max = normalizeLineCount(lineCount);

  return [
    "(() => {",
    "const root = el;",
    `const max = ${max};`,
    "const part = (name) => Array.from(root.children).filter((c) => c.getAttribute('data-slot') === name);",
    "const countLines = (nodes) => {",
    "let lines = 0;",
    "let bottom = -Infinity;",
    "nodes.forEach((n) => {",
    "const r = n.getBoundingClientRect();",
    "if (r.top >= bottom - 0.5) { lines += 1; bottom = r.bottom; } else { bottom = Math.max(bottom, r.bottom); }",
    "});",
    "return lines;",
    "};",
    "const show = (items, more, counter, shown) => {",
    "items.forEach((n, i) => { n.hidden = i >= shown; });",
    "const rest = items.length - shown;",
    "more.hidden = rest === 0;",
    "if (counter) { counter.textContent = String(rest); }",
    "};",
    "const fits = (items, more, counter, shown) => {",
    "show(items, more, counter, shown);",
    "const nodes = items.filter((n) => !n.hidden);",
    "if (!more.hidden) { nodes.push(more); }",
    "return countLines(nodes) <= max;",
    "};",
    "const layout = () => {",
    `const items = part('${BADGE_OVERFLOW_ITEM_SLOT}');`,
    `const more = part('${BADGE_OVERFLOW_INDICATOR_SLOT}')[0];`,
    "if (!more || !root.clientWidth) { return; }",
    `const counter = more.querySelector('[${BADGE_OVERFLOW_COUNT_ATTRIBUTE}]');`,
    "let best = items.length;",
    "if (!fits(items, more, counter, best)) {",
    "let low = 0;",
    "let high = best - 1;",
    "while (low < high) {",
    "const mid = Math.ceil((low + high) * 0.5);",
    "if (fits(items, more, counter, mid)) { low = mid; } else { high = mid - 1; }",
    "}",
    "best = low;",
    "}",
    "show(items, more, counter, best);",
    "root.setAttribute('data-measured', 'true');",
    "};",
    "if (root.badgeOverflowObserver) { root.badgeOverflowObserver.disconnect(); }",
    "layout();",
    "let last = root.clientWidth;",
    "root.badgeOverflowObserver = new ResizeObserver(() => {",
    "const w = root.clientWidth;",
    "if (w !== last) { last = w; layout(); }",
    "});",
    "root.badgeOverflowObserver.observe(root);",
    "})()",
  ].join(" ");
}
