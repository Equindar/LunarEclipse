import { Badge } from '../../ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../ui/hovercard';
import { Icon } from '../../ui/icon';
import { cn } from '../../utils/cn';
import { escapeHtml } from '../../utils/escapeHtml';
import { renderIcon } from '../../utils/renderIcon';
import { nowSignals, nowTick, remainingTextExpr } from './EffectBar.expressions';
import type { EffectBarArgs, EffectItem, EffectKind } from './EffectBar.types';

const DEFAULT_MAX_VISIBLE = 5;

const effectTw = {
  bar: 'flex items-center gap-1.5',
  tile:
    'relative flex size-9 items-center justify-center rounded-md border-2 bg-card ' +
    'text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring',
  overflow: 'border-dashed border-border text-xs font-medium tabular-nums text-muted-foreground',
  stacks:
    'absolute -right-1.5 -top-1.5 min-w-4 justify-center rounded-full px-1 ' +
    'text-[10px] leading-4 tabular-nums',

  card: 'flex w-64 flex-col gap-3',
  cardHead: 'flex items-center gap-3',
  cardIcon: 'flex size-10 shrink-0 items-center justify-center rounded-md border-2 bg-card',
  cardHeadText: 'flex min-w-0 flex-col items-start gap-1.5',
  cardTitle: 'text-sm font-medium leading-none',
  cardText: 'text-sm text-muted-foreground',
  cardFoot: 'flex items-center justify-between border-t pt-2 text-xs text-muted-foreground',
  cardTime: 'font-medium tabular-nums text-foreground',

  list: 'flex w-60 flex-col gap-2',
  listHead: 'text-xs font-medium text-muted-foreground',
  row: 'flex items-center gap-2 text-sm',
  rowIcon: 'size-4 shrink-0',
  rowTitle: 'min-w-0 flex-1 truncate',
  rowTime: 'text-xs tabular-nums text-muted-foreground',
} as const;

const kindTw: Record<EffectKind, { border: string; text: string }> = {
  buff: { border: 'border-green-500', text: 'text-green-500' },
  debuff: { border: 'border-red-500', text: 'text-red-500' },
};

/** Reine Aufteilung in sichtbare und versteckte Effekte. */
export const splitEffects = (
  effects: EffectItem[],
  maxVisible: number,
): { visible: EffectItem[]; hidden: EffectItem[] } => ({
  visible: effects.slice(0, maxVisible),
  hidden: effects.slice(maxVisible),
});

const timeSpan = (effect: EffectItem, className: string): string =>
  effect.expiresAt
    ? `<span class="${className}" data-text="${remainingTextExpr(effect.expiresAt)}"></span>`
    : `<span class="${className}">Dauerhaft</span>`;

const hoverCard = (trigger: string, content: string): string =>
  HoverCard({
    id: `hoverCard-id_`,
    children: [
      HoverCardTrigger({
        id: `hoverCardTrigger-id_`,
        delay: 150,
        closeDelay: 100,
        children: trigger }),
      HoverCardContent({
        id: `hoverCardContentTrigger-id_`,
        side: "top",
        align: "start",
        children: content }),
    ].join(''),
  });

const effectCardContent = (effect: EffectItem): string => `
  <div class="${effectTw.card}">
    <div class="${effectTw.cardHead}">
      <div class="${cn(effectTw.cardIcon, kindTw[effect.kind].border)}">
        ${Icon({ name: effect.icon, class: 'size-5' })}
      </div>
      <div class="${effectTw.cardHeadText}">
        <span class="${effectTw.cardTitle}">${escapeHtml(effect.title)}</span>
        ${Badge({
          variant: effect.kind === 'debuff' ? 'destructive' : 'secondary',
          children: escapeHtml(effect.typeLabel),
        })}
      </div>
    </div>
    <p class="${effectTw.cardText}">${escapeHtml(effect.description)}</p>
    <div class="${effectTw.cardFoot}">
      <span>Verbleibend</span>
      ${timeSpan(effect, effectTw.cardTime)}
    </div>
  </div>`;

const overflowCardContent = (hidden: EffectItem[]): string => `
  <div class="${effectTw.list}">
    <span class="${effectTw.listHead}">Weitere Effekte</span>
    ${hidden
      .map(
        (effect) => `
      <div class="${effectTw.row}">
        ${renderIcon(effect.icon, {
          class: cn(effectTw.rowIcon, kindTw[effect.kind].text),
        })}
        <span class="${effectTw.rowTitle}">${escapeHtml(effect.title)}</span>
        ${timeSpan(effect, effectTw.rowTime)}
      </div>`,
      )
      .join('')}
  </div>`;

const effectTile = (effect: EffectItem): string => {
  const stacks = effect.stacks ?? 1;
  const trigger = `
    <button type="button"
      class="${cn(effectTw.tile, kindTw[effect.kind].border)}"
      aria-label="${escapeHtml(effect.title)}">
      ${renderIcon(effect.icon, { class: 'size-5' })}
      ${stacks > 1 ? Badge({ class: effectTw.stacks, children: String(stacks) }) : ''}
    </button>`;

  return hoverCard(trigger, effectCardContent(effect));
};

const overflowTile = (hidden: EffectItem[]): string => {
  const trigger = `
    <button type="button" class="${cn(effectTw.tile, effectTw.overflow)}"
      aria-label="${hidden.length} weitere Effekte">
      +${hidden.length}
    </button>`;

  return hoverCard(trigger, overflowCardContent(hidden));
};

export function EffectBar(args: EffectBarArgs): string {
  if (args.effects.length === 0) return '';

  const { visible, hidden } = splitEffects(
    args.effects,
    args.maxVisible ?? DEFAULT_MAX_VISIBLE,
  );

  return `
    <div ${args.id ? `id="${args.id}"` : ''}
      class="${cn(effectTw.bar, args.class)}"
      data-signals="${nowSignals}"
      data-on-interval__duration.1s="${nowTick}">
      ${visible.map(effectTile).join('')}
      ${hidden.length > 0 ? overflowTile(hidden) : ''}
    </div>`;
}
