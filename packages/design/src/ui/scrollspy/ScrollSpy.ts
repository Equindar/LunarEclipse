import { cn } from "../../utils/cn";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { safeUrl } from "../../utils/safeUrl";
import { tw } from "../../utils/tw";
import { withSlot } from "../../utils/withSlot";
import {
    buildScrollSpyEffectExpression,
    buildScrollSpyInitExpression,
    buildScrollSpyLinkClickExpression,
    buildScrollSpyLinkStateExpression,
    buildScrollSpyOrientationAttributes,
    buildScrollSpySetValueExpression,
    createScrollSpyId,
    DEFAULT_SCROLL_SPY_ORIENTATION,
    scrollSpySignals,
} from "./ScrollSpy.expressions";
import type {
    ScrollSpyArgs,
    ScrollSpyLinkArgs,
    ScrollSpyNavArgs,
    ScrollSpyOrientation,
    ScrollSpySectionArgs,
    ScrollSpyViewportArgs,
} from "./ScrollSpy.types";

/**
 * Tailwind-Klassen des ScrollSpy (DiceUI, Base-Variante, unverändert übernommen).
 * Die Quelle liest die Ausrichtung aus dem React-Context, hier steuert sie das Argument `orientation` je Teil.
 */
export const scrollSpyTw = tw`flex`;
export const scrollSpyNavTw = tw`flex gap-1.5`;
export const scrollSpyLinkTw = tw`rounded-lg px-3 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground data-[state=active]:bg-accent data-[state=active]:text-foreground`;
export const scrollSpyViewportTw = tw`flex flex-1 flex-col gap-6`;

/** Richtung des Roots je Ausrichtung */
export const scrollSpyOrientationTw: Record<ScrollSpyOrientation, string> = {
  horizontal: tw`flex-row`,
  vertical: tw`flex-col`,
};

/** Richtung der Navigation je Ausrichtung (gegenläufig zum Root) */
export const scrollSpyNavOrientationTw: Record<ScrollSpyOrientation, string> = {
  horizontal: tw`flex-col`,
  vertical: tw`flex-row`,
};

export function scrollSpyVariants(args: Pick<ScrollSpyArgs, "orientation" | "class"> = {}): string {
  return cn(scrollSpyTw, scrollSpyOrientationTw[args.orientation ?? DEFAULT_SCROLL_SPY_ORIENTATION], args.class);
}

export function scrollSpyNavVariants(args: Pick<ScrollSpyNavArgs, "orientation" | "class"> = {}): string {
  return cn(scrollSpyNavTw, scrollSpyNavOrientationTw[args.orientation ?? DEFAULT_SCROLL_SPY_ORIENTATION], args.class);
}

export function scrollSpyLinkVariants(args: Pick<ScrollSpyLinkArgs, "class"> = {}): string {
  return cn(scrollSpyLinkTw, args.class);
}

export function scrollSpyViewportVariants(args: Pick<ScrollSpyViewportArgs, "class"> = {}): string {
  return cn(scrollSpyViewportTw, args.class);
}

/**
 * Ausdruck für `data-on:*` externer Auslöser: setzt den aktiven Abschnitt und scrollt dorthin
 * (ersetzt die kontrollierte `value`-Prop der Quelle).
 */
export function scrollSpySetValue(id: string, value: string): string {
  return buildScrollSpySetValueExpression(id, value);
}

/**
 * Wurzel: Signal-State, Beobachter der Abschnitte und Scroll-Funktion (`data-init`),
 * Reaktion auf externe Wertänderungen und `onValueChange` (`data-effect`).
 * Funktioniert nur mit geladenem Datastar; ohne Datastar bleiben die Links normale Anker.
 */
export function ScrollSpy(args: ScrollSpyArgs = {}): string {
  const id = args.id || createScrollSpyId();
  const orientation = args.orientation ?? DEFAULT_SCROLL_SPY_ORIENTATION;
  const initialValue = args.value ?? args.defaultValue ?? "";

  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "scroll-spy"),
    ...buildScrollSpyOrientationAttributes(orientation),
    id,
    "data-signals": scrollSpySignals(id, initialValue).dataSignals,
    class: scrollSpyVariants({ orientation, class: args.class }),
  };

  if (args.dir) attrs.dir = args.dir;

  // data-init nach data-signals, data-effect nach data-init
  attrs["data-init"] = buildScrollSpyInitExpression(id, initialValue, args);
  attrs["data-effect"] = buildScrollSpyEffectExpression(id, args);

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Navigationsbereich (`<nav>`) */
export function ScrollSpyNav(args: ScrollSpyNavArgs = {}): string {
  const orientation = args.orientation ?? DEFAULT_SCROLL_SPY_ORIENTATION;

  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "scroll-spy-nav"),
    ...buildScrollSpyOrientationAttributes(orientation),
    class: scrollSpyNavVariants({ orientation, class: args.class }),
  };


  return `<nav${renderAttributes(attrs)}>${renderChildren(args.children)}</nav>`;
}

/**
 * Link zu einem Abschnitt. Ein Klick scrollt dorthin und setzt den Wert.
 * `data-state` ist "active" oder "inactive", ohne Datastar bleibt der Link ein normaler Anker.
 */
export function ScrollSpyLink(args: ScrollSpyLinkArgs): string {
  const orientation = args.orientation ?? DEFAULT_SCROLL_SPY_ORIENTATION;

  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "scroll-spy-link"),
    ...buildScrollSpyOrientationAttributes(orientation),
    href: safeUrl(`#${encodeURIComponent(args.value)}`),
    "data-state": "inactive",
    "data-attr:data-state": buildScrollSpyLinkStateExpression(args.scrollSpyId, args.value),
    "data-on:click": buildScrollSpyLinkClickExpression(args.scrollSpyId, args.value),
    class: scrollSpyLinkVariants({ class: args.class }),
  };


  return `<a${renderAttributes(attrs)}>${renderChildren(args.children)}</a>`;
}

/** Container für die Abschnitte */
export function ScrollSpyViewport(args: ScrollSpyViewportArgs = {}): string {
  const orientation = args.orientation ?? DEFAULT_SCROLL_SPY_ORIENTATION;

  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "scroll-spy-viewport"),
    ...buildScrollSpyOrientationAttributes(orientation),
    class: scrollSpyViewportVariants({ class: args.class }),
  };


  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Abschnitt, der vom Scroll-Spy beobachtet wird. Sein `value` ist zugleich seine `id`. */
export function ScrollSpySection(args: ScrollSpySectionArgs): string {
  const orientation = args.orientation ?? DEFAULT_SCROLL_SPY_ORIENTATION;

  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, "scroll-spy-section"),
    ...buildScrollSpyOrientationAttributes(orientation),
    id: args.value,
    class: args.class || undefined,
  };


  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}
