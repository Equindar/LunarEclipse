import { createSignals } from "../../utils/SignalManager";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type { LogCardSignals, LogCardStart, LogEntryTone, LogTimeMode } from "./LogCard.types";

/**
 * Datastar-Expressions und Hilfen der LogCard.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 *
 * Signal-Modell: pro Card ein Signal-Objekt $<id> (siehe LogCardSignals).
 * Der Startzeitpunkt ist kein Signal, er steht fest in den Expressions (Millisekunden seit Epoch).
 */

export const DEFAULT_RANGE_LABEL = "Zeitraum";
export const DEFAULT_TONE: LogEntryTone = "default";
export const DEFAULT_STEP_SECONDS = 10;
export const DEFAULT_TIME_MODE: LogTimeMode = "duration";
export const DEFAULT_SCROLLER_CLASS = "max-h-96";
/** Abstand zum unteren Rand (px), bis zu dem der Nutzer als "am neuesten Eintrag" gilt */
export const FOLLOW_THRESHOLD_PX = 24;

const EMPTY_SIGNALS: LogCardSignals = {
  from: 0,
  to: 0,
  max: 0,
  clock: false,
  live: false,
  follow: false,
  tail: false,
  count: 0,
};

/** Signal-Manager einer LogCard (Signal-Name = ID mit "-" zu "_"). Ohne state nur zum Bilden der Signal-Verweise */
export const logCardSignals = (id: string, state: LogCardSignals = EMPTY_SIGNALS) =>
  createSignals<LogCardSignals>(id, state);

/** Name des Signal-Objekts einer Card, z. B. "my_card" für die ID "my-card" */
export function signalKey(id: string): string {
  const reference = logCardSignals(id).signal("from");
  return reference.slice(1, reference.length - ".from".length);
}

/** Zufällige ID: log_card_<8 Hex-Zeichen> */
export function createLogCardId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `log_card_${hex}`;
}

/** data-slot und weitere Standard-Attribute je Teil der Card */
export const logCardAttributes = (slot: string): HtmlAttributes => ({ "data-slot": slot });

/** Schrittweite: positive Zahl, sonst der Standard */
export function resolveStep(step?: number): number {
  return step !== undefined && Number.isFinite(step) && step > 0 ? step : DEFAULT_STEP_SECONDS;
}

/** Rundet auf das nächste Vielfache der Schrittweite auf */
export function ceilToStep(value: number, step: number): number {
  return Math.ceil(value / step) * step;
}

/**
 * Begrenzt den Startbereich auf [min, max], rastet ihn auf die Schrittweite ein und stellt sicher, dass from <= to gilt.
 * Fehlende Werte werden durch die Grenzen ersetzt.
 */
export function clampRange(
  min: number,
  max: number,
  step: number,
  from?: number,
  to?: number
): { from: number; to: number } {
  const snap = (value: number): number => min + Math.round((value - min) / step) * step;
  const bound = (value: number, lower: number, upper: number): number => Math.min(Math.max(value, lower), upper);

  const lower = bound(snap(from ?? min), min, max);
  const upper = bound(snap(to ?? max), lower, max);
  return { from: lower, to: upper };
}

/**
 * Wandelt ein Delta "mm:ss" in Sekunden um. mm darf größer als 59 sein.
 * Wirft bei ungültigem Format.
 */
export function parseDelta(value: string): number {
  const match = /^(\d+):([0-5]\d)$/.exec(value.trim());
  if (!match) {
    throw new RangeError(`LogCard: Ungültige Zeitangabe "${value}", erwartet wird das Delta im Format "mm:ss".`);
  }
  return Number(match[1]) * 60 + Number(match[2]);
}

/**
 * Wandelt den Startzeitpunkt in Millisekunden seit Epoch um.
 * Strings brauchen eine Zeitzone (Z oder Offset), sonst würde die lokale Zeit gelten.
 * Gibt undefined zurück, wenn nichts angegeben ist; wirft bei ungültigen Werten.
 */
export function parseStartedAt(value?: LogCardStart): number | undefined {
  if (value === undefined || value === "") return undefined;

  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new RangeError(`LogCard: Ungültiger Startzeitpunkt "${value}".`);
    return value;
  }

  if (!/(Z|[+-]\d{2}:?\d{2})$/i.test(value.trim())) {
    throw new RangeError(
      `LogCard: Der Startzeitpunkt "${value}" braucht eine Zeitzone, z. B. "2026-11-24T20:15:00Z" (UTC).`
    );
  }

  const ms = Date.parse(value);
  if (Number.isNaN(ms)) throw new RangeError(`LogCard: Ungültiger Startzeitpunkt "${value}".`);
  return ms;
}

