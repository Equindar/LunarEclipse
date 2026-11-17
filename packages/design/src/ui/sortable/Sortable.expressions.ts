import { createSignals } from "../../utils/SignalManager";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type { SortableArgs, SortableOrientation, SortableSignals, SortableValue } from "./Sortable.types";

/**
 * Datastar-Expressions des Sortable.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 *
 * Ersatz für dnd-kit: Die Drag-Logik läuft einmalig pro Root in einer `data-init`-Expression
 * (Pointer Events mit Pointer-Capture, Tastatur-Sortierung, Live-Region). Die `data-on:*`-Attribute
 * rufen nur noch Methoden von `el.__sortableApi` auf. Die Reihenfolge ist die DOM-Reihenfolge,
 * Signale halten nur `activeId`, `order` und `announcement`.
 *
 * Hinweise für die Expression:
 * - Datastar ersetzt jedes `$name` im Code, deshalb steht darin kein `$` ausser bei Signalen.
 * - Kein `-` direkt hinter einem Signal ohne Leerzeichen (`$a.b-1` wäre ein Signalname).
 * - Keine `//`-Kommentare, der Code wird in eine Zeile gelegt.
 */

export const DEFAULT_SORTABLE_ORIENTATION: SortableOrientation = "vertical";

/** Pixel Bewegung, bevor ein Mauszug beginnt (wie MouseSensor in dnd-kit) */
const MOUSE_DISTANCE_PX = 4;
/** Verzögerung und Toleranz für Touch (wie TouchSensor in dnd-kit) */
const TOUCH_DELAY_MS = 250;
const TOUCH_TOLERANCE_PX = 5;

const ITEM = '[data-slot="sortable-item"]';
const HANDLE = '[data-slot="sortable-item-handle"]';
const ROOT = '[data-slot="sortable"]';

/** Pfeiltasten je Richtung: -1 = vor, 1 = nach dem Nachbarn */
const ARROW_DIRECTIONS: Record<SortableOrientation, Record<string, number>> = {
  vertical: { ArrowUp: -1, ArrowDown: 1 },
  horizontal: { ArrowLeft: -1, ArrowRight: 1 },
  mixed: { ArrowUp: -1, ArrowLeft: -1, ArrowDown: 1, ArrowRight: 1 },
};

/** Initialer Signal-State */
export const sortableInitialSignals: SortableSignals = {
  activeId: "",
  order: [],
  announcement: "",
};

/** Signal-Manager einer Sortable-Instanz (Signal-Name = ID mit "-" → "_") */
export const sortableSignals = (id: string, value: readonly SortableValue[] = []) =>
  createSignals<SortableSignals>(id, { ...sortableInitialSignals, order: value.map(String) });

const TAG_PATTERN = /^[a-z][a-z0-9-]*$/;

/** Prüft einen vom Nutzer angegebenen Tag-Namen (verhindert Markup-Injektion über `tag`) */
export function resolveSortableTag(tag: string | undefined, fallback: string): string {
  if (tag === undefined || tag === "") return fallback;
  if (!TAG_PATTERN.test(tag)) throw new Error(`Ungültiger Tag-Name für Sortable: "${tag}"`);
  return tag;
}

/** Anleitung für Screenreader (wie screenReaderInstructions in dnd-kit) */
export function buildSortableDescription(orientation: SortableOrientation): string {
  const keys = orientation === "vertical" ? "up and down" : orientation === "horizontal" ? "left and right" : "arrow";
  return `To pick up a sortable item, press space or enter. While dragging, use the ${keys} keys to move the item. Press space or enter again to drop the item in its new position, or press escape to cancel.`;
}

/** ID des versteckten Anleitungs-Elements (wird per aria-describedby referenziert) */
export const sortableDescriptionId = (sortableId: string): string => `${sortableId}-description`;

const js = (...parts: string[]): string => parts.join(" ");

