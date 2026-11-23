import { jsString } from "./jsString";

/**
 * Scroll-Spy-Engine als Datastar-Expression (gemeinsame Grundlage von Toc und ScrollSpy).
 *
 * Beobachtet Elemente (typischerweise Überschriften oder Abschnitte) per IntersectionObserver und schreibt
 * das Ergebnis in ein Signal. Gedacht für `data-init` an einem Element, das nach dem `data-signals` des
 * Roots initialisiert wird.
 *
 * Beobachtete Elemente: entweder feste IDs (`ids`, z. B. wenn die Navigation getrennt vom Dokument liegt)
 * oder ein Selektor relativ zum Element mit `data-init` (`selector`, z. B. Abschnitte innerhalb des Roots).
 *
 * Modi:
 * - "all" (Standard): Signal erhält ein Array mit den IDs aller Elemente im Band, in Dokumentreihenfolge.
 *   Ganz oben gilt das erste Element als aktiv, in den letzten `endOffset` Pixeln zusätzlich das letzte
 *   (abschaltbar mit `edges: false`).
 * - "topmost": Signal erhält die ID des obersten Elements im Band (ein String).
 *
 * In beiden Modi bleibt die letzte Auswahl stehen, wenn gerade kein Element im Band liegt. Geschrieben wird
 * nur, wenn sich der Wert vom aktuellen Signal unterscheidet (auch dann, wenn das Signal zwischendurch von
 * außen gesetzt wurde).
 *
 * Die erzeugte Expression ist bewusst eine einzige Zeile ohne Semikolons und ohne Statement-Blöcke
 * (nur Ausdrücke, Komma-Operator, Pfeilfunktionen mit Default-Parametern). Das hält sie unabhängig davon,
 * wie Datastar Expressions an Semikolons und Zeilenumbrüchen aufteilt.
 *
 * Aufräumen: Ein erneutes `data-init` am selben Element beendet den vorherigen Beobachter. Wird das Element
 * aus dem DOM entfernt, räumt der nächste Scroll-Event auf (Datastar bietet für `data-init` keinen Cleanup).
 */

export type ScrollSpyMode = "all" | "topmost";

export interface ScrollSpyOptions {
  /** Signal, das das Ergebnis erhält, z. B. `signals.signal("activeIds")` ergibt `$toc_abc.activeIds` */
  targetSignal: string;
  /** Feste IDs der beobachteten Elemente in Dokumentreihenfolge. Genau eines von `ids` und `selector` angeben. */
  ids?: readonly string[];
  /** CSS-Selektor der beobachteten Elemente, gesucht im Element mit `data-init`. Die Elemente brauchen eine `id`. */
  selector?: string;
  /** "all": Array aller aktiven IDs, "topmost": ID des obersten aktiven Elements (Standard: "all") */
  mode?: ScrollSpyMode;
  /** Ganz oben das erste und am Ende das letzte Element aktiv setzen (Standard: true) */
  edges?: boolean;
  /** Signal-Pfad; solange sein Wert wahr ist, wird das Signal nicht geschrieben (z. B. bei programmatischem Scrollen) */
  suppressWhile?: string;
  /** JS-Ausdruck, der unmittelbar vor jedem Schreiben läuft; `value` ist der neue Wert. Nur eigener Code, wird nicht maskiert. */
  beforeWrite?: string;
  /**
   * CSS-Selektor des Scroll-Containers. Ohne Angabe (oder wenn nichts gefunden wird)
   * wird die Seite selbst beobachtet.
   */
  scrollContainer?: string;
  /** Band, in dem ein Element als aktiv gilt (Standard: "-20px 0px -40% 0px") */
  rootMargin?: string;
  /** Schwellwert des IntersectionObservers (Standard: 0, ein Pixel im Band genügt) */
  threshold?: number | readonly number[];
  /** Abstand zum Ende des Scrollers in Pixeln, ab dem das letzte Element aktiv ist (Standard: 48) */
  endOffset?: number;
}

export const DEFAULT_SCROLL_SPY_ROOT_MARGIN = "-20px 0px -40% 0px";
export const DEFAULT_SCROLL_SPY_THRESHOLD = 0;
export const DEFAULT_SCROLL_SPY_END_OFFSET = 48;

/** Signal-Pfad wie `$toc_abc.activeIds` (wird in Code eingesetzt, deshalb streng geprüft) */
const SIGNAL_PATH = /^\$\w+(\.\w+)*$/;

