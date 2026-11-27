import type { SegmentedProgressShape } from "../../ui/segmentedprogress";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Die vier verteilbaren Attribute */
export type CharacterAttributeKey = "strength" | "dexterity" | "vitality" | "intelligence";

/** Aktuelle Attributswerte des Charakters */
export type CharacterAttributeValues = Record<CharacterAttributeKey, number>;

/** Form der Segmente: abgerundet oder nach rechts geneigt (wird an SegmentedProgress durchgereicht) */
export type CharacterAttributeShape = SegmentedProgressShape;

/**
 * Signal-State der Card. Die Attribute enthalten den Wert inklusive der bereits
 * verteilten, aber noch nicht abgeschickten Punkte. `points` sind die noch freien Punkte.
 * Es gibt kein Maximum pro Attribut.
 */
export interface CharacterAttributeSignals extends CharacterAttributeValues {
  points: number;
}

/** Beschreibung einer Zeile in der Card */
export interface CharacterAttributeDefinition {
  key: CharacterAttributeKey;
  label: string;
  description: string;
}

export interface CharacterAttributesCardArgs {
  /** ID der Card (Basis für die Signale). Ohne Angabe wird eine Zufalls-ID erzeugt. */
  id?: string;
  class?: string;
  /** Aktuelle (bereits übernommene) Werte, Standard: 10 / 8 / 12 / 6 */
  values?: Partial<CharacterAttributeValues>;
  /** Punkte, die pro Level-Up verteilt werden dürfen (Standard: 5) */
  pointsPerLevel?: number;
  /** Segmente am Anfang der Leiste, vor dem Ellipsis-Element (Standard: 5) */
  headSegments?: number;
  /** Segmente am Ende der Leiste, nach dem Ellipsis-Element (Standard: 3) */
  tailSegments?: number;
  /** Form der Segmente (Standard: rounded) */
  shape?: CharacterAttributeShape;
  /** Absenden erst erlauben, wenn alle Punkte verteilt sind (Standard: true) */
  requireAllPoints?: boolean;
  /** Datastar-Aktion beim Absenden (Standard: `@post('/api/character/attributes')`) */
  submitAction?: string;
  /** Attribute für das umschließende form-Element */
  attributes?: HtmlAttributes;
}
