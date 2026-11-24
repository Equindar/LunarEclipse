import { Badge } from '../../ui/badge';
import { HoverCard, HoverCardTrigger } from '../../ui/hovercard';
import { Tooltip } from '../../ui/tooltip';
import { cn } from '../../utils/cn';
import { escapeHtml } from '../../utils/escapeHtml';
import { renderIcon } from '../../utils/renderIcon';
import { nowSignals, nowTick, remainingTextExpr } from './EffectBar.expressions';
import type { EffectBarArgs, EffectItem } from './EffectBar.types';

const DEFAULT_MAX_VISIBLE = 5;

const effectTw = {
  bar: 'flex items-center gap-1.5',
  tile:
    'relative flex size-9 items-center justify-center rounded-md border-2 bg-card ' +
    'text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring',
  buff: 'border-green-500',
  debuff: 'border-red-500',
  overflow: 'border-dashed border-border text-xs font-medium tabular-nums text-muted-foreground',
  stacks:
    'absolute -right-1.5 -top-1.5 min-w-4 justify-center rounded-full px-1 ' +
    'text-[10px] leading-4 tabular-nums',
  tip: 'flex max-w-56 flex-col gap-1.5 text-left',
  tipTitle: 'text-sm font-medium',
  tipText: 'text-xs text-muted-foreground',
  tipMeta: 'flex items-center justify-between gap-3 text-xs',
  tipTime: 'tabular-nums',
  tipList: 'flex flex-col gap-0.5 text-xs',
} as const;

/** Reine Aufteilung in sichtbare und versteckte Effekte. */
export const splitEffects = (
  effects: EffectItem[],
  maxVisible: number,
): { visible: EffectItem[]; hidden: EffectItem[] } => ({
  visible: effects.slice(0, maxVisible),
  hidden: effects.slice(maxVisible),
});

const effectTooltip = (effect: EffectItem): string => `
  <div class="${effectTw.tip}">
    <span class="${effectTw.tipTitle}">${escapeHtml(effect.title)}</span>
    <span class="${effectTw.tipText}">${escapeHtml(effect.description)}</span>
    <div class="${effectTw.tipMeta}">
      ${Badge({
        variant: effect.kind === 'debuff' ? 'destructive' : 'secondary',
        children: escapeHtml(effect.typeLabel),
      })}
      <span class="${effectTw.tipTime}" ${
        effect.expiresAt
          ? `data-text="${remainingTextExpr(effect.expiresAt)}"`
          : ''
      }>${effect.expiresAt ? '' : 'Dauerhaft'}</span>
    </div>
  </div>`;

const effectTile = (effect: EffectItem): string => {
  const stacks = effect.stacks ?? 1;
  const trigger = `
    <button type="button" class="${cn(
      effectTw.tile,
      effect.kind === 'debuff' ? effectTw.debuff : effectTw.buff,
    )}" aria-label="${escapeHtml(effect.title)}">
      ${renderIcon(effect.icon, { class: 'size-5' })}
      ${
        stacks > 1
          ? Badge({ class: effectTw.stacks, children: String(stacks) })
          : ''
      }
    </button>`;

  return HoverCard({
    id: `hover-card_effect${effect.id}`,
    children: [
      HoverCardTrigger({
        id: `hover-card-trigger_effect${effect.id}`,
        delay: 100,
        asChild: true,
        closeDelay: 100
        children:

      })
    ]

    side: 'top', content: effectTooltip(effect), children: trigger });
};

const overflowTile = (hidden: EffectItem[]): string => {
  const trigger = `
    <button type="button" class="${cn(effectTw.tile, effectTw.overflow)}"
      aria-label="${hidden.length} weitere Effekte">
      +${hidden.length}
    </button>`;
  const content = `
    <ul class="${effectTw.tipList}">
      ${hidden.map((e) => `<li>${escapeHtml(e.title)}</li>`).join('')}
    </ul>`;

  return Tooltip({ side: 'top', content, children: trigger });
};

export function EffectBar(args: EffectBarArgs): string {
  const { visible, hidden } = splitEffects(
    args.effects,
    args.maxVisible ?? DEFAULT_MAX_VISIBLE,
  );

  if (args.effects.length === 0) return '';

  return `
    <div ${args.id ? `id="${args.id}"` : ''}
      class="${cn(effectTw.bar, args.class)}"
      data-signals="${nowSignals}"
      data-on-interval__duration.1s="${nowTick}">
      ${visible.map(effectTile).join('')}
      ${hidden.length > 0 ? overflowTile(hidden) : ''}
    </div>`;
}
