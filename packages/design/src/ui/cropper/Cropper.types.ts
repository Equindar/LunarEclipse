import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Punkt in Pixeln */
export interface CropperPoint {
  x: number;
  y: number;
}

/** Größe in Pixeln */
export interface CropperSize {
  width: number;
  height: number;
}

/** Ausschnitt: Prozentwerte (0-100) oder Pixelwerte, je nach Kontext */
export interface CropperAreaData {
  width: number;
  height: number;
  x: number;
  y: number;
}

/** Größe des Mediums: dargestellt (width, height) und original (naturalWidth, naturalHeight) */
export interface CropperMediaSize extends CropperSize {
  naturalWidth: number;
  naturalHeight: number;
}

/** Form des Zuschnittbereichs */
export type CropperShape = "rectangle" | "circle";

/** Wie das Medium im Container dargestellt wird */
export type CropperObjectFit = "contain" | "cover" | "horizontal-cover" | "vertical-cover";

/**
 * Signal-State eines Croppers. Alle Props der React-Vorlage liegen als Signale vor,
 * ersetzen also die kontrollierten Props (crop, zoom, rotation ...) und die Konfiguration aus dem Context.
 * Signal-Referenz: `$<id mit _ statt ->.<name>`, z. B. `$cropper_demo.zoom`.
 */
export interface CropperSignals {
  /** Position des Mediums in Pixeln (crop.x) */
  cropX: number;
  /** Position des Mediums in Pixeln (crop.y) */
  cropY: number;
  zoom: number;
  /** Drehung in Grad */
  rotation: number;
  minZoom: number;
  maxZoom: number;
  zoomSpeed: number;
  /** Schrittweite der Pfeiltasten in Pixeln (mit Shift 20 %) */
  keyboardStep: number;
  aspectRatio: number;
  shape: CropperShape;
  objectFit: CropperObjectFit;
  allowOverflow: boolean;
  preventScrollZoom: boolean;
  withGrid: boolean;
  /** Dargestellte Breite des Mediums (0, solange es nicht geladen ist) */
  mediaWidth: number;
  /** Dargestellte Höhe des Mediums */
  mediaHeight: number;
  /** Originalbreite des Mediums */
  naturalWidth: number;
  /** Originalhöhe des Mediums */
  naturalHeight: number;
  /** Breite des Zuschnittbereichs in Pixeln (0, solange das Medium nicht geladen ist) */
  cropWidth: number;
  /** Höhe des Zuschnittbereichs in Pixeln */
  cropHeight: number;
  /** true während der Interaktion (Ziehen, Pinch, Mausrad, Pfeiltasten) */
  dragging: boolean;
  /** Ausschnitt in Prozent (Ergebnis von onCropAreaChange) */
  areaX: number;
  areaY: number;
  areaWidth: number;
  areaHeight: number;
  /** Ausschnitt in Pixeln des Originals (Ergebnis von onCropAreaChange) */
  pixelX: number;
  pixelY: number;
  pixelWidth: number;
  pixelHeight: number;
}

/**
 * Detail der Events `cropareachange` und `cropcomplete`
 * (ersetzen onCropAreaChange und onCropComplete der React-Vorlage).
 */
export interface CropperAreaEventDetail {
  /** Ausschnitt in Prozent (0-100) */
  area: CropperAreaData;
  /** Ausschnitt in Pixeln des Originals */
  pixels: CropperAreaData;
}

/** Detail des Events `wheelzoom` (cancelable über `detail.event.preventDefault()`, ersetzt onWheelZoom) */
export interface CropperWheelZoomEventDetail {
  event: WheelEvent;
}

/**
 * Namen der Events, die der Cropper am Cropper-Element auslöst (bubbles: true).
 * Abonnieren per Datastar, z. B. `data-on:cropcomplete="... evt.detail.pixels ..."`.
 *
 * - `medialoaded` (detail: CropperMediaSize): ersetzt onMediaLoaded
 * - `cropsizechange` (detail: CropperSize): ersetzt onCropSizeChange
 * - `cropareachange` (detail: CropperAreaEventDetail): ersetzt onCropAreaChange
 * - `cropcomplete` (detail: CropperAreaEventDetail): ersetzt onCropComplete
 * - `interactionstart` / `interactionend`: ersetzen onInteractionStart / onInteractionEnd
 * - `wheelzoom` (detail: CropperWheelZoomEventDetail): ersetzt onWheelZoom
 *
 * onCropChange, onZoomChange und onRotationChange entfallen: crop, zoom und rotation sind Signale
 * (`$<id>.cropX`, `$<id>.cropY`, `$<id>.zoom`, `$<id>.rotation`), die sich lesen und schreiben lassen.
 */
