import { createSignals } from "../../utils/SignalManager";
import type { CropperArgs, CropperObjectFit, CropperShape, CropperSignals } from "./Cropper.types";

/**
 * Datastar-Expressions und Laufzeit des Croppers.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_ASPECT_RATIO = 4 / 3;
export const DEFAULT_SHAPE: CropperShape = "rectangle";
export const DEFAULT_OBJECT_FIT: CropperObjectFit = "contain";

/** Anfangswerte der Signale (entsprechen den Standardwerten der React-Vorlage) */
export function cropperInitialSignals(args: Omit<CropperArgs, "id" | "class" | "attributes" | "children"> = {}): CropperSignals {
  return {
    cropX: args.crop?.x ?? 0,
    cropY: args.crop?.y ?? 0,
    zoom: args.zoom ?? 1,
    rotation: args.rotation ?? 0,
    minZoom: args.minZoom ?? 1,
    maxZoom: args.maxZoom ?? 3,
    zoomSpeed: args.zoomSpeed ?? 1,
    keyboardStep: args.keyboardStep ?? 1,
    aspectRatio: args.aspectRatio ?? DEFAULT_ASPECT_RATIO,
    shape: args.shape ?? DEFAULT_SHAPE,
    objectFit: args.objectFit ?? DEFAULT_OBJECT_FIT,
    allowOverflow: args.allowOverflow ?? false,
    preventScrollZoom: args.preventScrollZoom ?? false,
    withGrid: args.withGrid ?? false,
    mediaWidth: 0,
    mediaHeight: 0,
    naturalWidth: 0,
    naturalHeight: 0,
    cropWidth: 0,
    cropHeight: 0,
    dragging: false,
    areaX: 0,
    areaY: 0,
    areaWidth: 0,
    areaHeight: 0,
    pixelX: 0,
    pixelY: 0,
    pixelWidth: 0,
    pixelHeight: 0,
  };
}

/** Signal-Manager eines Croppers (Signal-Name = ID mit "-" → "_") */
export const cropperSignals = (cropperId: string, initial: CropperSignals = cropperInitialSignals()) =>
  createSignals<CropperSignals>(cropperId, initial);

/**
 * Laufzeit des Croppers als JavaScript-Text (Funktionskörper mit den Parametern `el` und `s`).
 *
 * Regeln, damit der Text sicher in einem Datastar-Attribut steht:
 * - Kein Backslash, kein Backtick, kein Dollarzeichen und kein "@name(" im Text.
 * - Jede Anweisung endet mit Semikolon, Kommentare stehen hier und nicht im Text.
 *
 * Gegenüber der React-Vorlage:
 * - Der Store ist durch die Signale `s` ersetzt (Datastar-Proxy, Lesen und Schreiben wirken reaktiv).
 * - Die LRU-Caches samt Quantisierung entfallen (Rechenergebnis exakt statt auf Cache-Schlüssel gerundet).
 * - Callbacks sind CustomEvents am Element (siehe CropperEventName).
 * - Der Zoom-Punkt wird mit der aktuellen Position des Elements berechnet (die Vorlage nutzt beim Mausrad
 *   die Position vom letzten Mousedown, anfangs 0/0).
 */
