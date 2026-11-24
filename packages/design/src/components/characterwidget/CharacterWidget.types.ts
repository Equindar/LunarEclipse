export interface PlayerHudArgs {
  id: string;
  name: string;
  avatarSource?: string;
  level: number;
  xp: number;
  xpToNext: number;
  hp: number;
  hpMax: number;
  ap: number;
  apMax: number;
  /** Datastar-Aktionen, z. B. "@get('/ui/profile')" */
  onProfile?: string;
  onInventory?: string;
  class?: string;
}