export type CropperEventName =
  | "medialoaded"
  | "cropsizechange"
  | "cropareachange"
  | "cropcomplete"
  | "interactionstart"
  | "interactionend"
  | "wheelzoom";

export interface CropperArgs {
  /**
   * Pflicht: ID des Croppers. Verknüpft die Teile (CropperImage, CropperVideo, CropperArea über `cropperId`)
   * und bestimmt den Signal-Namen (aus "-" wird "_"). Muss pro Seite eindeutig sein.
   */
  id: string;
  /** Klassen für den äußeren Container (Standard: "relative size-full overflow-hidden") */
  class?: string;
  /** Anfangsposition des Mediums in Pixeln (Standard: { x: 0, y: 0 }) */
  crop?: CropperPoint;
  /** Anfangs-Zoom (Standard: 1) */
  zoom?: number;
  /** Kleinster Zoom (Standard: 1) */
  minZoom?: number;
  /** Größter Zoom (Standard: 3) */
  maxZoom?: number;
  /** Zoom-Geschwindigkeit beim Mausrad (Standard: 1) */
  zoomSpeed?: number;
  /** Anfangsdrehung in Grad (Standard: 0) */
  rotation?: number;
  /** Schrittweite der Pfeiltasten in Pixeln (Standard: 1) */
  keyboardStep?: number;
  /** Seitenverhältnis des Zuschnittbereichs, Breite durch Höhe (Standard: 4 / 3) */
  aspectRatio?: number;
  /** Form des Zuschnittbereichs, gilt für CropperArea ohne eigenes `shape` (Standard: "rectangle") */
  shape?: CropperShape;
  /** Darstellung des Mediums, gilt für CropperImage und CropperVideo ohne eigenes `objectFit` (Standard: "contain") */
  objectFit?: CropperObjectFit;
  /** Erlaubt, das Medium über den Zuschnittbereich hinaus zu verschieben (Standard: false) */
  allowOverflow?: boolean;
  /** Deaktiviert das Zoomen per Mausrad (Standard: false) */
  preventScrollZoom?: boolean;
  /** Zeigt ein Raster im Zuschnittbereich, gilt für CropperArea ohne eigenes `withGrid` (Standard: false) */
  withGrid?: boolean;
  /**
   * Zusätzliche HTML-Attribute für das fokussierbare innere Element (`data-slot="cropper"`),
   * wie in der Vorlage, wo die übrigen Props dort landen. Werden von den Standard-Attributen überschrieben.
   */
  attributes?: HtmlAttributes;
  /** Inhalt: CropperImage oder CropperVideo, dazu CropperArea */
  children?: Children;
}

interface CropperPartArgs {
  /** Pflicht: ID des Croppers (`CropperArgs.id`) */
  cropperId: string;
  class?: string;
  /** Zusätzliche HTML-Attribute (werden von den Standard-Attributen überschrieben) */
  attributes?: HtmlAttributes;
}

export interface CropperImageArgs extends CropperPartArgs {
  src?: string;
  /** Alternativtext (Standard: leer) */
  alt?: string;
  /** Für Bilder von anderen Domains nötig, z. B. "anonymous" */
  crossOrigin?: "" | "anonymous" | "use-credentials";
  /** Überschreibt `objectFit` des Croppers */
  objectFit?: CropperObjectFit;
  /** Rundet die Position auf Gerätepixel (schärfere Darstellung, Standard: false) */
  snapPixels?: boolean;
}

export interface CropperVideoArgs extends CropperPartArgs {
  src?: string;
  /** Für Videos von anderen Domains nötig, z. B. "anonymous" */
  crossOrigin?: "" | "anonymous" | "use-credentials";
  /** Überschreibt `objectFit` des Croppers */
  objectFit?: CropperObjectFit;
  /** Rundet die Position auf Gerätepixel (schärfere Darstellung, Standard: false) */
  snapPixels?: boolean;
  /** Standard: true */
  autoplay?: boolean;
  /** Standard: true */
  playsInline?: boolean;
  /** Standard: true */
  loop?: boolean;
  /** Standard: true */
  muted?: boolean;
  /** Standard: false */
  controls?: boolean;
}

export interface CropperAreaArgs extends CropperPartArgs {
  /** Überschreibt `shape` des Croppers */
  shape?: CropperShape;
  /** Überschreibt `withGrid` des Croppers */
  withGrid?: boolean;
  /** Rundet die Größe auf ganze Pixel (Standard: false) */
  snapPixels?: boolean;
}
