import { cn } from "../../utils/cn";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import { buildSkeletonDataAttributes } from "./Skeleton.expressions";
import type { SkeletonArgs } from "./Skeleton.types";

/**
 * Basis-Klassen des Skeletons (shadcn/ui, Base-Variante).
 * Die Quelle verwendet den Platzhalter cn-skeleton, die konkreten Klassen (bg-muted rounded-md) stammen aus dem Style "vega".
 */
const skeletonTw = tw`animate-pulse bg-muted rounded-md`;

export function skeletonVariants(args: Pick<SkeletonArgs, "class"> = {}): string {
  return cn(skeletonTw, args.class);
}

/**
 * Skeleton: Platzhalter für Inhalte, die noch laden (`<div>` mit Puls-Animation).
 * Nutzer-Attribute werden zuerst übernommen und von den Standard-Attributen überschrieben.
 */
export function Skeleton(args: SkeletonArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildSkeletonDataAttributes(),
    class: skeletonVariants({ class: args.class }),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}