/** Dauer als "mm:ss" (mm wächst bei Bedarf über 59 hinaus) */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

/** Uhrzeit in UTC als "HH:MM:SS" */
export function formatClock(startMs: number, seconds: number): string {
  return new Date(startMs + seconds * 1000).toISOString().slice(11, 19);
}

/** Text der Bereichsanzeige: "00:20" oder "00:20 bis 04:10" (bzw. als Uhrzeit) */
export function formatRangeLabel(from: number, to: number, mode: LogTimeMode, startMs?: number): string {
  const format = (seconds: number): string =>
    mode === "clock" && startMs !== undefined ? formatClock(startMs, seconds) : formatDuration(seconds);
  return from === to ? format(from) : `${format(from)} bis ${format(to)}`;
}

/** Liegt [start, end] (für eine einzelne Zeile start = end) im gewählten Bereich? */
export function isInRange(from: number, to: number, start: number, end: number): boolean {
  return from <= end && start <= to;
}

/** Sichtbarkeit einer Zeile per data-show, z. B. $card.from <= 252 && 252 <= $card.to */
export function buildVisibleExpression(id: string, start: number, end: number): string {
  const s = logCardSignals(id);
  return `${s.signal("from")} <= ${end} && ${start} <= ${s.signal("to")}`;
}

/**
 * Handler der unteren Grenze: darf die obere nicht überschreiten.
 * Der Wert wird zusätzlich in den Input zurückgeschrieben, damit der Regler an der Grenze stehen bleibt.
 */
export function buildFromInputHandler(id: string): string {
  const s = logCardSignals(id);
  return [
    s.set("from", `Math.min(Number(el.value), ${s.signal("to")})`),
    `el.value = ${s.signal("from")}`,
  ].join("; ");
}

/**
 * Handler der oberen Grenze: darf die untere nicht unterschreiten.
 * Liegt sie danach am Maximum, bleibt sie dort und wandert mit neuen Einträgen mit (tail).
 */
export function buildToInputHandler(id: string): string {
  const s = logCardSignals(id);
  return [
    s.set("to", `Math.max(Number(el.value), ${s.signal("from")})`),
    `el.value = ${s.signal("to")}`,
    s.set("tail", `${s.signal("to")} === ${s.signal("max")}`),
  ].join("; ");
}

/**
 * Effekt auf einem Slider-Input: hält Maximum, Sperre und Wert des Inputs mit den Signalen synchron.
 * Nötig, weil sich max (neue Einträge) und to (tail) ohne Nutzereingabe ändern und ein Input,
 * der schon bedient wurde, auf geänderte Attribute nicht mehr reagiert.
 * max steht vor value, sonst würde ein größerer Wert noch am alten Maximum abgeschnitten.
 */
export function buildInputEffect(id: string, key: "from" | "to", min: number): string {
  const s = logCardSignals(id);
  return [
    `el.max = ${s.signal("max")}`,
    `el.disabled = ${s.signal("max")} <= ${min}`,
    `el.value = ${s.signal(key)}`,
  ].join("; ");
}

/** Effekt am Root: ist tail gesetzt, folgt die obere Grenze dem Maximum */
export function buildTailEffect(id: string): string {
  const s = logCardSignals(id);
  return `${s.signal("tail")} && (${s.signal("to")} = ${s.signal("max")})`;
}

/** Style des farbigen Streifens zwischen den Reglern (left/right in Prozent) */
export function buildRangeStyleExpression(id: string, min: number): string {
  const s = logCardSignals(id);
  const from = s.signal("from");
  const to = s.signal("to");
  const max = s.signal("max");
  const span = `Math.max(${max} - ${min}, 1)`;
  return `'left: ' + ((${from} - ${min}) / ${span} * 100) + '%; right: ' + ((${max} - ${to}) / ${span} * 100) + '%'`;
}

/**
 * Stapelreihenfolge des unteren Reglers: Liegen beide Regler am rechten Ende,
 * muss der untere oben liegen, sonst lässt er sich nicht mehr greifen.
 */
export function buildFromLayerExpression(id: string, min: number): string {
  const s = logCardSignals(id);
  return `${s.signal("from")} >= (${s.signal("max")} + ${min}) / 2 ? 'z-index: 30' : 'z-index: 10'`;
}

/** JS-Ausdruck für "mm:ss" aus einem Sekundenwert (identisch zu formatDuration) */
const durationExpression = (seconds: string): string =>
  `(String(Math.floor(${seconds} / 60)).padStart(2, '0') + ':' + String(${seconds} % 60).padStart(2, '0'))`;

