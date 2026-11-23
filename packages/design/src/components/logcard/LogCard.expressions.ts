import { createSignals } from "../../utils/SignalManager";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type { LogCardSignals, LogEntryTone } from "./LogCard.types";

/**
 * Datastar-Expressions und Hilfen der LogCard.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 *
 * Signal-Modell: pro Card ein Signal-Objekt $<id> mit { from, to }.
 * Der Slider schreibt nur diese beiden Zahlen, jede Section leitet ihre Sichtbarkeit daraus ab.
 */

export const DEFAULT_RANGE_LABEL = "Zeitraum";
export const DEFAULT_TONE: LogEntryTone = "default";

/** Signal-Manager einer LogCard (Signal-Name = ID mit "-" zu "_") */
export const logCardSignals = (id: string, from: number, to: number) =>
  createSignals<LogCardSignals>(id, { from, to });

/** Zufällige ID: log_card_<8 Hex-Zeichen> */
export function createLogCardId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `log_card_${hex}`;
}

/**
 * Begrenzt den Startbereich auf [min, max] und stellt sicher, dass from <= to gilt.
 * Fehlende Werte werden durch die Grenzen ersetzt.
 */
export function clampRange(min: number, max: number, from?: number, to?: number): { from: number; to: number } {
  const lower = Math.min(Math.max(from ?? min, min), max);
  const upper = Math.min(Math.max(to ?? max, lower), max);
  return { from: lower, to: upper };
}

/** Text der Bereichsanzeige (identisch zur Datastar-Variante in buildRangeLabelExpression) */
export function formatRangeLabel(from: number, to: number): string {
  return from === to ? `Minute ${from}` : `Minute ${from} bis ${to}`;
}

/** data-slot und weitere Standard-Attribute je Teil der Card */
export const logCardAttributes = (slot: string): HtmlAttributes => ({ "data-slot": slot });

/**
 * Sichtbarkeit einer Section: sichtbar, wenn ihre Minute im Bereich liegt.
 * Beispiel: $card.from <= 3 && 3 <= $card.to
 */
export function buildSectionVisibleExpression(id: string, minute: number): string {
  const s = logCardSignals(id, 0, 0);
  return `${s.signal("from")} <= ${minute} && ${minute} <= ${s.signal("to")}`;
}

/**
 * Handler der unteren Grenze: darf die obere nicht überschreiten.
 * Der Wert wird zusätzlich in den Input zurückgeschrieben, damit der Regler an der Grenze stehen bleibt.
 */
export function buildFromInputHandler(id: string): string {
  const s = logCardSignals(id, 0, 0);
  return [
    s.set("from", `Math.min(Number(el.value), ${s.signal("to")})`),
    `el.value = ${s.signal("from")}`,
  ].join("; ");
}

/** Handler der oberen Grenze: darf die untere nicht unterschreiten */
export function buildToInputHandler(id: string): string {
  const s = logCardSignals(id, 0, 0);
  return [
    s.set("to", `Math.max(Number(el.value), ${s.signal("from")})`),
    `el.value = ${s.signal("to")}`,
  ].join("; ");
}

/** Style des farbigen Streifens zwischen den Reglern (left/right in Prozent) */
export function buildRangeStyleExpression(id: string, min: number, max: number): string {
  const s = logCardSignals(id, 0, 0);
  const span = Math.max(max - min, 1);
  return `'left: ' + ((${s.signal("from")} - ${min}) / ${span} * 100) + '%; right: ' + ((${max} - ${s.signal("to")}) / ${span} * 100) + '%'`;
}

/**
 * Stapelreihenfolge des unteren Reglers: Liegen beide Regler am rechten Ende,
 * muss der untere oben liegen, sonst lässt er sich nicht mehr greifen.
 */
export function buildFromLayerExpression(id: string, min: number, max: number): string {
  const s = logCardSignals(id, 0, 0);
  const middle = (min + max) / 2;
  return `${s.signal("from")} >= ${middle} ? 'z-index: 30' : 'z-index: 10'`;
}

/** Text der Bereichsanzeige: "Minute 2" oder "Minute 2 bis 4" */
export function buildRangeLabelExpression(id: string): string {
  const s = logCardSignals(id, 0, 0);
  const from = s.signal("from");
  const to = s.signal("to");
  return `${from} === ${to} ? 'Minute ' + ${from} : 'Minute ' + ${from} + ' bis ' + ${to}`;
}
