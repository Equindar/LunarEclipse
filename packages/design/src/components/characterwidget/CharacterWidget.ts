import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Gauge } from '../../ui/gauge';
import { Icon, type IconName } from '../../ui/icon';
import { Progress } from '../../ui/progress';
import { cn } from '../../utils/cn';
import { escapeHtml } from '../../utils/escapeHtml';
import type { PlayerHudArgs } from './CharacterWidget.types';

const percent = (value: number, max: number): number =>
  max <= 0 ? 0 : Math.min(100, Math.max(0, Math.round((value / max) * 100)));

const hudTw = {
  card: 'relative w-fit overflow-visible py-0',
  content: 'flex items-center gap-4 p-3 pr-12',
  avatarWrap: 'relative size-16 shrink-0',
  gauge: 'absolute inset-0 size-full',
  avatar: 'absolute inset-1.5 size-13',
  level:
    'absolute -bottom-1 -right-1 min-w-6 justify-center rounded-full px-1.5 text-xs tabular-nums',
  bars: 'flex w-44 flex-col gap-2',
  barRow: 'flex flex-col gap-0.5',
  barLabel: 'flex justify-between text-[10px] font-medium uppercase text-muted-foreground',
  actions: 'absolute right-1.5 top-1.5 flex gap-0.5',
} as const;

const statBar = (label: string, value: number, max: number, classes: string): string => `
  <div class="${hudTw.barRow}">
    <div class="${hudTw.barLabel}">
      <span>${label}</span>
      <span class="tabular-nums">${value}/${max}</span>
    </div>
    ${Progress({
      value: percent(value, max),
      class: `h-2 ${classes}`
    })}
  </div>`;

const iconButton = (iconName: IconName, label: string, action?: string): string =>
  Button({
    variant: 'ghost',
    size: 'sm',
    attributes: {
      'aria-label': label,
      ...(action ? { 'data-on:click': action } : {}),
    },
    children: Icon({ name: iconName, label: label}),
  });

export function PlayerHud(args: PlayerHudArgs): string {
  const xpPercent = percent(args.xp, args.xpToNext);

  return Card({
    class: cn(hudTw.card, args.class),
    children: CardContent({
      class: hudTw.content,
      children: `
        <div class="${hudTw.avatarWrap}">
          ${Gauge({
            value: xpPercent,
            class: hudTw.gauge,
            attributes: { 'aria-label': `Erfahrung ${args.xp} von ${args.xpToNext}` },
          })}
          ${Avatar({
            class: hudTw.avatar,
            children: [
              args.avatarSource
                ? AvatarImage({ source: args.avatarSource, alt: args.name })
                : '',
              AvatarFallback({ children: escapeHtml(args.name.slice(0, 2).toUpperCase()) }),
            ].join(''),
          })}
          ${Badge({ class: hudTw.level, children: String(args.level) })}
        </div>

        <div class="${hudTw.bars}">
          ${statBar('Leben', args.hp, args.hpMax, 'bg-red-500')}
          ${statBar('Aktion', args.ap, args.apMax, 'bg-sky-500')}
        </div>

        <div class="${hudTw.actions}">
          ${iconButton('user', 'Profil', args.onProfile)}
          ${iconButton('backpack', 'Inventar', args.onInventory)}
        </div>`,
    }),
  });
}
