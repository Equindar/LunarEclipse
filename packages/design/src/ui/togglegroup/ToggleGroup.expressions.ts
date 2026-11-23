import { createSignals } from "../../utils/SignalManager";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type {
    ToggleGroupOrientation,
    ToggleGroupSignals,
    ToggleGroupSize,
    ToggleGroupVariant,
} from "./ToggleGroup.types";

/**
 * Datastar-Expressions und Attribut-Bausteine der Toggle Group.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_TOGGLE_GROUP_SPACING = 2;
export const DEFAULT_TOGGLE_GROUP_ORIENTATION: ToggleGroupOrientation = "horizontal";
export const DEFAULT_TOGGLE_GROUP_VARIANT: ToggleGroupVariant = "default";
export const DEFAULT_TOGGLE_GROUP_SIZE: ToggleGroupSize = "default";

/** Signal-Manager einer Gruppe (Signal-Name = ID mit "-" zu "_") */
export const toggleGroupSignals = (
  groupId: string,
  initial: ToggleGroupSignals = { value: [], disabled: false, _last: "[]" },
) => createSignals<ToggleGroupSignals>(groupId, initial);

/** Initialer Signal-State: Anfangswerte, disabled und der zuletzt gemeldete Wert */
export function buildToggleGroupInitialSignals(value: string[] = [], disabled = false): ToggleGroupSignals {
  return { value, disabled, _last: JSON.stringify(value) };
}

/** Standard-Attribute der Gruppe (data-slot, data-variant, data-size, data-spacing, data-orientation, role) */
export function buildToggleGroupDataAttributes(options: {
  variant?: ToggleGroupVariant;
  size?: ToggleGroupSize;
  spacing: number;
  orientation: ToggleGroupOrientation;
  multiple: boolean;
  disabled: boolean;
}): HtmlAttributes {
  const attrs: HtmlAttributes = {
    "data-slot": "toggle-group",
    "data-spacing": options.spacing,
    "data-orientation": options.orientation,
    role: "group",
  };

  // Wie in der Quelle: variant und size stehen nur am Element, wenn sie gesetzt sind
  if (options.variant) attrs["data-variant"] = options.variant;
  if (options.size) attrs["data-size"] = options.size;
  if (options.multiple) attrs["data-multiple"] = true;
  if (options.disabled) attrs["data-disabled"] = true;

  return attrs;
}

/** Standard-Attribute eines Items (data-slot, data-variant, data-size, data-spacing, data-value) */
export function buildToggleGroupItemDataAttributes(options: {
  variant: ToggleGroupVariant;
  size: ToggleGroupSize;
  spacing: number;
  value: string;
}): HtmlAttributes {
  return {
    "data-slot": "toggle-group-item",
    "data-variant": options.variant,
    "data-size": options.size,
    "data-spacing": options.spacing,
    "data-value": options.value,
    type: "button",
  };
}

/** Bedingung: Item mit diesem Wert ist gedrückt (Wert als JS-Literal) */
export function buildPressedCondition(groupId: string, value: string): string {
  return `${toggleGroupSignals(groupId).signal("value")}.includes(${JSON.stringify(value)})`;
}

/** Wert für data-attr:aria-pressed (true oder false) */
export function buildAriaPressedExpression(groupId: string, value: string): string {
  return buildPressedCondition(groupId, value);
}

/** Wert für data-attr:data-state ("on" oder "off") */
export function buildDataStateExpression(groupId: string, value: string): string {
  return `${buildPressedCondition(groupId, value)} ? 'on' : 'off'`;
}

/** Wert für data-attr:disabled: Item oder gesamte Gruppe deaktiviert (false entfernt das Attribut) */
export function buildDisabledExpression(groupId: string, itemDisabled: boolean): string {
  const groupDisabled = toggleGroupSignals(groupId).signal("disabled");
  return itemDisabled ? "true" : groupDisabled;
}

/**
 * Klick-Handler eines Items.
 * Ob mehrfache Auswahl gilt, steht als data-multiple an der Gruppe und wird zur Laufzeit gelesen,
 * damit das Item es nicht doppelt kennen muss. Bei deaktivierter Gruppe passiert nichts.
 */
export function buildItemClickHandler(groupId: string, value: string): string {
  const s = toggleGroupSignals(groupId);
  const v = s.signal("value");
  const literal = JSON.stringify(value);

  const multiple = `el.closest('[data-slot="toggle-group"]')?.hasAttribute('data-multiple')`;

  const multipleBranch = `${v}.includes(${literal}) ? ${v}.filter((x) => x !== ${literal}) : [...${v}, ${literal}]`;
  const singleBranch = `${v}.includes(${literal}) ? [] : [${literal}]`;

  return `${s.signal("disabled")} ? void 0 : (${v} = ${multiple} ? (${multipleBranch}) : (${singleBranch}))`;
}

/**
 * Effekt für onValueChange: führt die Aktion einmal aus, wenn sich $<id>.value gegenüber dem
 * zuletzt gemeldeten Wert (_last) geändert hat.
 */
export function buildValueChangeEffect(groupId: string, action: string): string {
  const s = toggleGroupSignals(groupId);
  const changed = `JSON.stringify(${s.signal("value")}) !== ${s.signal("_last")}`;

  return `${changed} ? (${s.set("_last", `JSON.stringify(${s.signal("value")})`)}, ${action}) : void 0`;
}

/**
 * Tastatur-Navigation am Gruppen-Element (Pfeiltasten, Home, End).
 * Orientierung und Schreibrichtung werden zur Laufzeit gelesen (data-orientation, direction),
 * deaktivierte Items werden übersprungen. Ohne loop endet der Fokus am ersten bzw. letzten Item.
 */
export function buildKeydownHandler(loop: boolean): string {
  const body = [
    `const items = [...el.querySelectorAll('[data-slot="toggle-group-item"]:not([disabled])')]`,
    `const i = items.indexOf(document.activeElement)`,
    `if (i < 0) return`,
    `const vertical = el.dataset.orientation === 'vertical'`,
    `const rtl = getComputedStyle(el).direction === 'rtl'`,
    `const next = vertical ? 'ArrowDown' : (rtl ? 'ArrowLeft' : 'ArrowRight')`,
    `const prev = vertical ? 'ArrowUp' : (rtl ? 'ArrowRight' : 'ArrowLeft')`,
    `let target = -1`,
    `if (evt.key === next) target = i + 1`,
    `else if (evt.key === prev) target = i - 1`,
    `else if (evt.key === 'Home') target = 0`,
    `else if (evt.key === 'End') target = items.length - 1`,
    `else return`,
    `if (target >= items.length) target = ${loop ? "0" : "items.length - 1"}`,
    `if (target < 0) target = ${loop ? "items.length - 1" : "0"}`,
    `evt.preventDefault()`,
    `items[target].focus()`,
  ].join("; ");

  return `(() => { ${body}; })()`;
}
