import { buildAnchorStyle } from "../../utils/AnchorStyle";
import { buildConditional } from "../../utils/buildConditional";
import { escapeHtml } from "../../utils/escapeHtml";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { createSignals, type SignalManager } from "../../utils/SignalManager";
import type { ComboboxSignals } from "./Combobox.types";

/**
 * Datastar-Expressions und Attribut-Bausteine der Combobox.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 *
 * Die Quelle (shadcn/ui, Base UI) hält Filter, Auswahl und Hervorhebung in React-State.
 * Im Port liegen nur `open`, `value`, `label` und `values` als Signale vor. Filtern und Hervorheben
 * laufen direkt am DOM (`hidden` an Items und Gruppen, `data-highlighted` am aktiven Item).
 *
 * Alle Handler sind einzeilige Ausdrücke ohne Semikolon (Komma-Operator, Standardparameter statt
 * `const`), damit Datastar sie als einen Ausdruck auswertet.
 */

export const DEFAULT_SIDE_OFFSET = 6;

/** Platzhalter für Chip-Vorlagen (werden im Browser je ausgewähltem Wert ersetzt) */
export const comboboxChipPlaceholder = { label: "{{label}}", value: "{{value}}" } as const;

/** Initialer Signal-State einer Combobox */
export const comboboxInitialSignals: ComboboxSignals = {
  open: false,
  value: "",
  label: "",
  values: [],
};

/** Signal-Manager einer Combobox (Signal-Name = ID mit "-" zu "_") */
export const comboboxSignals = (id: string, initial: Partial<ComboboxSignals> = {}): SignalManager<ComboboxSignals> =>
  createSignals<ComboboxSignals>(id, { ...comboboxInitialSignals, ...initial });

/* ------------------------------------------------------------------------------------------------
 * Icons (Lucide, fest in der Quelle eingebaut: ChevronDown, X, Check)
 * ---------------------------------------------------------------------------------------------- */

const ICON_PATHS = {
  chevronDown: `<path d="m6 9 6 6 6-6"/>`,
  x: `<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`,
  check: `<path d="M20 6 9 17l-5-5"/>`,
} as const;

export type ComboboxIconName = keyof typeof ICON_PATHS;

