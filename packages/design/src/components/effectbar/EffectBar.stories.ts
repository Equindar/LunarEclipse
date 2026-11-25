import type { Meta, StoryObj } from '@storybook/html-vite';
import { EffectBar } from './EffectBar';
import type { EffectBarArgs, EffectItem } from './EffectBar.types';

const inMs = (s: number) => Date.now() + s * 1000;

const sample: EffectItem[] = [
  { id: 'regen', title: 'Regeneration', description: 'Stellt jede Runde Leben wieder her.',
    kind: 'buff', typeLabel: 'Segen', icon: 'heart', expiresAt: inMs(95) },
  { id: 'poison', title: 'Gift', description: 'Verursacht Schaden über Zeit.',
    kind: 'debuff', typeLabel: 'Gift', icon: 'beef', stacks: 3, expiresAt: inMs(40) },
  { id: 'haste', title: 'Eile', description: 'Erhöht die Aktionspunkte.',
    kind: 'buff', typeLabel: 'Segen', icon: 'bookmark', expiresAt: inMs(3700) },
  { id: 'curse', title: 'Fluch', description: 'Senkt alle Werte.',
    kind: 'debuff', typeLabel: 'Magie', icon: "backpack" },
  { id: 'shield', title: 'Schutzschild', description: 'Absorbiert Schaden.',
    kind: 'buff', typeLabel: 'Schutz', icon: 'heart-off', stacks: 2, expiresAt: inMs(300) },
  { id: 'bleed', title: 'Blutung', description: 'Schaden bei Bewegung.',
    kind: 'debuff', typeLabel: 'Physisch', icon: "compass", expiresAt: inMs(20) },
  { id: 'slow', title: 'Verlangsamung', description: 'Senkt die Bewegungsweite.',
    kind: 'debuff', typeLabel: 'Magie', icon: "heart-minus", expiresAt: inMs(60) },
];

const meta = {
  title: 'Components/EffectBar',
  render: (args) => `<div class="p-16">${EffectBar(args)}</div>`,
  args: { effects: sample.slice(0, 3) },
} satisfies Meta<EffectBarArgs>;

export default meta;
type Story = StoryObj<EffectBarArgs>;

export const Default: Story = {};
export const Full: Story = { args: { effects: sample.slice(0, 5) } };
export const WithOverflow: Story = { args: { effects: sample } };
export const Stacked: Story = { args: { effects: [sample[1]!, sample[4]!] } };
export const Permanent: Story = { args: { effects: [sample[3]!] } };
