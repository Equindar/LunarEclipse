import { cn } from "../../utils/cn";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import { withSlot } from "../../utils/withSlot";
import {
    buildGroupDataAttributes,
    buildHandleDataAttributes,
    buildKeyDownHandler,
    buildPanelDataAttributes,
    buildPointerDownHandler,
    buildPointerEndHandler,
    buildPointerMoveHandler,
    createHandleId,
    DEFAULT_ORIENTATION,
    resizableHandleSignals,
    SLOT,
} from "./Resizable.expressions";
import type { ResizableHandleArgs, ResizablePanelArgs, ResizablePanelGroupArgs } from "./Resizable.types";

/**
 * Klassen der Panel-Gruppe (shadcn/ui, Base-Variante).
 * Der Platzhalter cn-resizable-panel-group hat in style-vega keine Regeln und entfällt.
 */
const resizablePanelGroupTw = tw`flex h-full w-full aria-[orientation=vertical]:flex-col`;

/**
 * Klassen des Handles (shadcn/ui, Base-Variante).
 * Der Platzhalter cn-resizable-handle hat in style-vega keine Regeln und entfällt.
 */
const resizableHandleTw = tw`relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90`;

/** Sichtbarer Griff (cn-resizable-handle-icon aus style-vega aufgelöst) */
const resizableHandleIconTw = tw`z-10 flex shrink-0 bg-border h-6 w-1 rounded-lg`;

export function resizablePanelGroupVariants(args: Pick<ResizablePanelGroupArgs, "class"> = {}): string {
  return cn(resizablePanelGroupTw, args.class);
}

export function resizableHandleVariants(args: Pick<ResizableHandleArgs, "class"> = {}): string {
  return cn(resizableHandleTw, args.class);
}

/**
 * Gruppe, die Panels und Handles im Wechsel (Panel, Handle, Panel, ...) nebeneinander oder untereinander anordnet.
 * Die Interaktion braucht geladenes Datastar.
 */
export function ResizablePanelGroup(args: ResizablePanelGroupArgs = {}): string {
  const orientation = args.orientation ?? DEFAULT_ORIENTATION;

  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, SLOT.group),
    ...buildGroupDataAttributes(orientation),
    class: resizablePanelGroupVariants({ class: args.class }),
  };
  if (args.id) attrs.id = args.id;

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Ein Panel der Gruppe; seine Grösse steuert flex-grow, min- und maxSize begrenzen das Ziehen */
export function ResizablePanel(args: ResizablePanelArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, SLOT.panel),
    ...buildPanelDataAttributes(args),
  };
  if (args.id) attrs.id = args.id;
  if (args.class) attrs.class = args.class;

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/**
 * Trennlinie zwischen zwei Panels, per Maus, Touch oder Tastatur (Pfeiltasten, Home, End) verschiebbar.
 * `orientation` muss zur Gruppe passen.
 */
export function ResizableHandle(args: ResizableHandleArgs = {}): string {
  const orientation = args.orientation ?? DEFAULT_ORIENTATION;
  const handleId = args.id ?? createHandleId();
  const signals = resizableHandleSignals(handleId);

  const pointerDown = buildPointerDownHandler(handleId);
  const pointerMove = buildPointerMoveHandler(handleId);
  const pointerEnd = buildPointerEndHandler(handleId);
  const keyDown = buildKeyDownHandler();

  const attrs: HtmlAttributes = {
    ...withSlot(args.attributes, SLOT.handle),
    ...buildHandleDataAttributes(orientation),
    class: resizableHandleVariants({ class: args.class }),
    "data-signals": signals.dataSignals,
    "data-on:pointerdown": pointerDown,
    "data-on:pointermove": pointerMove,
    "data-on:pointerup": pointerEnd,
    "data-on:pointercancel": pointerEnd,
    "data-on:keydown": keyDown,
  };
  if (args.id) attrs.id = args.id;

  const grip = args.withHandle ? `<div class="${resizableHandleIconTw}"></div>` : "";

  return `<div${renderAttributes(attrs)}>${grip}</div>`;
}
