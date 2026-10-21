import { buildConditional } from "./buildConditional";

/**
 * Builder für Datastar-Expressions: mehrere Statements werden mit "; " verbunden.
 * Port von utils.DatastarExpression (DatastarUI, expressions.go).
 */
export class DatastarExpression {
  private readonly statements: string[] = [];

  /** Fügt ein Statement hinzu (leere Strings werden ignoriert) */
  statement(stmt: string): this {
    if (stmt) this.statements.push(stmt);
    return this;
  }

  /** Fügt eine Signal-Zuweisung hinzu: `$signal = value` */
  setSignal(signal: string, value: string): this {
    return this.statement(`$${signal} = ${value}`);
  }

  /** Fügt ein bedingtes Statement hinzu: `condition ? trueExpr : falseExpr` (falseExpr standardmäßig "null") */
  conditional(condition: string, trueExpr: string, falseExpr = ""): this {
    return this.statement(buildConditional(condition, trueExpr, falseExpr));
  }

  build(): string {
    return this.statements.join("; ");
  }
}

export const newExpression = (): DatastarExpression => new DatastarExpression();
