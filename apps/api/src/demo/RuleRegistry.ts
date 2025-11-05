import { Rule } from "./interfaces/Rule";

export class RuleRegistry {
  private rules: Rule[] = [];

  register(r: Rule) {
    this.rules.push(r);
    this.rules.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  applyAll(ctx: any) {
    ctx.log = ctx.log ?? [];
    for (const r of this.rules) {
      if (r.matches(ctx)) {
        r.apply(ctx);
        if ((r as any).stopPropagation) break;
      }
    }
  }
}