/**
 * Baut die Datastar-Expression für `data-init`. Gibt einen leeren String zurück, wenn `ids` leer ist
 * (dann das Attribut weglassen). Die Expression muss vom Aufrufer mit `escapeHtml` in das Attribut gesetzt werden.
 */
export function buildScrollSpyExpression(options: ScrollSpyOptions): string {
  const { targetSignal, ids, selector, suppressWhile } = options;

  if (!SIGNAL_PATH.test(targetSignal)) {
    throw new Error(`scrollSpy: ungültiges Signal "${targetSignal}" (erwartet z. B. $toc_abc.activeIds)`);
  }

  if (suppressWhile !== undefined && !SIGNAL_PATH.test(suppressWhile)) {
    throw new Error(`scrollSpy: ungültiges Signal "${suppressWhile}" für suppressWhile`);
  }

  if ((ids === undefined) === (selector === undefined)) {
    throw new Error("scrollSpy: genau eines von ids und selector angeben");
  }

  if (ids !== undefined && ids.length === 0) return "";

  const mode = options.mode ?? "all";
  const edges = options.edges ?? true;
  const rootMargin = options.rootMargin ?? DEFAULT_SCROLL_SPY_ROOT_MARGIN;
  const threshold = options.threshold ?? DEFAULT_SCROLL_SPY_THRESHOLD;
  const endOffset = options.endOffset ?? DEFAULT_SCROLL_SPY_END_OFFSET;

  if (!Number.isFinite(endOffset)) {
    throw new Error(`scrollSpy: endOffset muss eine Zahl sein (erhalten: ${endOffset})`);
  }

  const thresholdValues = typeof threshold === "number" ? [threshold] : [...threshold];
  if (!thresholdValues.every(Number.isFinite)) {
    throw new Error("scrollSpy: threshold muss aus endlichen Zahlen bestehen");
  }
  const thresholdLiteral = typeof threshold === "number" ? String(threshold) : JSON.stringify(thresholdValues);

  const nodes =
    ids !== undefined
      ? `[${ids.map(jsString).join(", ")}].map((id) => document.getElementById(id)).filter(Boolean)`
      : `[...el.querySelectorAll(${jsString(selector ?? "")})]`;

  const root = options.scrollContainer ? `document.querySelector(${jsString(options.scrollContainer)})` : "null";

  const edgeLocals = edges
    ? `atTop = scroller.scrollTop <= 0,
        range = scroller.scrollHeight - scroller.clientHeight,
        atEnd = range > 0 && range - scroller.scrollTop <= ${Math.max(0, endOffset)},`
    : "";
  const edgeTerms = edges ? " || (atTop && id === order[0]) || (atEnd && id === order[order.length - 1])" : "";

  const value = mode === "topmost" ? "next[0]" : "next";
  const suppressed = suppressWhile ? `!${suppressWhile}` : "true";
  const write = options.beforeWrite
    ? `(${options.beforeWrite}, ${targetSignal} = value)`
    : `(${targetSignal} = value)`;

  const expression = `
    ((
      nodes = ${nodes},
      order = nodes.map((node) => node.id),
      root = ${root},
      visible = new Set(),
      scroller = root ?? document.scrollingElement ?? document.documentElement,
      source = root ?? window,
      update = () => ((
        ${edgeLocals}
        next = order.filter((id) => visible.has(id)${edgeTerms}),
        value = ${value}
      ) => next.length > 0 && ${suppressed} && JSON.stringify(${targetSignal}) !== JSON.stringify(value) && ${write})(),
      observer = new IntersectionObserver(
        (entries) => (entries.forEach((entry) => entry.isIntersecting ? visible.add(entry.target.id) : visible.delete(entry.target.id)), update()),
        { root, rootMargin: ${jsString(rootMargin)}, threshold: ${thresholdLiteral} }
      ),
      onScroll = () => el.isConnected ? update() : cleanup(),
      cleanup = () => (observer.disconnect(), source.removeEventListener("scroll", onScroll), el.__scrollSpyCleanup === cleanup && (el.__scrollSpyCleanup = null))
    ) => (
      el.__scrollSpyCleanup?.(),
      nodes.forEach((node) => observer.observe(node)),
      source.addEventListener("scroll", onScroll, { passive: true }),
      el.__scrollSpyCleanup = cleanup,
      update()
    ))()
  `;

  return expression.replace(/\s*\n\s*/g, " ").trim();
}
