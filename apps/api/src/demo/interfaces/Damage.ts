/** Basis-Typ für Zahlenwerte von Schaden */
export type DamageAmount = number;


/** Physische Schadenstypen */
export interface PhysicalDamage {
  /** normaler physischer Schaden */
  normal: DamageAmount;
  /** Schaden durch Blutung */
  bleed: DamageAmount;

  /** optionaler Convenience-Wert */
  total?: DamageAmount;
}


/** Magische Schadenstypen
 *
 * beinhaltet Feuer, Wasser, Natur sowie Licht und Schatten
*/
export interface MagicalDamage {
  /** Schaden durch Feuer-Magie */
  fire: DamageAmount;
  /** Schaden durch Wasser-Magie (Eis)*/
  ice: DamageAmount;
  /** Schaden durch Natur-Magie */
  nature: DamageAmount;
  /** Schaden durch Licht-Magie (Weiß)*/
  dark: DamageAmount;
  /** Schaden durch Schatten-Magie (Schwarz)*/
  light: DamageAmount;

  /** optionaler Convenience-Wert */
  total?: DamageAmount;
}


/** Vollständige Aufschlüsselung eines Damage-Blocks für einen Fighter */
export interface DamageBreakdown {
  physical: PhysicalDamage;
  magical: MagicalDamage;

  /** optionaler Gesamtwert (physical + magical) */
  total?: DamageAmount;

  /** Freies Feld für zusätzliche Meta-Infos (z.B. Quellen/Procs) */
  meta?: Record<string, unknown>;
}


export type DamageByFighter = Record<string, DamageBreakdown>;