/**
 * Drag-Logik als `data-init`-Expression. Legt `el.__sortableApi` an.
 * Zustand (`active`, `pending`) liegt im Closure, nicht im DOM.
 */
export function buildSortableInit(id: string, orientation: SortableOrientation): string {
  const s = sortableSignals(id);

  return js(
    "el.__sortableApi = (() => {",
    "const root = el;",
    `const orient = ${JSON.stringify(orientation)};`,
    `const dirs = ${JSON.stringify(ARROW_DIRECTIONS[orientation])};`,
    "let active = null;",
    "let pending = null;",

    // Hilfsfunktionen
    `const own = (n) => !!n && n.closest('${ROOT}') === root;`,
    `const itemOf = (n) => { const i = n && n.closest ? n.closest('${ITEM}') : null; return own(i) ? i : null; };`,
    "const valueOf = (i) => i.getAttribute('data-value');",
    `const all = () => Array.from(root.querySelectorAll('${ITEM}')).filter(own);`,
    `const activatorOf = (i) => i.hasAttribute('data-as-handle') ? i : i.querySelector('${HANDLE}');`,
    `const say = (t) => { ${s.set("announcement", "t")}; };`,
    "const emit = (name, detail) => { root.dispatchEvent(new CustomEvent(name, { detail: detail })); };",
    `const mark = (item, on) => { [item].concat(Array.from(item.querySelectorAll('${HANDLE}'))).forEach((n) => { if (on) { n.setAttribute('data-dragging', ''); } else { n.removeAttribute('data-dragging'); } }); const a = activatorOf(item); if (a) { if (on) { a.setAttribute('aria-pressed', 'true'); } else { a.removeAttribute('aria-pressed'); } } };`,

    // Aufnehmen
    "const begin = (item, mode) => {",
    "const v = valueOf(item);",
    "const order = all().map(valueOf);",
    "active = { item: item, mode: mode, id: 0, offX: 0, offY: 0, parent: item.parentElement, next: item.nextElementSibling, order: order };",
    `${s.set("activeId", "v")};`,
    `say('Grabbed sortable item "' + v + '". Current position is ' + (order.indexOf(v) + 1) + ' of ' + order.length + '. Use arrow keys to move, space to drop.');`,
    "emit('sortable-start', { value: v, index: order.indexOf(v) });",
    "};",

    // Dem Zeiger folgen (Transform, begrenzt auf Achse und Eltern-Element)
    "const follow = (x, y) => {",
    "const item = active.item;",
    "item.style.transform = '';",
    "const r = item.getBoundingClientRect();",
    "const p = item.parentElement.getBoundingClientRect();",
    "let dx = 0;",
    "let dy = 0;",
    "if (orient !== 'vertical') { dx = Math.min(Math.max(x - active.offX - r.left, p.left - r.left), p.right - r.right); }",
    "if (orient !== 'horizontal') { dy = Math.min(Math.max(y - active.offY - r.top, p.top - r.top), p.bottom - r.bottom); }",
    "item.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';",
    "};",

    // Einfügeposition anhand des Eintrags unter dem Zeiger (Mittellinien-Regel verhindert Flackern)
    "const hover = (x, y) => {",
    "const item = active.item;",
    "const stack = document.elementsFromPoint(x, y);",
    "let over = null;",
    "for (let i = 0; i < stack.length; i += 1) { const c = itemOf(stack[i]); if (c && c !== item && c.parentElement === item.parentElement) { over = c; break; } }",
    "if (!over) { return; }",
    "const o = over.getBoundingClientRect();",
    "let before = false;",
    "if (orient === 'horizontal') { before = x < o.left + o.width / 2; }",
    "else if (orient === 'vertical') { before = y < o.top + o.height / 2; }",
    "else { before = Math.abs(item.offsetTop - over.offsetTop) < over.offsetHeight / 2 ? x < o.left + o.width / 2 : y < o.top + o.height / 2; }",
    "const ref = before ? over : over.nextElementSibling;",
    "if (ref === item || item.nextElementSibling === ref) { return; }",
    "item.parentElement.insertBefore(item, ref);",
    "};",

    // Ablegen oder Abbrechen
    "const finish = (cancelled) => {",
    "const st = active;",
    "if (!st) { return; }",
    "active = null;",
    "const item = st.item;",
    "const v = valueOf(item);",
    "item.style.transform = '';",
    "if (st.mode === 'pointer') {",
    "try { item.releasePointerCapture(st.id); } catch (e) { }",
    "const swallow = (e) => { e.stopPropagation(); e.preventDefault(); };",
    "root.addEventListener('click', swallow, true);",
    "setTimeout(() => { root.removeEventListener('click', swallow, true); }, 0);",
    "}",
    "mark(item, false);",
    "if (cancelled) { st.parent.insertBefore(item, st.next && st.next.parentNode === st.parent ? st.next : null); }",
    "const order = all().map(valueOf);",
    "const from = st.order.indexOf(v);",
    "const to = order.indexOf(v);",
    `${s.set("activeId", "''")};`,
    `if (cancelled) { say('Sorting cancelled. Sortable item "' + v + '" returned to position ' + (from + 1) + ' of ' + order.length + '.'); emit('sortable-cancel', { value: v, index: from }); return; }`,
    `say('Sortable item "' + v + '" dropped at position ' + (to + 1) + ' of ' + order.length + '.');`,
    "emit('sortable-end', { value: v, activeIndex: from, overIndex: to });",
    `if (from !== to) { ${s.set("order", "order")}; emit('sortable-change', { value: order, activeIndex: from, overIndex: to }); }`,
    "};",

    // Zeiger-Drag starten
    "const startPointer = (p, x, y) => {",
    "clearTimeout(p.timer);",
    "pending = null;",
    "const r = p.item.getBoundingClientRect();",
    "begin(p.item, 'pointer');",
    "active.id = p.id;",
    "active.offX = x - r.left;",
    "active.offY = y - r.top;",
    "mark(p.item, true);",
    "try { p.item.setPointerCapture(p.id); } catch (e) { }",
    "follow(x, y);",
    "};",

    // Öffentliche Methoden für die data-on-Attribute
    "const pointerDown = (evt) => {",
    "if (active || pending) { return; }",
    "if (evt.pointerType === 'mouse' && evt.button !== 0) { return; }",
    "const t = evt.target;",
    `const h = t && t.closest ? t.closest('${HANDLE}') : null;`,
    "const item = itemOf(h || t);",
    "if (!item || item.hasAttribute('data-disabled')) { return; }",
    "if (h ? h.disabled : !item.hasAttribute('data-as-handle')) { return; }",
    "const p = { item: item, id: evt.pointerId, x: evt.clientX, y: evt.clientY, touch: evt.pointerType === 'touch', timer: 0 };",
    "pending = p;",
    `if (p.touch) { p.timer = setTimeout(() => { if (pending === p) { startPointer(p, p.x, p.y); } }, ${TOUCH_DELAY_MS}); }`,
    "};",

    "const pointerMove = (evt) => {",
    "if (pending && pending.id === evt.pointerId) {",
    "const moved = Math.hypot(evt.clientX - pending.x, evt.clientY - pending.y);",
    `if (pending.touch) { if (moved > ${TOUCH_TOLERANCE_PX}) { clearTimeout(pending.timer); pending = null; } }`,
    `else if (moved >= ${MOUSE_DISTANCE_PX}) { startPointer(pending, evt.clientX, evt.clientY); }`,
    "return;",
    "}",
    "if (!active || active.mode !== 'pointer' || active.id !== evt.pointerId) { return; }",
    "hover(evt.clientX, evt.clientY);",
    "follow(evt.clientX, evt.clientY);",
    "};",

    "const pointerEnd = (evt, cancelled) => {",
    "if (pending && pending.id === evt.pointerId) { clearTimeout(pending.timer); pending = null; }",
    "if (active && active.mode === 'pointer' && active.id === evt.pointerId) { finish(cancelled); }",
    "};",

    "const keyDown = (evt) => {",
    "const key = evt.key;",
    "if (active && active.mode === 'pointer') { if (key === 'Escape') { evt.preventDefault(); finish(true); } return; }",
    "const t = evt.target;",
    `const item = itemOf(t && t.closest ? (t.closest('${HANDLE}') || t) : t);`,
    "if (!item || item.hasAttribute('data-disabled')) { return; }",
    "const activator = activatorOf(item);",
    "if (!activator || t !== activator) { return; }",
    "const grabbed = !!active && active.item === item;",
    "if (key === 'Enter' || key === ' ') { evt.preventDefault(); if (grabbed) { finish(false); } else if (!active) { begin(item, 'keyboard'); mark(item, true); } return; }",
    "if (!grabbed) { return; }",
    "if (key === 'Escape') { evt.preventDefault(); finish(true); return; }",
    "if (key === 'Tab') { finish(false); return; }",
    "const dir = dirs[key];",
    "if (!dir) { return; }",
    "evt.preventDefault();",
    `const sibs = Array.from(item.parentElement.children).filter((c) => c.matches('${ITEM}'));`,
    "const target = sibs[sibs.indexOf(item) + dir];",
    "if (!target) { return; }",
    "item.parentElement.insertBefore(item, dir < 0 ? target : target.nextElementSibling);",
    "activator.focus();",
    "const order = all().map(valueOf);",
    `say('Sortable item "' + valueOf(item) + '" moved ' + (dir < 0 ? 'up' : 'down') + ' to position ' + (order.indexOf(valueOf(item)) + 1) + ' of ' + order.length + '.');`,
    "};",

    "return { pointerDown: pointerDown, pointerMove: pointerMove, pointerEnd: pointerEnd, keyDown: keyDown };",
    "})();"
  );
}