const RUNTIME = String.raw`
function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }
function radian(d) { return d * Math.PI / 180; }
function rotateSize(w, h, r) {
  var a = radian(r), c = Math.cos(a), n = Math.sin(a);
  return { width: Math.abs(c * w) + Math.abs(n * h), height: Math.abs(n * w) + Math.abs(c * h) };
}
function getCropSize(mw, mh, cw, ch, aspect, r) {
  var b = rotateSize(mw, mh, r), fw = Math.min(b.width, cw), fh = Math.min(b.height, ch);
  return fw > fh * aspect ? { width: fh * aspect, height: fh } : { width: fw, height: fw / aspect };
}
function clampPosition(p, ms, cs, zoom, r) {
  var b = rotateSize(ms.width, ms.height, r);
  var mx = b.width * zoom * 0.5 - cs.width * 0.5, my = b.height * zoom * 0.5 - cs.height * 0.5;
  return { x: clamp(p.x, -mx, mx), y: clamp(p.y, -my, my) };
}
function getCroppedArea(crop, ms, cs, aspect, zoom, r) {
  var lim = function (max, v) { return Math.min(max, Math.max(0, v)); };
  var bb = rotateSize(ms.width, ms.height, r);
  var nb = rotateSize(ms.naturalWidth, ms.naturalHeight, r);
  var pc = {
    x: lim(100, (((bb.width - cs.width / zoom) / 2 - crop.x / zoom) / bb.width) * 100),
    y: lim(100, (((bb.height - cs.height / zoom) / 2 - crop.y / zoom) / bb.height) * 100),
    width: lim(100, ((cs.width / bb.width) * 100) / zoom),
    height: lim(100, ((cs.height / bb.height) * 100) / zoom)
  };
  var wpx = Math.round(lim(nb.width, (pc.width * nb.width) / 100));
  var hpx = Math.round(lim(nb.height, (pc.height * nb.height) / 100));
  var wider = nb.width >= nb.height * aspect;
  var size = wider ? { width: Math.round(hpx * aspect), height: hpx } : { width: wpx, height: Math.round(wpx / aspect) };
  var px = {
    width: size.width,
    height: size.height,
    x: Math.round(lim(nb.width - size.width, (pc.x * nb.width) / 100)),
    y: Math.round(lim(nb.height - size.height, (pc.y * nb.height) / 100))
  };
  return { percentages: pc, pixels: px };
}
function distance(a, b) { return Math.sqrt((a.y - b.y) * (a.y - b.y) + (a.x - b.x) * (a.x - b.x)); }
function middle(a, b) { return { x: (b.x + a.x) * 0.5, y: (b.y + a.y) * 0.5 }; }
function angleOf(a, b) { return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI; }
function emit(name, detail) { el.dispatchEvent(new CustomEvent(name, { bubbles: true, detail: detail })); }
function getMedia() { return el.querySelector('[data-slot=cropper-image],[data-slot=cropper-video]'); }
function isVideo(m) { return m.tagName === 'VIDEO'; }
function mediaReady(m) {
  if (!m) return false;
  return isVideo(m) ? m.videoWidth > 0 && m.videoHeight > 0 : m.complete && m.naturalWidth > 0;
}
function getMediaSize() {
  return s.naturalWidth > 0 ? { width: s.mediaWidth, height: s.mediaHeight, naturalWidth: s.naturalWidth, naturalHeight: s.naturalHeight } : null;
}
function getCropArea() {
  return s.cropWidth > 0 && s.cropHeight > 0 ? { width: s.cropWidth, height: s.cropHeight } : null;
}
function setCrop(p) {
  if (s.cropX !== p.x) s.cropX = p.x;
  if (s.cropY !== p.y) s.cropY = p.y;
}
function limit(p, ms, cs, zoom) {
  return s.allowOverflow ? p : clampPosition(p, ms, cs, zoom, s.rotation);
}
var rafClamp = 0, rafCompute = 0, rafArea = 0, rafDrag = 0, rafPinch = 0, wheelTimer = 0;
var dragStart = { x: 0, y: 0 }, dragCrop = { x: 0, y: 0 };
var pinchDistance = 0, pinchRotation = 0, touching = false, gestureZoom = 0, gestureRotation = 0;
var lastZoom = s.zoom, lastRotation = s.rotation, lastAspect = s.aspectRatio, lastFit = s.objectFit;
function clampCrop() {
  var ms = getMediaSize(), cs = getCropArea();
  if (!ms || !cs) return;
  var p = { x: s.cropX, y: s.cropY };
  var n = limit(p, ms, cs, s.zoom);
  if (Math.abs(n.x - p.x) > 0.001 || Math.abs(n.y - p.y) > 0.001) setCrop(n);
}
function scheduleClamp() {
  if (rafClamp) return;
  rafClamp = requestAnimationFrame(function () { rafClamp = 0; clampCrop(); });
}
function scheduleArea() {
  if (rafArea) return;
  rafArea = requestAnimationFrame(function () {
    rafArea = 0;
    var ms = getMediaSize(), cs = getCropArea();
    if (!ms || !cs) return;
    var a = getCroppedArea({ x: s.cropX, y: s.cropY }, ms, cs, s.aspectRatio, s.zoom, s.rotation);
    s.areaX = a.percentages.x; s.areaY = a.percentages.y; s.areaWidth = a.percentages.width; s.areaHeight = a.percentages.height;
    s.pixelX = a.pixels.x; s.pixelY = a.pixels.y; s.pixelWidth = a.pixels.width; s.pixelHeight = a.pixels.height;
    emit('cropareachange', { area: a.percentages, pixels: a.pixels });
  });
}
function computeSizes() {
  var m = getMedia();
  if (!mediaReady(m)) return;
  var r = el.getBoundingClientRect();
  var nw = isVideo(m) ? m.videoWidth : m.naturalWidth, nh = isVideo(m) ? m.videoHeight : m.naturalHeight;
  if (!(r.width > 0 && r.height > 0 && nw > 0 && nh > 0)) return;
  var ca = r.width / r.height, ma = nw / nh, fit = s.objectFit, rendered;
  if (m.offsetWidth < nw || m.offsetHeight < nh) {
    if (fit === 'horizontal-cover') rendered = { width: r.width, height: r.width / ma };
    else if (fit === 'vertical-cover') rendered = { width: r.height * ma, height: r.height };
    else if (fit === 'cover') rendered = ca < ma ? { width: r.width, height: r.width / ma } : { width: r.height * ma, height: r.height };
    else rendered = ca > ma ? { width: r.height * ma, height: r.height } : { width: r.width, height: r.width / ma };
  } else {
    rendered = { width: m.offsetWidth, height: m.offsetHeight };
  }
  var ms = { width: rendered.width, height: rendered.height, naturalWidth: nw, naturalHeight: nh };
  s.mediaWidth = ms.width; s.mediaHeight = ms.height; s.naturalWidth = nw; s.naturalHeight = nh;
  emit('medialoaded', ms);
  var cs = getCropSize(ms.width, ms.height, r.width, r.height, s.aspectRatio, s.rotation);
  s.cropWidth = cs.width; s.cropHeight = cs.height;
  emit('cropsizechange', cs);
  scheduleClamp();
  scheduleArea();
}
function scheduleCompute() {
  if (rafCompute) return;
  rafCompute = requestAnimationFrame(function () { rafCompute = 0; computeSizes(); });
}
function setDragging(v) {
  if (s.dragging === v) return;
  s.dragging = v;
  if (v) { emit('interactionstart', {}); return; }
  emit('interactionend', {});
  var ms = getMediaSize(), cs = getCropArea();
  if (!ms || !cs) return;
  var a = getCroppedArea({ x: s.cropX, y: s.cropY }, ms, cs, s.aspectRatio, s.zoom, s.rotation);
  emit('cropcomplete', { area: a.percentages, pixels: a.pixels });
}
function zoomTo(newZoom, point, updatePosition) {
  var ms = getMediaSize(), cs = getCropArea();
  if (!ms || !cs) return;
  var z = clamp(newZoom, s.minZoom, s.maxZoom);
  if (updatePosition) {
    var rect = el.getBoundingClientRect();
    var zp = { x: rect.width / 2 - (point.x - rect.left), y: rect.height / 2 - (point.y - rect.top) };
    var zt = { x: (zp.x + s.cropX) / s.zoom, y: (zp.y + s.cropY) / s.zoom };
    setCrop(limit({ x: zt.x * z - zp.x, y: zt.y * z - zp.y }, ms, cs, z));
  }
  s.zoom = z;
  scheduleClamp();
}
function dragBegin(p) {
  dragStart = { x: p.x, y: p.y };
  dragCrop = { x: s.cropX, y: s.cropY };
  setDragging(true);
}
function drag(p) {
  if (rafDrag) cancelAnimationFrame(rafDrag);
  rafDrag = requestAnimationFrame(function () {
    var ms = getMediaSize(), cs = getCropArea();
    if (!ms || !cs) return;
    var ox = p.x - dragStart.x, oy = p.y - dragStart.y;
    if (Math.abs(ox) < 2 && Math.abs(oy) < 2) return;
    var n = limit({ x: dragCrop.x + ox, y: dragCrop.y + oy }, ms, cs, s.zoom);
    if (Math.abs(n.x - s.cropX) > 1 || Math.abs(n.y - s.cropY) > 1) setCrop(n);
  });
}
function cleanupRefs() {
  if (rafDrag) { cancelAnimationFrame(rafDrag); rafDrag = 0; }
  if (rafPinch) { cancelAnimationFrame(rafPinch); rafPinch = 0; }
  if (wheelTimer) { clearTimeout(wheelTimer); wheelTimer = 0; }
  touching = false;
}
function mouseMove(e) { drag({ x: e.clientX, y: e.clientY }); }
function touchPoint(t) { return { x: t.clientX, y: t.clientY }; }
function touchMove(e) {
  e.preventDefault();
  if (e.touches.length === 2) {
    var a = touchPoint(e.touches[0]), b = touchPoint(e.touches[1]), c = middle(a, b);
    drag(c);
    if (rafPinch) cancelAnimationFrame(rafPinch);
    rafPinch = requestAnimationFrame(function () {
      var d = distance(a, b), ratio = d / pinchDistance;
      if (Math.abs(ratio - 1) > 0.01) { zoomTo(s.zoom * ratio, c, false); pinchDistance = d; }
      var ang = angleOf(a, b), diff = ang - pinchRotation;
      if (Math.abs(diff) > 0.5) { s.rotation = s.rotation + diff; pinchRotation = ang; }
    });
  } else if (e.touches.length === 1) {
    drag(touchPoint(e.touches[0]));
  }
}
function gestureChange(e) {
  e.preventDefault();
  if (touching) return;
  zoomTo(gestureZoom - 1 + e.scale, { x: e.clientX, y: e.clientY }, true);
  s.rotation = gestureRotation + e.rotation;
}
function gestureEnd() {
  document.removeEventListener('gesturechange', gestureChange);
  document.removeEventListener('gestureend', gestureEnd);
}
function gestureStart(e) {
  e.preventDefault();
  document.addEventListener('gesturechange', gestureChange);
  document.addEventListener('gestureend', gestureEnd);
  gestureZoom = s.zoom;
  gestureRotation = s.rotation;
}
function dragStop() {
  touching = false;
  setDragging(false);
  cleanupRefs();
  document.removeEventListener('mouseup', dragStop);
  document.removeEventListener('touchend', dragStop);
  document.removeEventListener('mousemove', mouseMove);
  document.removeEventListener('touchmove', touchMove);
  gestureEnd();
}
function mouseDown(e) {
  if (e.defaultPrevented) return;
  e.preventDefault();
  document.addEventListener('mousemove', mouseMove);
  document.addEventListener('mouseup', dragStop);
  dragBegin({ x: e.clientX, y: e.clientY });
}
function touchStart(e) {
  if (e.defaultPrevented) return;
  touching = true;
  document.addEventListener('touchmove', touchMove, { passive: false });
  document.addEventListener('touchend', dragStop);
  if (e.touches.length === 2) {
    var a = touchPoint(e.touches[0]), b = touchPoint(e.touches[1]);
    pinchDistance = distance(a, b);
    pinchRotation = angleOf(a, b);
    dragBegin(middle(a, b));
  } else if (e.touches.length === 1) {
    dragBegin(touchPoint(e.touches[0]));
  }
}
function wheel(e) {
  if (s.preventScrollZoom) return;
  emit('wheelzoom', { event: e });
  if (e.defaultPrevented) return;
  e.preventDefault();
  var dy = e.deltaY;
  if (e.deltaMode === 1) dy *= 16; else if (e.deltaMode === 2) dy *= 400;
  zoomTo(s.zoom - (dy * s.zoomSpeed) / 200, { x: e.clientX, y: e.clientY }, true);
  setDragging(true);
  if (wheelTimer) clearTimeout(wheelTimer);
  wheelTimer = setTimeout(function () { wheelTimer = 0; setDragging(false); }, 250);
}
function keyDown(e) {
  if (e.defaultPrevented) return;
  var ms = getMediaSize(), cs = getCropArea();
  if (!ms || !cs) return;
  var step = s.keyboardStep;
  if (e.shiftKey) step *= 0.2;
  var x = s.cropX, y = s.cropY;
  if (e.key === 'ArrowUp') y -= step;
  else if (e.key === 'ArrowDown') y += step;
  else if (e.key === 'ArrowLeft') x -= step;
  else if (e.key === 'ArrowRight') x += step;
  else return;
  e.preventDefault();
  if (!e.repeat) setDragging(true);
  setCrop(limit({ x: x, y: y }, ms, cs, s.zoom));
}
function keyUp(e) {
  if (e.defaultPrevented) return;
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault();
    setDragging(false);
  }
}
function mediaLoaded(e) {
  if (e.target === getMedia()) computeSizes();
}
function sync() {
  var zoomChanged = s.zoom !== lastZoom, rotationChanged = s.rotation !== lastRotation;
  var layoutChanged = rotationChanged || s.aspectRatio !== lastAspect || s.objectFit !== lastFit;
  lastZoom = s.zoom; lastRotation = s.rotation; lastAspect = s.aspectRatio; lastFit = s.objectFit;
  if (layoutChanged) scheduleCompute();
  if (zoomChanged || rotationChanged) scheduleClamp();
  scheduleArea();
}
el.addEventListener('mousedown', mouseDown);
el.addEventListener('touchstart', touchStart, { passive: true });
el.addEventListener('keydown', keyDown);
el.addEventListener('keyup', keyUp);
el.addEventListener('wheel', wheel, { passive: false });
el.addEventListener('gesturestart', gestureStart);
el.addEventListener('load', mediaLoaded, true);
el.addEventListener('loadedmetadata', mediaLoaded, true);
if (typeof ResizeObserver !== 'undefined') {
  var firstResize = true;
  new ResizeObserver(function () {
    if (firstResize) { firstResize = false; return; }
    if (typeof requestIdleCallback !== 'undefined') requestIdleCallback(computeSizes); else setTimeout(computeSizes, 16);
  }).observe(el);
}
computeSizes();
return { sync: sync };
`
  .replace(/^[ \t]+/gm, "")
  .trim();

