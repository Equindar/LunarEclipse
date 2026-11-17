import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import {
    buildSortableActivatorAttributes,
    buildSortableCallbackAttributes,
    buildSortableDescription,
    buildSortableEventAttributes,
    buildSortableInit,
    DEFAULT_SORTABLE_ORIENTATION,
    resolveSortableTag,
    sortableDescriptionId,
    sortableSignals,
} from "./Sortable.expressions";
import type {
    SortableArgs,
    SortableContentArgs,
    SortableItemArgs,
    SortableItemHandleArgs,
} from "./Sortable.types";

/**
 * Klassen aus Dice UI (Base-Variante). Die Quelle verwendet Platzhalter-Klassen
 * (cn-sortable-item, cn-sortable-item-handle), die konkreten Klassen stammen aus style-nova.css von Dice UI
 * (identisch in style-vega.css).
 */
const sortableItemTw = tw`focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-hidden`;
const sortableItemHandleTw = tw`select-none disabled:pointer-events-none disabled:opacity-50`;

/**
 * Klassen eines Eintrags. Der Zustand "wird gezogen" kommt zur Laufzeit als `data-dragging`
 * (statt `isDragging` aus React), daher `data-dragging:opacity-50`.
 */
export function sortableItemVariants(
  args: Pick<SortableItemArgs, "asHandle" | "disabled" | "flatCursor" | "class"> = {}
): string {
  return cn(
    sortableItemTw,
    args.asHandle && "touch-none select-none",
    args.flatCursor ? "cursor-default" : "data-dragging:cursor-grabbing",
    args.asHandle && !args.flatCursor && "cursor-grab",
    "data-dragging:opacity-50",
    args.disabled && "pointer-events-none opacity-50",
    args.class
  );
}

/** Klassen des Griffs. `touch-none` kommt zusätzlich zur Quelle, damit Touch-Drag nicht vom Scrollen abgebrochen wird */
export function sortableItemHandleVariants(args: Pick<SortableItemHandleArgs, "flatCursor" | "class"> = {}): string {
  return cn(
    sortableItemHandleTw,
    "touch-none",
    args.flatCursor ? "cursor-default" : "cursor-grab data-dragging:cursor-grabbing",
    args.class
  );
}

/** Zufällige ID: sortable_ plus 8 Hex-Zeichen */
function randomSortableId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return `sortable_${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Wurzel einer Sortierliste. Erzeugt ein Element mit `display: contents`, die Signale
 * (`activeId`, `order`, `announcement`), die Drag-Logik und eine Live-Region für Screenreader.
 * Funktioniert nur mit geladenem Datastar.
 */
export function Sortable(args: SortableArgs = {}): string {
  const id = args.id || randomSortableId();
  const orientation = args.orientation ?? DEFAULT_SORTABLE_ORIENTATION;
  const signals = sortableSignals(id, args.value);

  const attrs: HtmlAttributes = {
    ...args.attributes,
    id,
    "data-slot": "sortable",
    "data-orientation": orientation,
    "data-signals": signals.dataSignals,
    "data-init": buildSortableInit(id, orientation),
    ...buildSortableEventAttributes(),
    ...buildSortableCallbackAttributes(args),
    class: cn("contents", args.class),
  };

  const description = `<div id="${escapeHtml(sortableDescriptionId(id))}" hidden>${escapeHtml(buildSortableDescription(orientation))}</div>`;
  const liveRegion = `<div data-slot="sortable-live-region" role="status" aria-live="assertive" aria-atomic="true" class="sr-only" data-text="${escapeHtml(signals.signal("announcement"))}"></div>`;

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}${description}${liveRegion}</div>`;
}

/** Container der Einträge. Mit `withoutSlot` werden nur die Kinder ausgegeben */
export function SortableContent(args: SortableContentArgs = {}): string {
  if (args.withoutSlot) return renderChildren(args.children);

  const tag = resolveSortableTag(args.tag, "div");
  const attrs: HtmlAttributes = { ...args.attributes, "data-slot": "sortable-content" };
  if (args.class) attrs.class = args.class;

  return `<${tag}${renderAttributes(attrs)}>${renderChildren(args.children)}</${tag}>`;
}

/**
 * Ein sortierbarer Eintrag. Mit `asHandle` ist der ganze Eintrag der Griff (fokussierbar, per Tastatur bedienbar),
 * sonst startet das Ziehen an einem SortableItemHandle.
 */
export function SortableItem(args: SortableItemArgs): string {
  if (args.value === "") throw new Error("`SortableItem` value cannot be an empty string");

  const tag = resolveSortableTag(args.tag, "div");
  const asHandle = !!args.asHandle;
  const disabled = !!args.disabled;

  const attrs: HtmlAttributes = { ...args.attributes };
  if (args.id) attrs.id = args.id;
  attrs["data-slot"] = "sortable-item";
  attrs["data-value"] = String(args.value);
  if (asHandle) attrs["data-as-handle"] = true;
  if (disabled) attrs["data-disabled"] = true;
  if (asHandle && !disabled) {
    attrs.role = "button";
    attrs.tabindex = 0;
    Object.assign(attrs, buildSortableActivatorAttributes(args.sortableId));
  }
  attrs.class = sortableItemVariants({
    asHandle,
    disabled,
    flatCursor: args.flatCursor,
    class: args.class,
  });

  return `<${tag}${renderAttributes(attrs)}>${renderChildren(args.children)}</${tag}>`;
}

/** Griff innerhalb eines SortableItem (rendert einen `<button>`) */
export function SortableItemHandle(args: SortableItemHandleArgs = {}): string {
  const attrs: HtmlAttributes = { ...args.attributes };
  attrs.type = "button";
  attrs["data-slot"] = "sortable-item-handle";
  if (args.itemId) attrs["aria-controls"] = args.itemId;
  if (args.disabled) {
    attrs.disabled = true;
  } else {
    Object.assign(attrs, buildSortableActivatorAttributes(args.sortableId));
  }
  attrs.class = sortableItemHandleVariants({ flatCursor: args.flatCursor, class: args.class });

  return `<button${renderAttributes(attrs)}>${renderChildren(args.children)}</button>`;
}
