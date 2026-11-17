import type { Children } from "../../types/Children";
import { newExpression } from "../../utils/DatastarExpression";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { createSignals } from "../../utils/SignalManager";
import type {
    StackItemEffectInput,
    StackItemLayout,
    StackItemLayoutInput,
    StackSide,
    StackSignals,
} from "./Stack.types";

/**
 * Datastar-Expressions und Attribut-Bausteine des Stacks.
 * Ersetzt den React-State der Vorlage (isExpanded, isInteracting, dimensions) durch zwei Signale
 * und einen Layout-Effekt je Item.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_STACK_SIDE: StackSide = "bottom";
export const DEFAULT_STACK_ITEM_COUNT = 3;
export const DEFAULT_STACK_GAP = 8;
export const DEFAULT_STACK_SCALE = 0.05;
export const DEFAULT_STACK_OFFSET = 10;

/** Initialer Signal-State eines Stacks */
export const stackInitialSignals: StackSignals = {
  expanded: false,
  interacting: false,
};

/** Signal-Manager eines Stacks (Signal-Name = ID mit "-" → "_") */
export const stackSignals = (stackId: string) => createSignals<StackSignals>(stackId, stackInitialSignals);

/** Zufällige Stack-ID: stack_<8 Hex-Zeichen> */
export function generateStackId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `stack_${hex}`;
}

/** Zahl ohne Gleitkomma-Rauschen (0.8500000000000001 wird zu 0.85) */
export function formatStackNumber(value: number): string {
  return String(Math.round(value * 10000) / 10000);
}

/** Liste der Items: Array-Elemente einzeln, ein String als ein Item, leere Strings entfallen */
export function normalizeStackItems(children?: Children): string[] {
  if (children === undefined) return [];
  const list = typeof children === "string" ? [children] : children;
  return list.filter((item) => item.trim() !== "");
}

/** Layout eines Items im eingeklappten Zustand und die Sichtbarkeit in beiden Zuständen */
export function computeStackItemLayout(input: StackItemLayoutInput): StackItemLayout {
  const { index, childrenCount, itemCount, expandedItemCount, scale, offset } = input;

  const visibleCollapsed = index < itemCount;
  const visibleExpanded = index < expandedItemCount;

  return {
    index,
    isFront: index === 0,
    visibleCollapsed,
    visibleExpanded,
    translate: index * offset,
    itemScale: 1 - index * scale,
    opacity: visibleCollapsed ? 1 - index * 0.15 : 0,
    zIndex: childrenCount - index,
  };
}

/** Standard-Attribute des Stacks (Startzustand: eingeklappt) */
export function buildStackDataAttributes(): HtmlAttributes {
  return { "data-slot": "stack", "data-state": "collapsed" };
}

/** Standard-Attribute eines Items (StackItem) */
export function buildStackItemDataAttributes(): HtmlAttributes {
  return { "data-slot": "stack-item" };
}

/** Standard-Attribute des internen Wrappers eines Items (Startzustand: eingeklappt) */
export function buildStackItemWrapperDataAttributes(layout: StackItemLayout): HtmlAttributes {
  return {
    "data-slot": "stack-item-wrapper",
    "data-index": layout.index,
    // Präsenz-Attribute wie in der Vorlage (kein Wert "true"/"false")
    "data-front": layout.isFront,
    "data-visible": layout.visibleCollapsed,
  };
}

/** Inline-Style des Stacks: CSS-Variablen, danach der optionale Nutzer-Style (kann die Variablen überschreiben) */
export function buildStackRootStyle(gap: number, offset: number, scale: number, userStyle?: string): string {
  const variables = `--gap: ${formatStackNumber(gap)}px; --offset: ${formatStackNumber(offset)}px; --scale: ${formatStackNumber(scale)};`;
  return userStyle ? `${variables} ${userStyle}` : variables;
}

/** Inline-Style des Item-Wrappers (Startwerte im eingeklappten Zustand) */
export function buildStackItemWrapperStyle(layout: StackItemLayout): string {
  return [
    `--translate: ${formatStackNumber(layout.translate)}px`,
    `--item-scale: ${formatStackNumber(layout.itemScale)}`,
    `z-index: ${layout.zIndex}`,
    `opacity: ${formatStackNumber(layout.opacity)}`,
  ].join("; ") + ";";
}

