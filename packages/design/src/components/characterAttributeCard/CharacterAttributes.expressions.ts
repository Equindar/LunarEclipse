import { createSignals, type SignalManager } from "../../utils/SignalManager";
import type {
    CharacterAttributeDefinition,
    CharacterAttributeKey,
    CharacterAttributeSignals,
    CharacterAttributeValues,
} from "./CharacterAttributes.types";

/** Schrittweiten der Buttons je Zeile */
export const ATTRIBUTE_STEPS = [1, 5] as const;

/** Signal-State der Card: Startwerte und freie Punkte */
export function characterSignals(
  id: string,
  values: CharacterAttributeValues,
  points: number
): SignalManager<CharacterAttributeSignals> {
  return createSignals<CharacterAttributeSignals>(id, { ...values, points });
}

/** Bedingung, ob `amount` Punkte gebucht werden können (es zählt nur der Vorrat, ein Maximum gibt es nicht) */
export function buildCanAddCondition(signals: SignalManager<CharacterAttributeSignals>, amount: number): string {
  return `${signals.signal("points")} >= ${amount}`;
}

/** Click-Handler eines +N-Buttons: bucht N Punkte vom Vorrat auf das Attribut */
export function buildAddHandler(
  signals: SignalManager<CharacterAttributeSignals>,
  key: CharacterAttributeKey,
  amount: number
): string {
  return signals.conditionalMultiAction(
    buildCanAddCondition(signals, amount),
    `${signals.signal(key)} += ${amount}`,
    `${signals.signal("points")} -= ${amount}`
  );
}

/** Wert für `data-attr:disabled` eines +N-Buttons */
export function buildAddDisabled(signals: SignalManager<CharacterAttributeSignals>, amount: number): string {
  return `!(${buildCanAddCondition(signals, amount)})`;
}

/** Setzt alle Attribute und die freien Punkte auf den Stand beim Rendern zurück */
export function buildResetHandler(
  signals: SignalManager<CharacterAttributeSignals>,
  definitions: readonly CharacterAttributeDefinition[],
  values: CharacterAttributeValues,
  points: number
): string {
  const actions = definitions.map((d) => signals.set(d.key, String(values[d.key])));
  actions.push(signals.set("points", String(points)));
  return actions.join("; ");
}

/** Zusatzpunkte seit dem Rendern, z. B. `$id.strength - 10` */
export function buildDeltaExpression(
  signals: SignalManager<CharacterAttributeSignals>,
  key: CharacterAttributeKey,
  baseValue: number
): string {
  return `${signals.signal(key)} - ${baseValue}`;
}

/** Wert der Leiste: auf das Anzeigefenster begrenzt, der Signalwert selbst bleibt unbegrenzt */
export function buildBarValue(
  signals: SignalManager<CharacterAttributeSignals>,
  key: CharacterAttributeKey,
  visibleSegments: number
): string {
  return `Math.min(${signals.signal(key)}, ${visibleSegments})`;
}

/** Bedingung für das hervorgehobene Ellipsis-Element: der Wert liegt über dem Anzeigefenster */
export function buildOverflowCondition(
  signals: SignalManager<CharacterAttributeSignals>,
  key: CharacterAttributeKey,
  visibleSegments: number
): string {
  return `${signals.signal(key)} > ${visibleSegments}`;
}

/** Wert für `data-attr:disabled` des Submit-Buttons */
export function buildSubmitDisabled(
  signals: SignalManager<CharacterAttributeSignals>,
  requireAllPoints: boolean,
  pointsPerLevel: number
): string {
  const points = signals.signal("points");
  // Ohne Pflicht zur vollständigen Verteilung muss mindestens ein Punkt gesetzt sein
  return requireAllPoints ? `${points} > 0` : `${points} === ${pointsPerLevel}`;
}
