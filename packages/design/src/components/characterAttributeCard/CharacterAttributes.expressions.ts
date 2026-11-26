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

/**
 * Bedingung, ob `amount` Punkte auf das Attribut gebucht werden können:
 * genug freie Punkte und der Maximalwert wird nicht überschritten.
 */
export function buildCanAddCondition(
  signals: SignalManager<CharacterAttributeSignals>,
  key: CharacterAttributeKey,
  amount: number,
  maxValue: number
): string {
  return `${signals.signal("points")} >= ${amount} && ${signals.signal(key)} + ${amount} <= ${maxValue}`;
}

/** Click-Handler eines +N-Buttons: bucht N Punkte vom Vorrat auf das Attribut */
export function buildAddHandler(
  signals: SignalManager<CharacterAttributeSignals>,
  key: CharacterAttributeKey,
  amount: number,
  maxValue: number
): string {
  return signals.conditionalMultiAction(
    buildCanAddCondition(signals, key, amount, maxValue),
    `${signals.signal(key)} += ${amount}`,
    `${signals.signal("points")} -= ${amount}`
  );
}

/** Wert für `data-attr:disabled` eines +N-Buttons */
export function buildAddDisabled(
  signals: SignalManager<CharacterAttributeSignals>,
  key: CharacterAttributeKey,
  amount: number,
  maxValue: number
): string {
  return `!(${buildCanAddCondition(signals, key, amount, maxValue)})`;
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
