import { buildConditional } from "../../utils/buildConditional";
import { jsString } from "../../utils/jsString";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { buildScrollSpyExpression } from "../../utils/scrollSpy";
import { createSignals } from "../../utils/SignalManager";
import { type TableOfContentArgs, type TableOfContentSignals } from "./TableOfContent.types";

/**
 * Datastar-Expressions des Inhaltsverzeichnisses.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 *
 * Alle Expressions sind Einzeiler ohne Semikolons (siehe scrollSpy.ts).
 */

export const DEFAULT_TOC_LABEL = "Table of contents";

/** Initialer Signal-State */
export const tocInitialSignals: TableOfContentSignals = { activeIds: [] };

/** Signal-Manager eines Inhaltsverzeichnisses (Signal-Name = ID mit "-" zu "_") */
export const tableOfContentSignals = (tocId: string) => createSignals<TableOfContentSignals>(tocId, tocInitialSignals);

/** Zufalls-ID: `toc_<8 Hex-Zeichen>` */
export function createTableOfContentId(): string {
  const hex = Array.from(crypto.getRandomValues(new Uint8Array(4)), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `toc_${hex}`;
}

/** Scroll-Spy am Root (`data-init`): schreibt die aktiven Überschriften-IDs ins Signal */
export function buildTableOfContentSpyExpression(
  tocId: string,
  args: Pick<TableOfContentArgs, "targetIds" | "scrollContainer" | "rootMargin" | "threshold" | "endOffset">
): string {
  return buildScrollSpyExpression({
    targetSignal: tableOfContentSignals(tocId).signal("activeIds"),
    ids: args.targetIds,
    scrollContainer: args.scrollContainer,
    rootMargin: args.rootMargin,
    threshold: args.threshold,
    endOffset: args.endOffset,
  });
}

/** Bedingung: Die Überschrift `targetId` ist aktiv */
export function buildTableOfContentActiveCondition(tocId: string, targetId: string): string {
  return `${tableOfContentSignals(tocId).signal("activeIds")}.includes(${jsString(targetId)})`;
}

/**
 * Zustands-Attribute eines Links. `data-active="true"` (Selektor `data-[active=true]`) und
 * `aria-current="location"` werden gesetzt, solange die Überschrift aktiv ist, sonst entfernt (null).
 */
export function buildTableOfContentLinkAttributes(tocId: string, targetId: string): HtmlAttributes {
  const active = buildTableOfContentActiveCondition(tocId, targetId);

  return {
    "data-toc-target": targetId,
    "data-attr:aria-current": buildConditional(active, jsString("location"), "null"),
    "data-attr:data-active": buildConditional(active, jsString("true"), "null"),
  };
}

const LINK_SELECTOR = `'[data-slot="toc-link"]'`;

/**
 * Indicator (`data-effect`): setzt `--toc-indicator-top` und `--toc-indicator-height` so, dass der Balken
 * vom ersten bis zum letzten aktiven Link reicht. Ohne aktive Links wird die Höhe 0.
 * Die Offsets beziehen sich auf die Liste (Elternelement des Indicators, muss `relative` sein).
 */
export function buildTableOfContentIndicatorExpression(tocId: string): string {
  const activeIds = tableOfContentSignals(tocId).signal("activeIds");

  return [
    "((",
    `ids = ${activeIds},`,
    `items = [...el.parentElement.querySelectorAll(${LINK_SELECTOR})].filter((link) => ids.includes(link.dataset.tocTarget)),`,
    "first = items[0],",
    "last = items[items.length - 1]",
    ") => first",
    '? (el.style.setProperty("--toc-indicator-top", first.offsetTop + "px"),',
    'el.style.setProperty("--toc-indicator-height", (last.offsetTop + last.offsetHeight - first.offsetTop) + "px"))',
    ': el.style.setProperty("--toc-indicator-height", "0px"))()',
  ].join(" ");
}
