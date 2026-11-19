import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import { withSlot } from "../../utils/withSlot";
import {
    BADGE_OVERFLOW_COUNT_ATTRIBUTE,
    BADGE_OVERFLOW_INDICATOR_SLOT,
    BADGE_OVERFLOW_ITEM_SLOT,
    buildInitHandler,
    buildInitialHeightStyle,
    normalizeLineCount,
    resolveBadgeLabel,
    resolveTag,
} from "./BadgeOverflow.expressions";
import type { BadgeOverflowArgs } from "./BadgeOverflow.types";

export type { BadgeOverflowArgs, GetBadgeLabel } from "./BadgeOverflow.types";

/**
 * Klassen des Wurzelelements. Die Vorlage setzt den Abstand per Inline-Style (gap: 4px), hier gilt `gap-1`
 * und lässt sich über `class` überschreiben. Bis zur ersten Messung begrenzt die CSS-Variable die Höhe.
 */
const badgeOverflowTw = tw`flex flex-wrap gap-1 data-[measured=false]:max-h-(--badge-overflow-initial-height) data-[measured=false]:overflow-hidden`;

/** Wrapper um jeden Eintrag, damit der Handler ihn per `hidden` ausblenden kann */
const badgeOverflowItemTw = tw`inline-flex`;

/** Wrapper um den Indikator (enthält Standard-Indikator oder das Ergebnis von renderOverflow) */
const badgeOverflowIndicatorWrapperTw = tw`inline-flex shrink-0`;

/** Standard-Indikator "+N" (Klassen der Vorlage) */
const badgeOverflowIndicatorTw = tw`inline-flex h-5 shrink-0 items-center rounded-lg border px-1.5 text-xs font-medium`;

/**
 * Badge-Overflow: zeigt nur so viele Badges, wie in `lineCount` Zeilen passen, dazu einen "+N"-Indikator.
 * Funktioniert nur mit geladenem Datastar (Messung und Ausblenden laufen in `data-init`).
 * Das Wurzelelement braucht eine definierte Breite.
 */
export function BadgeOverflow<T = string>(args: BadgeOverflowArgs<T>): string {
  const lineCount = normalizeLineCount(args.lineCount);
  const tag = resolveTag(args.tag);

  const items = args.items
    .map((item) => {
      const label = escapeHtml(resolveBadgeLabel(item, args.getBadgeLabel));
      const itemAttrs: HtmlAttributes = { "data-slot": BADGE_OVERFLOW_ITEM_SLOT, class: badgeOverflowItemTw };
      return `<div${renderAttributes(itemAttrs)}>${args.renderBadge(item, label)}</div>`;
    })
    .join("");

  const count = `<span${renderAttributes({ [BADGE_OVERFLOW_COUNT_ATTRIBUTE]: true })}>0</span>`;
  const indicator = args.renderOverflow
    ? args.renderOverflow(count)
    : `<div class="${badgeOverflowIndicatorTw}">+${count}</div>`;
  const indicatorAttrs: HtmlAttributes = {
    "data-slot": BADGE_OVERFLOW_INDICATOR_SLOT,
    class: badgeOverflowIndicatorWrapperTw,
    hidden: true,
  };

  const userStyle = typeof args.attributes?.style === "string" ? args.attributes.style : "";
  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "badge-overflow"),
    "data-measured": "false",
    "data-init": buildInitHandler(lineCount),
    class: cn(badgeOverflowTw, args.class),
    style: [buildInitialHeightStyle(lineCount), userStyle].filter(Boolean).join("; "),
  };

  return `<${tag}${renderAttributes(attrs)}>${items}<div${renderAttributes(indicatorAttrs)}>${indicator}</div></${tag}>`;
}