/** Hover/Bewegung im Stack: auffächern */
export function buildStackExpandHandler(stackId: string): string {
  return stackSignals(stackId).set("expanded", "true");
}

/** Mouse-Leave: zuklappen, solange kein Zeiger gedrückt gehalten wird */
export function buildStackLeaveHandler(stackId: string): string {
  const s = stackSignals(stackId);
  return s.conditionalAction(`!${s.signal("interacting")}`, "expanded", "false");
}

/** Pointer-Down: Interaktion merken, damit der Stack beim Verlassen nicht zuklappt */
export function buildStackPointerDownHandler(stackId: string): string {
  return stackSignals(stackId).set("interacting", "true");
}

/**
 * Pointer-Up (am Fenster): Interaktion beenden und zuklappen, wenn der Zeiger nicht mehr über dem Stack liegt.
 * Die Vorlage hört nur am Stack selbst; wird die Taste außerhalb losgelassen, bliebe `isInteracting` dort hängen.
 */
export function buildStackPointerUpHandler(stackId: string): string {
  const s = stackSignals(stackId);

  return newExpression()
    .statement(s.set("interacting", "false"))
    .statement(s.conditionalAction("!el.matches(':hover')", "expanded", "false"))
    .build();
}

/**
 * Layout-Effekt eines Items (ersetzt useEffect, useMemo und die Berechnung im StackItemWrapper).
 * - Misst einmalig die natürliche Höhe (Höhe geteilt durch die Skalierung im eingeklappten Zustand)
 *   und legt sie als data-stack-size am Wrapper ab.
 * - Setzt je nach Signal `expanded` die CSS-Variablen, Deckkraft, Klassen und Data-Attribute.
 * Es steht kein `;` innerhalb von Funktionskörpern, nur zwischen den Statements.
 */
export function buildStackItemEffect(input: StackItemEffectInput): string {
  const { stackId, layout, gap, expandedClass, hiddenClass } = input;
  const x = stackSignals(stackId).signal("expanded");

  const index = layout.index;
  const collapsedScale = formatStackNumber(layout.itemScale);
  const collapsedTranslate = formatStackNumber(layout.translate);
  const collapsedOpacity = formatStackNumber(layout.opacity);

  const visibleCollapsed = String(layout.visibleCollapsed);
  const visibleExpanded = String(layout.visibleExpanded);
  const visible = `(${x} ? ${visibleExpanded} : ${visibleCollapsed})`;

  // Summe der natürlichen Höhen aller Items vor diesem (nur ab dem zweiten Item nötig)
  const sizeBefore =
    index === 0
      ? "0"
      : `Array.from(el.parentElement.children).slice(0, ${index}).reduce((sum, child) => sum + (parseFloat(child.dataset.stackSize) || 0), 0)`;

  const expandedTranslate = `${formatStackNumber(index * gap)} + ${sizeBefore}`;

  return newExpression()
    .statement(
      `el.dataset.stackSize || (el.dataset.stackSize = String(el.getBoundingClientRect().height / ${collapsedScale}))`
    )
    .statement(
      `el.style.setProperty("--translate", (${x} ? (${expandedTranslate}) : ${collapsedTranslate}) + "px")`
    )
    .statement(`el.style.setProperty("--item-scale", ${x} ? 1 : ${collapsedScale})`)
    .statement(`el.style.opacity = ${x} ? (${visibleExpanded} ? 1 : 0) : ${collapsedOpacity}`)
    .statement(`el.classList.toggle(${JSON.stringify(hiddenClass)}, !${visible})`)
    .statement(`el.classList.toggle(${JSON.stringify(expandedClass)}, ${x})`)
    .statement(`el.toggleAttribute("data-visible", ${visible})`)
    .statement(`el.toggleAttribute("data-expanded", ${x})`)
    .build();
}

/** data-attr:data-state am Stack: spiegelt das Signal `expanded` */
export function buildStackStateAttribute(stackId: string): string {
  return stackSignals(stackId).conditional("expanded", "'expanded'", "'collapsed'");
}
