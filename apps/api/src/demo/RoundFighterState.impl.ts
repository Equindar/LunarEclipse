import { FighterId, RoundFighterState } from "./interfaces/RoundFighterState";
import { ActionType } from "./types/ActionType";

export class RoundFighterStateImpl implements RoundFighterState {
  constructor(
    public id: FighterId,
    public hp: number,
    public energy: number,
    public nextAttackBonus: number = 0,
    public nextDefenseBonus: number = 0
  ) { }

  public applyBuff(action: ActionType): void {
    if (action === ActionType.UTILITY_ATTACK) this.nextAttackBonus += 1;
    if (action === ActionType.UTILITY_DEFEND) this.nextDefenseBonus += 1;
  }

  public resetAttackBuff(): void {
    this.nextAttackBonus = 0;
  }

  public resetDefenseBuff(): void {
    this.nextDefenseBonus = 0;
  }


  takeDamage(amount: number) {
    const n = Math.max(0, Math.floor(amount));
    this.hp -= n;
    if (this.hp < 0) this.hp = 0;
  }

  gainEnergy(amount: number) {
    const n = Math.max(0, Math.floor(amount));
    this.energy += n;
  }
}