/** Laufzeit-Text (für Tests und Diagnose) */
export const CROPPER_RUNTIME = RUNTIME;

/**
 * data-init des inneren Elements: startet die Laufzeit genau einmal.
 * `Function(...)` nutzt Datastar selbst für alle Expressions (gleiche CSP-Voraussetzung).
 */
export function buildCropperInitHandler(cropperId: string): string {
  const s = cropperSignals(cropperId);

  return `el.__cropper || (el.__cropper = Function('el', 's', ${JSON.stringify(CROPPER_RUNTIME)})(el, $${s.id}))`;
}

/**
 * data-effect des inneren Elements: reagiert auf Änderungen der Signale.
 * Die Signale werden hier gelesen, damit Datastar die Abhängigkeiten kennt.
 */
export function buildCropperEffectHandler(cropperId: string): string {
  const s = cropperSignals(cropperId);
  const deps = [
    "zoom",
    "rotation",
    "cropX",
    "cropY",
    "aspectRatio",
    "objectFit",
    "mediaWidth",
    "mediaHeight",
    "naturalWidth",
    "naturalHeight",
    "cropWidth",
    "cropHeight",
  ] as const;

  return `el.__cropper && el.__cropper.sync(${deps.map((dep) => s.signal(dep)).join(", ")})`;
}

