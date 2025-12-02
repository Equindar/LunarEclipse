// --- Imports
import path from 'path';
import fs from 'fs';
import winston, { createLogger, transports, format } from 'winston';
import { ICombatContext } from '../demo/interfaces/CombatContext';
import { IActionContext } from '../demo/interfaces/ActionContext';
import { formatDuration } from '../demo/utils/time';
import { IRoundContext } from '../demo/interfaces/RoundContext';

const logDir = process.env.LOG_DIRECTORY || path.join(__dirname, '../../logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const myCombatCustomLevels = {
  levels: {
    round: 2,
    rule: 5,
    action: 1,
    combat: 0
  },
  colors: {
    combat: 'gray',
    action: 'white',
    round: 'green',
    rule: 'cyan'
  },
};
winston.addColors(myCombatCustomLevels.colors);


export class CombatLogger {
  private logger: winston.Logger;
  private combatCtx?: ICombatContext;

  constructor(combatCtx?: ICombatContext) {
    this.logger = createLogger({
      levels: myCombatCustomLevels.levels,
      level: "combat",
      format: format.combine(
        // format.colorize({ all: true }),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss.SSS Z',
        }),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        })
      ),
      transports: [
        new transports.Console({ level: "combat" }),
        new transports.File(
          {
            dirname: logDir,
            filename: 'combat.log',
            level: "combat"
          })
      ]
    });
    this.combatCtx = combatCtx;
  }

  /** internal: compute prefix for ms and optional round */
  private prefixForMs(ms: number | undefined, round?: IRoundContext) {
    const formatted = formatDuration(ms ?? 0);
    const roundPart = round?.roundNumber !== undefined ? ` [R${round.roundNumber}]` : "";
    return `[${formatted}]${roundPart}`;
  }

  /** Generic push into the optional combatCtx.log array and winston */
  private push(level: keyof winston.Logger["levels"], msg: string) {
    // push into persistent combat log if available
    if (this.combatCtx && Array.isArray((this.combatCtx as any).log)) {
      (this.combatCtx as any).log.push(msg);
    }
    // emit to winston
    this.logger.log(level as any, msg);
  }

  // --------- Basic helpers ---------
  public log(msg: string) {
    const ms = this.combatCtx?.time.elapsed ?? (this.combatCtx?.time.start ? (Date.now() - this.combatCtx.time.start.getTime()) : 0);
    this.push("combat" as any, `${this.prefixForMs(ms)} ${msg}`);
  }

  /** special log level for rules */
  public rule(msg: string, ruleId?: string) {
    const ms = this.combatCtx?.time.elapsed ?? 0;
    const payload = ruleId ? `[rule:${ruleId}] ${msg}` : `[rule] ${msg}`;
    this.push("rule" as any, `${this.prefixForMs(ms)} ${payload}`);
  }

  // --------- Round-scoped logging ---------
  public logRound(round: IRoundContext | undefined, msg: string) {
    const ms = this.combatCtx?.time.elapsed ?? 0;
    const prefix = this.prefixForMs(ms, round);
    this.push("round" as any, `${prefix} ${msg}`);
  }

  // --------- Action-scoped logging: uses scheduledExecutionMs if present ---------
  public logAction(ac: IActionContext | undefined, msg: string, level: keyof winston.Logger["levels"] = "action") {
    if (!ac) {
      this.log(msg);
      return;
    }
    // prefer scheduledExecutionMs when available
    const ms = (ac.scheduledTime != null) ? ac.scheduledTime : (this.combatCtx?.time.elapsed ?? 0);
    const actor = ac.actor.id ?? "unknown";
    const actionName = (ac.actor.action && (ac.actor.action.constructor?.name ?? ac.actor.action.action.type)) ?? "Action";
    const prefix = this.prefixForMs(ms, ac.ctxRound);
    const line = `${prefix} [${actor}] ${actionName} - ${msg}`;
    this.push(level as any, line);
  }

  // convenience shortcuts for actions
  public actionInfo(ac: IActionContext | undefined, msg: string) {
    this.logAction(ac, msg, "action");
  }

  public actionRule(ac: IActionContext | undefined, msg: string, ruleId?: string) {
    // log with rule-level but include action prefix
    const ms = (ac?.scheduledTime != null) ? ac!.scheduledTime : (this.combatCtx?.time.elapsed ?? 0);
    const prefix = this.prefixForMs(ms, ac?.ctxRound);
    const actor = ac?.actor.id ?? "unknown";
    const actionName = (ac?.actor.action && (ac.actor.action.constructor?.name ?? ac.actor.action.action.type)) ?? "Action";
    const line = `${prefix} [${actor}] ${actionName} - [rule${ruleId ? `:${ruleId}` : ""}] ${msg}`;
    this.push("rule" as any, line);
  }
}
