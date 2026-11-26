import { cn } from "../../utils/cn";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { renderIcon } from "../../utils/renderIcon";
import { tw } from "../../utils/tw";
import {
    buildScrollButtonDataAttributes,
    buildScrollButtonTriggerAttributes,
    buildScrollerDataAttributes,
    buildScrollerWrapperDataAttributes,
    buildScrollStateHandler,
    DEFAULT_OFFSET,
    DEFAULT_ORIENTATION,
    DEFAULT_SCROLL_STEP,
    DEFAULT_SHADOW_SIZE,
    DEFAULT_TRIGGER_MODE,
    navigationDirections,
    toFiniteNumber,
} from "./Scroller.expressions";
import type {
    ScrollButtonArgs,
    ScrollDirection,
    ScrollerArgs,
    ScrollerOrientation,
} from "./Scroller.types";

/**
 * Scroller (Dice UI, Base-Variante): scrollbarer Container mit Scroll-Schatten und optionalen Navigationsbuttons.
 * Die Schatten sind CSS-Masken, die über Zustands-Attribute (data-top-scroll usw.) geschaltet werden.
 */

/** Klassen je Orientierung (Quelle: scrollerVariants, unverändert) */
const scrollerOrientationTw: Record<ScrollerOrientation, string> = {
  vertical: [
    tw`overflow-y-auto`,
    tw`data-[top-scroll=true]:[mask-image:linear-gradient(0deg,#000_calc(100%_-_var(--scroll-shadow-size)),transparent)]`,
    tw`data-[bottom-scroll=true]:[mask-image:linear-gradient(180deg,#000_calc(100%_-_var(--scroll-shadow-size)),transparent)]`,
    tw`data-[top-bottom-scroll=true]:[mask-image:linear-gradient(#000,#000,transparent_0,#000_var(--scroll-shadow-size),#000_calc(100%_-_var(--scroll-shadow-size)),transparent)]`,
  ].join(" "),
  horizontal: [
    tw`overflow-x-auto`,
    tw`data-[left-scroll=true]:[mask-image:linear-gradient(270deg,#000_calc(100%_-_var(--scroll-shadow-size)),transparent)]`,
    tw`data-[right-scroll=true]:[mask-image:linear-gradient(90deg,#000_calc(100%_-_var(--scroll-shadow-size)),transparent)]`,
    tw`data-[left-right-scroll=true]:[mask-image:linear-gradient(to_right,#000,#000,transparent_0,#000_var(--scroll-shadow-size),#000_calc(100%_-_var(--scroll-shadow-size)),transparent)]`,
  ].join(" "),
};

/** Klassen zum Ausblenden der Scrollbar */
const scrollerHiddenScrollbarTw = tw`[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`;

/** Wrapper um Scroller und Buttons (nur mit Navigation) */
const scrollerWrapperTw = tw`relative w-full`;

/** Basis-Klassen eines Navigationsbuttons */
const scrollButtonTw = tw`absolute z-10 transition-opacity [&>svg]:size-4 [&>svg]:opacity-80 hover:[&>svg]:opacity-100`;

/** Position je Richtung */
const scrollButtonDirectionTw: Record<ScrollDirection, string> = {
  up: tw`top-2 left-1/2 -translate-x-1/2`,
  down: tw`bottom-2 left-1/2 -translate-x-1/2`,
  left: tw`top-1/2 [left:--spacing(2)] -translate-y-1/2`,
  right: tw`top-1/2 [right:--spacing(2)] -translate-y-1/2`,
};

/** Icon-Inhalte (Lucide chevron-up/-down/-left/-right) */
const scrollButtonIconBody: Record<ScrollDirection, string> = {
  up: `<path d="m18 15-6-6-6 6"></path>`,
  down: `<path d="m6 9 6 6 6-6"></path>`,
  left: `<path d="m15 18-6-6 6-6"></path>`,
  right: `<path d="m9 18 6-6-6-6"></path>`,
};

/** Zugängliche Namen der Buttons (in der Vorlage fehlten sie) */
const scrollButtonLabel: Record<ScrollDirection, string> = {
  up: "Nach oben scrollen",
  down: "Nach unten scrollen",
  left: "Nach links scrollen",
  right: "Nach rechts scrollen",
};

export function scrollerVariants(args: Pick<ScrollerArgs, "orientation" | "hideScrollbar" | "class"> = {}): string {
  return cn(
    scrollerOrientationTw[args.orientation ?? DEFAULT_ORIENTATION],
    args.hideScrollbar && scrollerHiddenScrollbarTw,
    args.class
  );
}

/** Zufällige ID für Scroller mit Navigation, die keine ID bekommen haben: scroller_<8 hex> */
function createScrollerId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return `scroller_${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

/** Navigationsbutton (intern): sichtbar, solange in die Richtung gescrollt werden kann */
function ScrollButton(args: ScrollButtonArgs): string {
  const attrs: HtmlAttributes = {
    type: "button",
    "aria-label": scrollButtonLabel[args.direction],
    ...buildScrollButtonDataAttributes(args.scrollerId, args.direction),
    ...buildScrollButtonTriggerAttributes(args.triggerMode, args.scrollerId, args.direction, args.scrollStep),
    class: cn(scrollButtonTw, scrollButtonDirectionTw[args.direction]),
  };

  return `<button${renderAttributes(attrs)}>${renderIcon(scrollButtonIconBody[args.direction])}</button>`;
}

/**
 * Scrollbarer Container. Mit `withNavigation` liegt er zusammen mit den Buttons in einem Wrapper
 * (`class` und `attributes` gelten immer für das scrollbare Element).
 * Nutzer-Attribute werden zuerst übernommen und von den Standard-Attributen überschrieben.
 */
export function Scroller(args: ScrollerArgs = {}): string {
  const orientation = args.orientation ?? DEFAULT_ORIENTATION;
  const size = toFiniteNumber(args.size, DEFAULT_SHADOW_SIZE);
  const offset = toFiniteNumber(args.offset, DEFAULT_OFFSET);
  const scrollStep = toFiniteNumber(args.scrollStep, DEFAULT_SCROLL_STEP);
  const triggerMode = args.scrollTriggerMode ?? DEFAULT_TRIGGER_MODE;

  const navigationId = args.withNavigation ? args.id || createScrollerId() : undefined;
  const id = navigationId ?? args.id;

  const handler = buildScrollStateHandler({ orientation, offset, navigationId });

  const userStyle = typeof args.attributes?.style === "string" ? args.attributes.style.trim() : "";

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildScrollerDataAttributes(),
    class: scrollerVariants({ orientation, hideScrollbar: args.hideScrollbar, class: args.class }),
    style: `--scroll-shadow-size: ${size}px;${userStyle ? ` ${userStyle}` : ""}`,
    "data-init": handler,
    "data-on:scroll": handler,
    "data-on:resize__window": handler,
  };
  if (id) attrs.id = id;

  const scroller = `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;

  if (navigationId === undefined) return scroller;

  const buttons = navigationDirections[orientation]
    .map((direction) => ScrollButton({ scrollerId: navigationId, direction, scrollStep, triggerMode }))
    .join("");

  const wrapperAttrs: HtmlAttributes = {
    ...buildScrollerWrapperDataAttributes(navigationId),
    class: scrollerWrapperTw,
  };

  return `<div${renderAttributes(wrapperAttrs)}>${buttons}${scroller}</div>`;
}
