import { cn } from "../../utils/cn";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { safeUrl } from "../../utils/safeUrl";
import { tw } from "../../utils/tw";
import {
    buildAreaDataClass,
    buildAreaShowExpression,
    buildAreaSizeExpression,
    buildCropperEffectHandler,
    buildCropperInitHandler,
    buildMediaDataClass,
    buildMediaTransformExpression,
    cropperInitialSignals,
    cropperSignals,
    DEFAULT_OBJECT_FIT,
    DEFAULT_SHAPE,
} from "./Cropper.expressions";
import type {
    CropperAreaArgs,
    CropperArgs,
    CropperImageArgs,
    CropperObjectFit,
    CropperShape,
    CropperVideoArgs,
} from "./Cropper.types";

/**
 * Klassen der Teile (Dice UI, Base-Variante). Die Quelle verwendet keine Platzhalter-Klassen,
 * die konkreten Klassen werden unverändert übernommen.
 */
const cropperWrapperTw = tw`relative size-full overflow-hidden`;

const cropperTw = tw`absolute inset-0 flex cursor-move touch-none items-center justify-center overflow-hidden outline-none select-none`;

const cropperMediaTw = tw`will-change-transform`;

const cropperMediaFitTw: Record<CropperObjectFit, string> = {
  contain: tw`absolute inset-0 m-auto max-h-full max-w-full`,
  cover: tw`h-auto w-full`,
  "horizontal-cover": tw`h-auto w-full`,
  "vertical-cover": tw`h-full w-auto`,
};

const cropperAreaTw = tw`absolute top-1/2 left-1/2 box-border -translate-x-1/2 -translate-y-1/2 overflow-hidden border-[2.5px] border-white/90 shadow-[0_0_0_9999em_rgba(0,0,0,0.5)]`;

const cropperAreaShapeTw: Record<CropperShape, string> = {
  rectangle: "",
  circle: tw`rounded-full`,
};

const cropperAreaGridTw = tw`before:absolute before:top-0 before:right-1/3 before:bottom-0 before:left-1/3 before:box-border before:border before:border-t-0 before:border-b-0 before:border-white/50 before:content-[''] after:absolute after:top-1/3 after:right-0 after:bottom-1/3 after:left-0 after:box-border after:border after:border-r-0 after:border-l-0 after:border-white/50 after:content-['']`;

function cropperMediaClass(objectFit: CropperObjectFit, extra?: string): string {
  return cn(cropperMediaTw, cropperMediaFitTw[objectFit], extra);
}

function cropperAreaClass(shape: CropperShape, withGrid: boolean, extra?: string): string {
  return cn(cropperAreaTw, cropperAreaShapeTw[shape], withGrid && cropperAreaGridTw, extra);
}

/**
 * Cropper: äußerer Container (`data-slot="cropper-wrapper"`) mit dem fokussierbaren inneren Element
 * (`data-slot="cropper"`), das Ziehen, Zoomen, Drehen und die Tastatur übernimmt.
 * Funktioniert nur mit geladenem Datastar.
 */
export function Cropper(args: CropperArgs): string {
  const signals = cropperSignals(args.id, cropperInitialSignals(args));

  const wrapperAttrs: HtmlAttributes = {
    id: args.id,
    "data-slot": "cropper-wrapper",
    "data-signals": signals.dataSignals,
    class: cn(cropperWrapperTw, args.class),
  };

  // Nutzer-Attribute zuerst, die Standard-Attribute überschreiben sie
  const innerAttrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "cropper",
    tabindex: 0,
    class: cropperTw,
    "data-init": buildCropperInitHandler(args.id),
    "data-effect": buildCropperEffectHandler(args.id),
  };

  return `<div${renderAttributes(wrapperAttrs)}><div${renderAttributes(innerAttrs)}>${renderChildren(args.children)}</div></div>`;
}

/** Klassen, die `data-class` je nach Signal `objectFit` des Croppers ein- und ausschaltet */
const mediaFitClasses = {
  contain: cropperMediaFitTw.contain,
  horizontal: cropperMediaFitTw.cover,
  vertical: cropperMediaFitTw["vertical-cover"],
};

/** Gemeinsame Attribute von Bild und Video */
function buildMediaAttributes(
  args: CropperImageArgs | CropperVideoArgs,
  slot: "cropper-image" | "cropper-video"
): HtmlAttributes {
  const attrs: HtmlAttributes = { ...args.attributes };

  if (args.src !== undefined) attrs.src = safeUrl(args.src);
  if (args.crossOrigin !== undefined) attrs.crossorigin = args.crossOrigin;

  attrs["data-slot"] = slot;
  attrs.class = cropperMediaClass(args.objectFit ?? DEFAULT_OBJECT_FIT, args.class);

  // Ohne eigenes objectFit folgt das Medium dem Signal des Croppers (Vorlage: Context)
  if (args.objectFit === undefined) {
    attrs["data-class"] = buildMediaDataClass(args.cropperId, mediaFitClasses);
  }

  attrs["data-style:transform"] = buildMediaTransformExpression(args.cropperId, args.snapPixels ?? false);

  return attrs;
}

/** Bild, das zugeschnitten wird */
export function CropperImage(args: CropperImageArgs): string {
  const attrs = buildMediaAttributes(args, "cropper-image");
  attrs.alt = args.alt ?? "";

  return `<img${renderAttributes(attrs)}>`;
}

/** Video, das zugeschnitten wird (Standard wie die Vorlage: autoplay, playsinline, loop, muted, ohne Controls) */
export function CropperVideo(args: CropperVideoArgs): string {
  const attrs = buildMediaAttributes(args, "cropper-video");

  attrs.autoplay = args.autoplay ?? true;
  attrs.playsinline = args.playsInline ?? true;
  attrs.loop = args.loop ?? true;
  attrs.muted = args.muted ?? true;
  attrs.controls = args.controls ?? false;

  return `<video${renderAttributes(attrs)}></video>`;
}

/**
 * Zuschnittbereich (Overlay mit Rahmen und abgedunkelter Umgebung).
 * Bleibt unsichtbar, bis das Medium geladen und die Größe berechnet ist.
 */
export function CropperArea(args: CropperAreaArgs): string {
  const shape = args.shape ?? DEFAULT_SHAPE;
  const withGrid = args.withGrid ?? false;
  const snapPixels = args.snapPixels ?? false;

  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "cropper-area",
    class: cropperAreaClass(shape, withGrid, args.class),
    style: "display: none;",
    "data-show": buildAreaShowExpression(args.cropperId),
    "data-style:width": buildAreaSizeExpression(args.cropperId, "width", snapPixels),
    "data-style:height": buildAreaSizeExpression(args.cropperId, "height", snapPixels),
  };

  // Ohne eigenes shape/withGrid folgt der Bereich den Signalen des Croppers
  const dataClass = buildAreaDataClass(args.cropperId, {
    circleClass: args.shape === undefined ? cropperAreaShapeTw.circle : undefined,
    gridClass: args.withGrid === undefined ? cropperAreaGridTw : undefined,
  });
  if (dataClass !== "{}") attrs["data-class"] = dataClass;

  return `<div${renderAttributes(attrs)}></div>`;
}
