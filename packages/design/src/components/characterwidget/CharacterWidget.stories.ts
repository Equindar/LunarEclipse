import type { Meta, StoryObj } from '@storybook/html-vite';
import { PlayerHud } from './CharacterWidget';
import type { PlayerHudArgs } from './CharacterWidget.types';

const meta = {
  title: 'Components/Widgets/CharacterWidget',
  render: (args) => `
    <div class="relative h-64 w-full">
      <div class="absolute bottom-4 left-4">${PlayerHud(args)}</div>
    </div>`,
  args: {
    name: 'Aria',
    level: 12,
    xp: 640,
    xpToNext: 1000,
    hp: 72,
    hpMax: 100,
    ap: 3,
    apMax: 5,
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<PlayerHudArgs>;

export default meta;
type Story = StoryObj<PlayerHudArgs>;

export const Playground: Story = {};
export const WithImage: Story = { args: { avatarSource: '/avatars/aria.webp' } };
export const LowHealth: Story = { args: { hp: 8, ap: 0 } };
