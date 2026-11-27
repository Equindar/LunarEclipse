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

/**
 * Click-Handler des -1-Buttons: nimmt einen neu verteilten Punkt zurück und gibt ihn dem Budget zurück.
 * Punkte, die vor diesem Level-Up verteilt waren (`baseValue`), lassen sich nicht abziehen.
 */
export function buildRemoveHandler(
  signals: SignalManager<CharacterAttributeSignals>,
  key: CharacterAttributeKey,
  baseValue: number
): string {
  return signals.conditionalMultiAction(
    `${signals.signal(key)} > ${baseValue}`,
    `${signals.signal(key)} -= 1`,
    `${signals.signal("points")} += 1`
  );
}

/** Wert für `data-attr:disabled` des -1-Buttons: gesperrt, solange nichts neu verteilt wurde */
export function buildRemoveDisabled(
  signals: SignalManager<CharacterAttributeSignals>,
  key: CharacterAttributeKey,
  baseValue: number
): string {
  return `${signals.signal(key)} <= ${baseValue}`;
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