/** data-style:transform des Mediums (optional auf Gerätepixel gerundet) */
export function buildMediaTransformExpression(cropperId: string, snapPixels: boolean): string {
  const s = cropperSignals(cropperId);
  const x = s.signal("cropX");
  const y = s.signal("cropY");
  const snap = (value: string): string => `Math.round(${value} * (window.devicePixelRatio || 1)) / (window.devicePixelRatio || 1)`;
  const tx = snapPixels ? snap(x) : x;
  const ty = snapPixels ? snap(y) : y;

  return `'translate(' + (${tx}) + 'px, ' + (${ty}) + 'px) rotate(' + ${s.signal("rotation")} + 'deg) scale(' + ${s.signal("zoom")} + ')'`;
}

/** data-style:width bzw. data-style:height des Zuschnittbereichs */
export function buildAreaSizeExpression(cropperId: string, dimension: "width" | "height", snapPixels: boolean): string {
  const s = cropperSignals(cropperId);
  const ref = s.signal(dimension === "width" ? "cropWidth" : "cropHeight");

  return snapPixels ? `Math.round(${ref}) + 'px'` : `${ref} + 'px'`;
}

/** data-show des Zuschnittbereichs: erst sichtbar, wenn die Größe bekannt ist (Vorlage: return null) */
export function buildAreaShowExpression(cropperId: string): string {
  return `${cropperSignals(cropperId).signal("cropWidth")} > 0`;
}