/** JS-Ausdruck für "HH:MM:SS" in UTC aus einem Sekundenwert (identisch zu formatClock) */
const clockExpression = (startMs: number, seconds: string): string =>
  `new Date(${startMs} + ${seconds} * 1000).toISOString().slice(11, 19)`;

/**
 * Text der Bereichsanzeige, abhängig vom Signal clock:
 * "02:00 bis 04:10" oder, als Uhrzeit, "20:17:00 bis 20:19:10".
 * Ohne startMs gibt es nur Dauern.
 */
export function buildRangeLabelExpression(id: string, startMs?: number): string {
  const s = logCardSignals(id);
  const from = s.signal("from");
  const to = s.signal("to");

  const part = (seconds: string): string =>
    startMs === undefined
      ? durationExpression(seconds)
      : `(${s.signal("clock")} ? ${clockExpression(startMs, seconds)} : ${durationExpression(seconds)})`;

  return `${from} === ${to} ? ${part(from)} : ${part(from)} + ' bis ' + ${part(to)}`;
}

/** Wert für data-mode am Root: "clock" oder "duration" (steuert per Tailwind-group, welche Zeitangabe sichtbar ist) */
export function buildModeExpression(id: string): string {
  const s = logCardSignals(id);
  return `${s.signal("clock")} ? 'clock' : 'duration'`;
}

/** Wert für aria-pressed der Toggle-Buttons als String ("true" oder "false") */
export function buildPressedExpression(id: string, forClock: boolean): string {
  const s = logCardSignals(id);
  const ref = s.signal("clock");
  return forClock ? `${ref} ? 'true' : 'false'` : `${ref} ? 'false' : 'true'`;
}

/** Klick-Handler der Toggle-Buttons */
export function buildSetClockHandler(id: string, clock: boolean): string {
  return logCardSignals(id).set("clock", String(clock));
}

/**
 * data-init einer nachträglich eingefügten Zeile: hebt das Maximum des Sliders an und erhöht count.
 * Dadurch genügt dem Server ein einziger Patch (die Zeile selbst), kein zusätzlicher Signal-Patch.
 * ceilSeconds ist die Zeit der Zeile, auf die Schrittweite aufgerundet.
 */
export function buildEntryAnnounceExpression(id: string, ceilSeconds: number): string {
  const s = logCardSignals(id);
  return [
    s.set("max", `Math.max(${s.signal("max")}, ${ceilSeconds})`),
    s.set("count", `${s.signal("count")} + 1`),
  ].join("; ");
}

/** Scroll-Handler des Scrollers: follow ist true, solange der Nutzer am unteren Rand steht */
export function buildFollowHandler(id: string): string {
  const s = logCardSignals(id);
  return s.set("follow", `el.scrollHeight - el.scrollTop - el.clientHeight < ${FOLLOW_THRESHOLD_PX}`);
}

/**
 * Effekt des Scrollers: scrollt nach unten, wenn die Card live ist und folgt.
 * Läuft beim Start, bei jedem neuen Eintrag (count) und wenn follow wieder gesetzt wird.
 * requestAnimationFrame wartet, bis der neue Eintrag eingeblendet ist; sofortiges Scrollen statt "smooth",
 * damit der Scroll-Handler mitten in der Animation follow nicht auf false setzt.
 */
export function buildScrollEffect(id: string): string {
  const s = logCardSignals(id);
  return `${s.signal("count")}; ${s.signal("live")} && ${s.signal("follow")} && requestAnimationFrame(() => el.scrollTo(0, el.scrollHeight))`;
}

/** Klick-Handler des "Zum Neuesten"-Buttons: setzt follow, der Scroll-Effekt scrollt dann nach unten */
export function buildJumpToLatestHandler(id: string): string {
  return logCardSignals(id).set("follow", "true");
}

/** data-show des "Zum Neuesten"-Buttons: nur live und solange die Ansicht nicht am Ende steht */
export function buildJumpVisibleExpression(id: string): string {
  const s = logCardSignals(id);
  return `${s.signal("live")} && !${s.signal("follow")}`;
}

/** data-show des Live-Hinweises */
export function buildLiveVisibleExpression(id: string): string {
  return logCardSignals(id).signal("live");
}

/** data-show des Leer-Hinweises, solange noch kein Eintrag da ist */
export function buildEmptyVisibleExpression(id: string): string {
  const s = logCardSignals(id);
  return `${s.signal("count")} === 0`;
}

/** data-init des Roots: öffnet den SSE-Stream. openWhenHidden verhindert ein Neuverbinden (und doppelte Zeilen) beim Tab-Wechsel */
export function buildSseInitExpression(url: string): string {
  return `@get(${JSON.stringify(url)}, {openWhenHidden: true})`;
}
