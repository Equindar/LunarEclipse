import { cn } from "../../utils/cn";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { safeUrl } from "../../utils/safeUrl";
import { tw } from "../../utils/tw";
import {
    buildStatusDataAttributes,
    buildStatusIndicatorDataAttributes,
    buildStatusLabelDataAttributes,
    DEFAULT_STATUS_VARIANT,
} from "./Status.expressions";
import type { StatusArgs, StatusIndicatorArgs, StatusLabelArgs, StatusVariant } from "./Status.types";

/**
 * Basis-Klassen des Status (Dice UI, Base-Variante, 1:1 aus dem cva-Aufruf der Quelle).
 */
const statusTw = tw`inline-flex w-fit shrink-0 items-center gap-1.5 overflow-hidden rounded-4xl border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors`;

/** Klassen je Variante; der Indikator wird über `**:data-[slot=status-indicator]` mitgefärbt */
const statusVariantTw: Record<StatusVariant, string> = {
  default: tw`border-transparent bg-muted text-muted-foreground **:data-[slot=status-indicator]:bg-muted-foreground`,
  success: tw`border-green-500/20 bg-green-500/10 text-green-600 **:data-[slot=status-indicator]:bg-green-600 dark:text-green-400 **:data-[slot=status-indicator]:dark:bg-green-400`,
  error: tw`border-destructive/20 bg-destructive/10 text-destructive **:data-[slot=status-indicator]:bg-destructive`,
  warning: tw`border-orange-500/20 bg-orange-500/10 text-orange-600 **:data-[slot=status-indicator]:bg-orange-600 dark:text-orange-400 **:data-[slot=status-indicator]:dark:bg-orange-400`,
  info: tw`border-blue-500/20 bg-blue-500/10 text-blue-600 **:data-[slot=status-indicator]:bg-blue-600 dark:text-blue-400 **:data-[slot=status-indicator]:dark:bg-blue-400`,
};

/** Klassen des Indikators: Punkt mit Ping-Animation (before) und innerem Punkt (after) */
const statusIndicatorTw = tw`relative flex size-2 shrink-0 rounded-full before:absolute before:inset-0 before:animate-ping before:rounded-full before:bg-inherit after:absolute after:inset-0.5 after:rounded-full after:bg-inherit`;

/** Klassen des Labels */
const statusLabelTw = tw`leading-none`;

/** Entspricht `statusVariants()` der Quelle (cva): Basis, Variante, eigene Klassen */
export function statusVariants(args: Pick<StatusArgs, "variant" | "class"> = {}): string {
  return cn(statusTw, statusVariantTw[args.variant ?? DEFAULT_STATUS_VARIANT], args.class);
}

/**
 * Status: `<div>` oder, mit `href`, ein Link (`<a>`).
 * Nutzer-Attribute werden zuerst übernommen und von den Standard-Attributen überschrieben.
 */
export function Status(args: StatusArgs = {}): string {
  const variant = args.variant ?? DEFAULT_STATUS_VARIANT;

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildStatusDataAttributes(variant),
    class: statusVariants({ variant, class: args.class }),
  };

  const isLink = args.href !== undefined;
  if (isLink) attrs.href = safeUrl(args.href ?? "");

  const tag = isLink ? "a" : "div";

  return `<${tag}${renderAttributes(attrs)}>${renderChildren(args.children)}</${tag}>`;
}

/** Animierter Punkt; seine Farbe kommt von der Variante des umgebenden Status */
export function StatusIndicator(args: StatusIndicatorArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildStatusIndicatorDataAttributes(),
    class: cn(statusIndicatorTw, args.class),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Text des Status */
export function StatusLabel(args: StatusLabelArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildStatusLabelDataAttributes(),
    class: cn(statusLabelTw, args.class),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}
