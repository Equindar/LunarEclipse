import logger from "../utils/apiLogger";
import { Rule, RuleContext, RulePhase } from "./interfaces/RuleContext";

export class RuleRegistry {
  private rulesByPhase: Map<RulePhase, Rule[]> = new Map();

  register(rule: Rule) {
    const arr = this.rulesByPhase.get(rule.phase) ?? [];
    arr.push(rule);
    arr.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    this.rulesByPhase.set(rule.phase, arr);
  }


  unregister(ruleId: string) {
    for (const [phase, arr] of this.rulesByPhase.entries()) {
      this.rulesByPhase.set(phase, arr.filter(r => r.name !== ruleId));
    }
  }

  applyPhase(phase: RulePhase, ctx: RuleContext) {
    const rules = this.rulesByPhase.get(phase) ?? [];
    ctx.round.log = ctx.round.log ?? [];
    for (const r of rules) {
      try {
        if (r.matches(ctx)) {
          r.apply(ctx);
          ctx.round.log.push(`rule:${r.name} applied in ${phase}`);
          if (r.stopPropagation) break;
        }
      } catch (error) {
        ctx.round.log.push(`rule:${r.name} error: ${String(error)}`);
      }
    }
  }
}
