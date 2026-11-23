import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { renderIcon } from "../../utils/renderIcon";
import { tw } from "../../utils/tw";
import { Button } from "../button";
import {
    buildControllerConfig,
    buildInitExpression,
    buildScrollToEndExpression,
    buildScrollToMessageExpression,
    buildScrollToStartExpression,
    createScrollerId,
    SLOT,
} from "./MessageScroller.expressions";
import type {
    MessageScrollerArgs,
    MessageScrollerButtonArgs,
    MessageScrollerCommands,
    MessageScrollerContentArgs,
    MessageScrollerItemArgs,
    MessageScrollerProviderArgs,
    MessageScrollerViewportArgs,
} from "./MessageScroller.types";

/*
 * Tailwind-Klassen (shadcn/ui, Base-Variante).
 * Die Quelle verwendet Platzhalter-Klassen (cn-message-scroller*). Aufgelöst wurde nur
 * `.cn-message-scroller-content` aus dem Style "vega" (gap-8); der Style "nova" nutzt gap-6.
 * Die Klassen scroll-fade-b, scrollbar-thin, scrollbar-gutter-stable und scrollbar-thumb-transparent
 * müssen im CSS des Projekts existieren (scroll-fade kommt aus shadcn/tailwind.css).
 */
const messageScrollerTw = tw`group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden`;

const messageScrollerViewportTw = tw`size-full min-h-0 min-w-0 scroll-fade-b scrollbar-thin scrollbar-gutter-stable overflow-y-auto overscroll-contain contain-content data-autoscrolling:scrollbar-thumb-transparent data-autoscrolling:scrollbar-track-transparent data-pending-scroll:invisible`;

const messageScrollerContentTw = tw`flex h-max min-h-full flex-col gap-8`;

const messageScrollerItemTw = tw`min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]`;

const messageScrollerButtonTw = tw`absolute inset-s-1/2 -translate-x-1/2 border-border bg-background text-foreground transition-[translate,scale,opacity] duration-200 hover:bg-muted hover:text-foreground data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=false]:duration-400 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)] data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)] data-[direction=end]:bottom-4 data-[direction=end]:data-[active=false]:translate-y-full data-[direction=start]:top-4 data-[direction=start]:data-[active=false]:-translate-y-full rtl:translate-x-1/2 data-[direction=start]:[&_svg]:rotate-180`;

/** Inneres des lucide-Icons "arrow-down" (die Quelle baut es fest in den Button ein) */
const arrowDownBody = `<path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path>`;

/**
 * Provider: unsichtbarer Wrapper (`display: contents`), der den Scroll-Controller startet.
 * Bei shadcn rendert der Provider kein DOM; hier braucht der Controller ein Element, um Viewport,
 * Buttons und externe Steuerelemente (Sprungmenü) innerhalb des Providers zu finden.
 * Der Controller benötigt Datastar (`data-init`).
 */
export function MessageScrollerProvider(args: MessageScrollerProviderArgs = {}): string {
  const id = args.id || createScrollerId();

  const attrs: HtmlAttributes = {
    ...args.attributes,
    id,
    "data-slot": SLOT.provider,
    class: "contents",
    "data-init": buildInitExpression(buildControllerConfig(args)),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Gestylter Rahmen: füllt sein Elternelement, daher in einen Container mit fester Höhe setzen */
export function MessageScroller(args: MessageScrollerArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": SLOT.root,
    class: cn(messageScrollerTw, args.class),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Scrollbarer Viewport (Landmark-Region, per Tastatur fokussierbar) */
export function MessageScrollerViewport(args: MessageScrollerViewportArgs = {}): string {
  // role, aria-label und tabindex sind Standardwerte, die Nutzer-Attribute ersetzen dürfen
  const attrs: HtmlAttributes = {
    role: "region",
    "aria-label": "Messages",
    tabindex: 0,
    ...args.attributes,
    "data-slot": SLOT.viewport,
    class: cn(messageScrollerViewportTw, args.class),
  };

  if (args.pendingScroll) attrs["data-pending-scroll"] = true;
  if (args.preserveScrollOnPrepend === false) attrs["data-preserve-scroll-on-prepend"] = "false";

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Transcript-Container (Live-Region) mit dem internen Platzhalter für verankerte Zeilen */
export function MessageScrollerContent(args: MessageScrollerContentArgs = {}): string {
  const attrs: HtmlAttributes = {
    role: "log",
    "aria-relevant": "additions",
    ...args.attributes,
    "data-slot": SLOT.content,
    class: cn(messageScrollerContentTw, args.class),
  };

  if (args.busy !== undefined) attrs["aria-busy"] = args.busy ? "true" : "false";

  // Der Controller setzt Höhe und margin-top des Platzhalters (Gap-Ausgleich) per Inline-Style
  const spacerAttrs: HtmlAttributes = {
    "data-slot": SLOT.spacer,
    "aria-hidden": "true",
    class: cn("shrink-0", args.spacerClass),
  };

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}<div${renderAttributes(spacerAttrs)}></div></div>`;
}

/** Eine Zeile des Transcripts: Nachricht, Marker, Tipp-Indikator, Trenner oder "Frühere laden"-Zeile */
export function MessageScrollerItem(args: MessageScrollerItemArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": SLOT.item,
    "data-scroll-anchor": args.scrollAnchor ? "true" : "false",
    class: cn(messageScrollerItemTw, args.class),
  };

  if (args.messageId) attrs["data-message-id"] = args.messageId;

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/**
 * Scroll-Button (rendert den Button des Design-Systems). Er startet inaktiv und inert; der Controller
 * schaltet ihn um, sobald es in seiner Richtung etwas zu scrollen gibt.
 * Der Controller findet ihn über `data-message-scroller-button` (ein `data-slot` kann der Button überschreiben).
 */
export function MessageScrollerButton(args: MessageScrollerButtonArgs = {}): string {
  const direction = args.direction ?? "end";
  const label = args.label ?? (direction === "end" ? "Scroll to end" : "Scroll to start");

  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": SLOT.button,
    "data-message-scroller-button": true,
    "data-direction": direction,
    "data-behavior": args.behavior ?? "smooth",
    "data-active": "false",
    inert: true,
    tabindex: -1,
  };

  return Button({
    variant: args.variant ?? "secondary",
    size: args.size ?? "icon",
    class: cn(messageScrollerButtonTw, args.class),
    attributes: attrs,
    children: args.children ?? [renderIcon(arrowDownBody), `<span class="sr-only">${escapeHtml(label)}</span>`],
  });
}

/**
 * Sprungbefehle für Steuerelemente innerhalb oder ausserhalb des Scrollers (Gegenstück zu
 * `useMessageScroller`). Jeder Aufruf liefert eine Datastar-Expression, z. B. für `data-on:click`.
 * `scrollerId` ist die `id` des Providers.
 */
export function messageScrollerCommands(scrollerId: string): MessageScrollerCommands {
  return {
    scrollToMessage: (messageId, options) => buildScrollToMessageExpression(scrollerId, messageId, options),
    scrollToEnd: (options) => buildScrollToEndExpression(scrollerId, options),
    scrollToStart: (options) => buildScrollToStartExpression(scrollerId, options),
  };
}