/**
 * data-class des Mediums: übernimmt `objectFit` aus dem Cropper, solange das Medium keinen eigenen Wert hat.
 * Die Klassen kommen als Parameter (die expressions-Datei importiert nichts aus Cropper.ts).
 */
export function buildMediaDataClass(
  cropperId: string,
  classes: { contain: string; horizontal: string; vertical: string }
): string {
  const s = cropperSignals(cropperId);
  const fit = s.signal("objectFit");

  return s.dataClass({
    [classes.contain]: `${fit} === 'contain'`,
    [classes.horizontal]: `${fit} === 'cover' || ${fit} === 'horizontal-cover'`,
    [classes.vertical]: `${fit} === 'vertical-cover'`,
  });
}

/** data-class des Zuschnittbereichs: übernimmt `shape` und `withGrid` aus dem Cropper, wo kein eigener Wert gesetzt ist */
export function buildAreaDataClass(
  cropperId: string,
  options: { circleClass?: string; gridClass?: string }
): string {
  const s = cropperSignals(cropperId);
  const conditions: Record<string, string> = {};

  if (options.circleClass) conditions[options.circleClass] = s.equals("shape", "circle");
  if (options.gridClass) conditions[options.gridClass] = s.signal("withGrid");

  return s.dataClass(conditions);
}