/** SVG-Icon als String (stroke und fill folgen currentColor) */
export function renderComboboxIcon(name: ComboboxIconName, cssClass = ""): string {
  const classAttr = cssClass ? ` class="${escapeHtml(cssClass)}"` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${classAttr}>${ICON_PATHS[name]}</svg>`;
}

/* ------------------------------------------------------------------------------------------------
 * Gemeinsame JavaScript-Bausteine
 * ---------------------------------------------------------------------------------------------- */

type Signals = SignalManager<ComboboxSignals>;

/** JS-Stringliteral für Werte, die in Expressions eingebettet werden */
const lit = (value: string): string => JSON.stringify(value);

/**
 * Lokale Helfer, die jeder Handler als Standardparameter seiner Arrow-Funktion bekommt:
 * root, input, content, inline, multiple, items, visible, applyFilter, highlight, navigate, close.
 *
 * - `inline`: false, wenn das Input im Popup liegt (Popup-Muster), dann zeigt es keinen Auswahltext
 * - `applyFilter(q)`: blendet nicht passende Items und leere Gruppen per `hidden` aus, setzt `data-empty`
 * - `close()`: schließt, hebt den Filter auf und stellt den Eingabetext wieder her
 */
function buildPrelude(s: Signals): string {
  const label = s.signal("label");

  return [
    `root = el.closest('[data-slot="combobox"]')`,
    `input = root.querySelector('[data-combobox-input]')`,
    `content = root.querySelector('[data-slot="combobox-content"]')`,
    `inline = !(content && input && content.contains(input))`,
    `multiple = root.hasAttribute('data-multiple')`,
    `items = () => [...root.querySelectorAll('[data-slot="combobox-item"]')]`,
    `visible = () => items().filter((i) => !i.hidden && !i.hasAttribute('data-disabled'))`,
    `applyFilter = (q) => ((t = q.trim().toLowerCase()) => (items().forEach((i) => (i.hidden = !!t && !(i.dataset.label || '').toLowerCase().includes(t))), root.querySelectorAll('[data-slot="combobox-group"]').forEach((g) => (g.hidden = !g.querySelector('[data-slot="combobox-item"]:not([hidden])'))), [content, root.querySelector('[data-slot="combobox-list"]')].forEach((x) => x && x.toggleAttribute('data-empty', items().every((i) => i.hidden)))))()`,
    `highlight = (item) => (items().forEach((i) => i.removeAttribute('data-highlighted')), item && (item.setAttribute('data-highlighted', ''), item.scrollIntoView({ block: 'nearest' })))`,
    `navigate = (dir) => ((v = visible(), cur = v.findIndex((i) => i.hasAttribute('data-highlighted'))) => highlight(v[dir > 0 ? (cur + 1) % v.length : (cur <= 0 ? v.length - 1 : cur - 1)]))()`,
    `close = () => (${s.set("open", "false")}, applyFilter(''), highlight(null), input && (input.value = multiple || !inline ? '' : ${label}))`,
  ].join(", ");
}

/** Umhüllt einen Ausdruck mit dem Prelude: `((root = ..., ...) => (body))()` */
function wrap(s: Signals, body: string): string {
  return `((${buildPrelude(s)}) => (${body}))()`;
}

/* ------------------------------------------------------------------------------------------------
 * Handler
 * ---------------------------------------------------------------------------------------------- */

/** Klick außerhalb des Roots: Popup schließen */
export function buildClickOutsideHandler(id: string): string {
  const s = comboboxSignals(id);
  return buildConditional(s.signal("open"), wrap(s, "close()"), "void 0");
}

/** Eingabe: Filter anwenden, Popup öffnen, Auswahl bei leerem Feld löschen (Einfachauswahl) */
export function buildInputHandler(id: string): string {
  const s = comboboxSignals(id);
  const body = [
    s.set("open", "true"),
    `applyFilter(el.value)`,
    `(!multiple && inline && !el.value) && (${s.set("value", "''")}, ${s.set("label", "''")})`,
    `highlight(root.hasAttribute('data-auto-highlight') && el.value.trim() ? visible()[0] : null)`,
  ].join(", ");
  return wrap(s, body);
}

/** Tastatur am Input: Pfeile, Enter, Escape, Tab und Backspace (entfernt in der Mehrfachauswahl den letzten Chip) */
export function buildKeydownHandler(id: string): string {
  const s = comboboxSignals(id);
  const open = s.signal("open");
  const values = s.signal("values");

  const branches = [
    `(evt.key === 'ArrowDown' || evt.key === 'ArrowUp') ? (evt.preventDefault(), ${open} || (${s.set("open", "true")}, applyFilter('')), navigate(evt.key === 'ArrowDown' ? 1 : -1))`,
    `evt.key === 'Enter' ? (${open} && ((h = items().find((i) => i.hasAttribute('data-highlighted') && !i.hidden)) => h && (evt.preventDefault(), h.click()))())`,
    `evt.key === 'Escape' ? (${open} && (evt.preventDefault(), close()))`,
    `evt.key === 'Tab' ? close()`,
    `(evt.key === 'Backspace' && multiple && !el.value && ${values}.length > 0) ? (${s.set("values", `${values}.slice(0, -1)`)})`,
  ];

  return wrap(s, `${branches.join(" : ")} : null`);
}

/** Trigger-Klick: Popup umschalten, beim Öffnen den Filter aufheben und das Input fokussieren */
export function buildTriggerHandler(id: string): string {
  const s = comboboxSignals(id);
  const open = s.signal("open");
  return wrap(s, `${open} ? close() : (applyFilter(''), ${s.set("open", "true")}, input && input.focus())`);
}

/** Clear-Klick: Auswahl löschen und das Input fokussieren */
export function buildClearHandler(id: string): string {
  const s = comboboxSignals(id);
  const body = [
    `multiple ? (${s.set("values", "[]")}) : (${s.set("value", "''")}, ${s.set("label", "''")})`,
    `input && (input.value = '')`,
    `applyFilter('')`,
    `input && input.focus()`,
  ].join(", ");
  return wrap(s, body);
}

/**
 * Item-Klick. Einfachauswahl: Wert und Text setzen, schließen.
 * Mehrfachauswahl: Wert umschalten, Eingabe leeren, Popup offen lassen.
 */
export function buildItemClickHandler(id: string): string {
  const s = comboboxSignals(id);
  const values = s.signal("values");

  const toggle = `((v = el.dataset.value) => (${s.set("values", `${values}.includes(v) ? ${values}.filter((x) => x !== v) : [...${values}, v]`)}))()`;

  const body = `multiple ? (${toggle}, input && (input.value = ''), applyFilter(''), input && input.focus()) : (${s.set("value", "el.dataset.value")}, ${s.set("label", "el.dataset.label")}, close())`;

  return wrap(s, body);
}

/** Hover über ein Item: hervorheben */
export function buildItemHoverHandler(id: string): string {
  return wrap(comboboxSignals(id), "highlight(el)");
}

/** Remove-Button eines Chips: Wert des Chips aus `values` entfernen */
export function buildChipRemoveHandler(id: string): string {
  const s = comboboxSignals(id);
  const values = s.signal("values");
  return s.set("values", `${values}.filter((v) => v !== el.closest('[data-slot="combobox-chip"]').dataset.value)`);
}

/** Klick in die Chips-Gruppe (außer auf einen Button): Input fokussieren */
export function buildChipsClickHandler(id: string): string {
  return wrap(comboboxSignals(id), `!evt.target.closest('button') && input && input.focus()`);
}

/** true, wenn ein Wert ausgewählt ist (Einfach- oder Mehrfachauswahl) */
export function buildHasValueExpression(id: string): string {
  const s = comboboxSignals(id);
  return `(${s.signal("value")} !== '' || ${s.signal("values")}.length > 0)`;
}

/** true, wenn das Item mit diesem Wert ausgewählt ist */
export function buildSelectedExpression(id: string, value: string): string {
  const s = comboboxSignals(id);
  return `(${s.signal("value")} !== '' && ${s.signal("value")} === ${lit(value)}) || ${s.signal("values")}.includes(${lit(value)})`;
}

/* ------------------------------------------------------------------------------------------------
 * Effects
 * ---------------------------------------------------------------------------------------------- */

/** Input (Einfachauswahl): Eingabetext folgt dem Anzeigetext des ausgewählten Werts */
export function buildInputEffect(id: string): string {
  const s = comboboxSignals(id);
  return wrap(s, `!multiple && inline && input && (input.value = ${s.signal("label")})`);
}

/** Content im Popup-Muster: beim Öffnen das Suchfeld im Popup fokussieren */
export function buildContentFocusEffect(id: string): string {
  const s = comboboxSignals(id);
  return `${s.signal("open")} && requestAnimationFrame(() => ((i = el.querySelector('[data-combobox-input]')) => i && i.focus())())`;
}

/**
 * Chips (Mehrfachauswahl): rendert die Chip-Vorlage (`data-chip-template`) für jeden Wert in `values`.
 * Das Label stammt aus `data-label` des passenden Items (Fallback: der Wert). Zeichen werden als
 * numerische Entities escaped, ohne Semikolon im Ausdruck (String.fromCharCode(59)).
 */
export function buildChipsValueEffect(id: string): string {
  const s = comboboxSignals(id);
  const values = s.signal("values");

  return [
    `((root = el.closest('[data-slot="combobox"]'), `,
    `esc = (t) => String(t).replace(/[&<>"']/g, (c) => '&#' + c.charCodeAt(0) + String.fromCharCode(59)), `,
    `label = (v) => ((it = [...root.querySelectorAll('[data-slot="combobox-item"]')].find((i) => i.dataset.value === v)) => (it ? it.dataset.label : v))()) => `,
    `(el.innerHTML = ${values}.map((v) => el.dataset.chipTemplate.replaceAll('{{label}}', () => esc(label(v))).replaceAll('{{value}}', () => esc(v))).join('')))()`,
  ].join("");
}

/* ------------------------------------------------------------------------------------------------
 * Attribut-Bausteine
 * ---------------------------------------------------------------------------------------------- */

interface InputAttributeOptions {
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
}

/** Standard-Attribute des Eingabefelds (Input in der Input-Group und Chips-Input) */
export function buildComboboxInputAttributes(id: string, options: InputAttributeOptions = {}): HtmlAttributes {
  const s = comboboxSignals(id);

  const attrs: HtmlAttributes = {
    type: "text",
    role: "combobox",
    autocomplete: "off",
    "aria-autocomplete": "list",
    "aria-controls": `${id}-list`,
    "data-combobox-input": true,
    "data-attr:aria-expanded": `${s.signal("open")} ? 'true' : 'false'`,
    "data-effect": buildInputEffect(id),
    "data-on:input": buildInputHandler(id),
    "data-on:keydown": buildKeydownHandler(id),
  };

  if (options.placeholder) attrs.placeholder = options.placeholder;
  if (options.disabled) attrs.disabled = true;
  if (options.invalid) attrs["aria-invalid"] = "true";

  return attrs;
}

/**
 * Attribute für ein Trigger-Element (Ersatz für die `render`-Prop der Quelle).
 * Mit `anchor` wird das Element zum Anchor des Popups (Popup-Muster ohne Input-Group).
 */
export function buildComboboxTriggerAttributes(id: string, anchor = false): HtmlAttributes {
  const s = comboboxSignals(id);

  const attrs: HtmlAttributes = {
    "aria-haspopup": "listbox",
    "data-attr:aria-expanded": `${s.signal("open")} ? 'true' : 'false'`,
    "data-attr:data-pressed": s.signal("open"),
    "data-on:click": buildTriggerHandler(id),
  };

  if (anchor) attrs.style = buildAnchorStyle(id);

  return attrs;
}

/** Attribute des Items: Wert, Text, Auswahlzustand und Handler */
export function buildComboboxItemAttributes(
  id: string,
  value: string,
  label: string,
  disabled = false
): HtmlAttributes {
  const selected = buildSelectedExpression(id, value);

  const attrs: HtmlAttributes = {
    role: "option",
    "data-slot": "combobox-item",
    "data-value": value,
    "data-label": label,
    "data-attr:data-selected": selected,
    "data-attr:aria-selected": `(${selected}) ? 'true' : 'false'`,
    "data-on:click": buildItemClickHandler(id),
    "data-on:mouseenter": buildItemHoverHandler(id),
    // Fokus bleibt im Eingabefeld
    "data-on:mousedown": "evt.preventDefault()",
  };

  if (disabled) {
    attrs["data-disabled"] = true;
    attrs["aria-disabled"] = "true";
  }

  return attrs;
}
