import { cn } from "../../utils/cn";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { safeUrl } from "../../utils/safeUrl";
import { tw } from "../../utils/tw";
import { buildBadgeDataAttributes, DEFAULT_BADGE_VARIANT } from "./Badge.expressions";
import type { BadgeArgs, BadgeVariant } from "./Badge.types";

/**
 * Basis-Klassen des Badges (shadcn/ui, Base-Variante).
 * Die Quelle verwendet Platzhalter-Klassen (cn-badge*), die konkreten Klassen stammen aus dem Style "vega".
 */
export const badgeTw = tw`group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:pointer-events-none [&>svg]:size-3!`;

/** Klassen je Variante */
export const badgeVariantTw: Record<BadgeVariant, string> = {
  default: tw`bg-primary text-primary-foreground [a]:hover:bg-primary/80`,
  secondary: tw`bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80`,
  destructive: tw`bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20`,
  outline: tw`border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground`,
  ghost: tw`hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50`,
  link: tw`text-primary underline-offset-4 hover:underline`,
};

export function badgeVariants(args: Pick<BadgeArgs, "variant" | "class"> = {}): string {
  return cn(badgeTw, badgeVariantTw[args.variant ?? DEFAULT_BADGE_VARIANT], args.class);
}

/**
 * Badge: `<span>` oder, mit `href`, ein Link (`<a>`).
 * Nutzer-Attribute werden zuerst übernommen und von den Standard-Attributen überschrieben.
 */
export function Badge(args: BadgeArgs = {}): string {
  const variant = args.variant ?? DEFAULT_BADGE_VARIANT;

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildBadgeDataAttributes(variant),
    class: badgeVariants({ variant, class: args.class }),
  };

  const isLink = args.href !== undefined;
  if (isLink) attrs.href = safeUrl(args.href ?? "");

  const tag = isLink ? "a" : "span";

  return `<${tag}${renderAttributes(attrs)}>${renderChildren(args.children)}</${tag}>`;
}