/** Event-Handler des Roots: rufen die Methoden aus `data-init` auf (`?.`, falls Datastar noch nicht initialisiert hat) */
export function buildSortableEventAttributes(): HtmlAttributes {
  return {
    "data-on:pointerdown": "el.__sortableApi?.pointerDown(evt)",
    "data-on:pointermove__window": "el.__sortableApi?.pointerMove(evt)",
    "data-on:pointerup__window": "el.__sortableApi?.pointerEnd(evt, false)",
    "data-on:pointercancel__window": "el.__sortableApi?.pointerEnd(evt, true)",
    "data-on:keydown__window": "el.__sortableApi?.keyDown(evt)",
  };
}

/** Callbacks aus den Args als `data-on:sortable-*`-Attribute (nur gesetzte) */
export function buildSortableCallbackAttributes(
  args: Pick<SortableArgs, "onValueChange" | "onDragStart" | "onDragEnd" | "onDragCancel">
): HtmlAttributes {
  const attrs: HtmlAttributes = {};
  if (args.onDragStart) attrs["data-on:sortable-start"] = args.onDragStart;
  if (args.onDragEnd) attrs["data-on:sortable-end"] = args.onDragEnd;
  if (args.onDragCancel) attrs["data-on:sortable-cancel"] = args.onDragCancel;
  if (args.onValueChange) attrs["data-on:sortable-change"] = args.onValueChange;
  return attrs;
}

/** Barrierefreie Attribute für Griff-Elemente (wie die dnd-kit-Attribute: roledescription und describedby) */
export function buildSortableActivatorAttributes(sortableId?: string): HtmlAttributes {
  const attrs: HtmlAttributes = { "aria-roledescription": "sortable" };
  if (sortableId) attrs["aria-describedby"] = sortableDescriptionId(sortableId);
  return attrs;
}
