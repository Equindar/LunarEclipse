import { buildConditional } from "../../utils/buildConditional";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type { ToastType } from "./Toast.types";

/**
 * Datastar-Expressions und Bausteine des Toasts.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 *
 * Die Vorlage (Base UI Toast) hält Zustand, Stapelung und Swipe im React-Manager.
 * Im Port lebt der Zustand pro Toast im DOM (data-state), weil Toasts dynamisch
 * eingefügt und wieder entfernt werden; Signale pro Toast würden den Signal-Store
 * mit verwaisten Einträgen füllen.
 *
 * Alle Expressions kommen ohne Semikolons aus (Komma-Operator), damit sie unabhängig
 * davon funktionieren, wie Datastar Statements trennt.
 */

export const DEFAULT_TOASTER_ID = "toaster";

/** Standarddauer bis zum automatischen Schließen (wie Base UI) */
export const DEFAULT_TOAST_TIMEOUT_MS = 5000;

/** Dauer der Austrittsanimation; muss zu duration-500 in toastTw passen */
export const TOAST_EXIT_MS = 500;

const TOAST_SELECTOR = `[data-slot="toast"]`;

/** Effektive Dauer: explizite Angabe, sonst 0 für "loading" und 5000 für alle anderen */
export function resolveToastTimeout(type?: ToastType, timeout?: number): number {
  if (timeout !== undefined) return Math.max(0, timeout);
  return type === "loading" ? 0 : DEFAULT_TOAST_TIMEOUT_MS;
}

/** Rolle für Screenreader: Fehler werden sofort angesagt, alles andere höflich */
export function toastRole(type?: ToastType): "alert" | "status" {
  return type === "error" ? "alert" : "status";
}

/** data-slot, data-state und (falls gesetzt) data-type des Toasts */
export function buildToastDataAttributes(type?: ToastType): HtmlAttributes {
  const attrs: HtmlAttributes = { "data-slot": "toast", "data-state": "open" };
  if (type) attrs["data-type"] = type;
  return attrs;
}

/** Austrittsanimation starten und das Element danach entfernen (t: JS-Variable mit dem Toast) */
const closeSteps = (t: string): string =>
  `${t}.dataset.state = 'closed', setTimeout(() => ${t}.remove(), ${TOAST_EXIT_MS})`;

/**
 * Schließt den Toast, in dem das Element mit dem Handler liegt (Wurzel, Aktion oder Schließen-Button).
 * Entspricht toast.close(id) aus der Vorlage.
 */
export function buildCloseToastHandler(): string {
  return `((t) => (clearTimeout(t._toastTimer), ${closeSteps("t")}))(el.closest('${TOAST_SELECTOR}'))`;
}

/** Startet (oder erneuert) den Auto-Dismiss-Timer; el muss die Toast-Wurzel sein */
export function buildStartTimerHandler(timeoutMs: number): string {
  return `((t) => (clearTimeout(t._toastTimer), t._toastTimer = setTimeout(() => (${closeSteps("t")}), ${timeoutMs})))(el)`;
}

/** Pausiert den Auto-Dismiss-Timer (Hover und Fokus); el muss die Toast-Wurzel sein */
export function buildPauseTimerHandler(): string {
  return "clearTimeout(el._toastTimer)";
}

/**
 * Verhalten der Toast-Wurzel: Escape schließt den fokussierten Toast, bei timeout > 0
 * läuft der Timer ab dem Einfügen und pausiert bei Hover und Fokus.
 */
export function buildToastBehaviorAttributes(timeoutMs: number): HtmlAttributes {
  const attrs: HtmlAttributes = {
    "data-on:keydown": buildConditional("evt.key === 'Escape'", buildCloseToastHandler(), "null"),
  };

  if (timeoutMs > 0) {
    const start = buildStartTimerHandler(timeoutMs);
    const pause = buildPauseTimerHandler();

    attrs["data-init"] = start;
    attrs["data-on:mouseenter"] = pause;
    attrs["data-on:mouseleave"] = start;
    attrs["data-on:focusin"] = pause;
    attrs["data-on:focusout"] = start;
  }

  return attrs;
}

/**
 * JS-String-Literal für HTML in einer Expression. Semikolons (z. B. in &quot;) werden als
 * \u003b geschrieben, damit kein rohes ";" im Attributwert steht.
 */
const jsString = (value: string): string => JSON.stringify(value).replace(/;/g, "\\u003b");

/**
 * Fügt einen Toast am Ende des Containers ein (entspricht toast.add).
 * Datastar verarbeitet die data-*-Attribute des neuen Elements über seinen MutationObserver.
 * toastHtml ist die fertige Ausgabe von Toast().
 */
export function buildAddToastHandler(toasterId: string, toastHtml: string): string {
  return `document.getElementById(${jsString(toasterId)}).insertAdjacentHTML('beforeend', ${jsString(toastHtml)})`;
}

/**
 * Fügt den Loading-Toast ein und ersetzt ihn, sobald das Promise erfüllt oder abgelehnt ist
 * (entspricht toast.promise). promise ist eine JS-Expression, die ein Promise liefert.
 */
export function buildPromiseToastHandler(
  toasterId: string,
  promise: string,
  loadingHtml: string,
  successHtml: string,
  errorHtml: string
): string {
  const replace = (html: string): string => `() => n.outerHTML = ${jsString(html)}`;

  return (
    `((box) => (box.insertAdjacentHTML('beforeend', ${jsString(loadingHtml)}), ` +
    `((n) => Promise.resolve(${promise}).then(${replace(successHtml)}, ${replace(errorHtml)}))(box.lastElementChild)))` +
    `(document.getElementById(${jsString(toasterId)}))`
  );
}

/**
 * Icons aus lucide (24x24, stroke): CircleCheck, Info, TriangleAlert, OctagonX, Loader2 und X.
 * Vorläufig hier abgelegt; gehören langfristig in den zentralen Icon-Ordner des Design-Packages.
 */
export const toastIconPaths: Record<ToastType, string> = {
  success: `<circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path>`,
  info: `<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>`,
  warning: `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>`,
  error: `<path d="m15 9-6 6"></path><path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z"></path><path d="m9 9 6 6"></path>`,
  loading: `<path d="M21 12a9 9 0 1 1-6.219-8.56"></path>`,
};

export const closeIconPaths = `<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>`;

/** SVG-Hülle für die Icon-Pfade (aria-hidden, Größe über die Klassen des Wrappers) */
export function buildToastSvg(paths: string, extraClass = ""): string {
  const className = extraClass ? ` class="${extraClass}"` : "";

  return `<svg${className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}
