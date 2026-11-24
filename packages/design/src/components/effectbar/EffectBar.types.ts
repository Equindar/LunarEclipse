export type EffectKind = 'buff' | 'debuff';

export interface EffectItem {
  id: string;
  title: string;
  description: string;
  kind: EffectKind;
  /** Name des Effekttyps, z. B. "Gift", "Segen" */
  typeLabel: string;
  /** Name des SVG-Icons im zentralen Icon-Ordner */
  icon: string;
  /** Stack-Anzahl, Badge erscheint ab 2 */
  stacks?: number;
  /** Ablaufzeitpunkt in ms seit Epoch, ohne Wert gilt der Effekt als dauerhaft */
  expiresAt?: number;
}

export interface EffectBarArgs {
  id?: string;
  effects: EffectItem[];
  /** Anzahl sichtbarer Effekt-Kacheln vor der Fallback-Kachel, Default 5 */
  maxVisible?: number;
  class?: string;
}
