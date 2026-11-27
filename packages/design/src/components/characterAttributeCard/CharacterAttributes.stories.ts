import type { Meta, StoryObj } from "@storybook/html-vite";

import { characterAttributeDefinitions, CharacterAttributesCard, defaultCharacterValues } from "./CharacterAttributes";
import { characterSignals } from "./CharacterAttributes.expressions";
import type { CharacterAttributesCardArgs } from "./CharacterAttributes.types";

/**
 * Statt eines POST schreibt die Story die abgeschickte Skillung in einen Text unter der Card.
 * Referenziert werden nur die einzelnen Signale (`$id.strength` usw.), nie das ganze Signal-Objekt.
 */
const summaryAction = (id: string, outputId: string): string => {
  const signals = characterSignals(id, defaultCharacterValues, 0);
  const parts = characterAttributeDefinitions.map(({ key, label }) => `'${label} ' + ${signals.signal(key)}`);
  return `document.getElementById('${outputId}').textContent = 'Uebernommen: ' + ${parts.join(" + ', ' + ")}`;
};

const card = (args: CharacterAttributesCardArgs): string => {
  const id = args.id ?? "character-attributes-story";
  const outputId = `${id}-output`;
  return `${CharacterAttributesCard({
    ...args,
    id,
    submitAction: args.submitAction ?? summaryAction(id, outputId),
    attributes: { onsubmit: "return false;", ...args.attributes },
  })}<p id="${outputId}" class="max-w-md text-sm text-muted-foreground" aria-live="polite"></p>`;
};

const meta: Meta<CharacterAttributesCardArgs> = {
  title: "Components/Character/CharacterAttributes",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Beispiel-Card zur Verteilung von Attributspunkten nach einem Level-Up. Jede Zeile zeigt ein SegmentedProgress mit +1 und +5, die Card steckt in einem Formular. Attribute haben kein Maximum: Jedes Segment ist ein Punkt, die Leiste zeigt Anfang und Ende, bei hohen Werten steht dazwischen ein Ellipsis-Element. Funktioniert nur mit geladenem Datastar.",
      },
    },
  },
  argTypes: {
    pointsPerLevel: { control: { type: "number", min: 0, max: 20 } },
    headSegments: { control: { type: "number", min: 1, max: 20 } },
    tailSegments: { control: { type: "number", min: 1, max: 20 } },
    shape: { control: "select", options: ["rounded", "slanted"] },
    requireAllPoints: { control: "boolean" },
  },
  args: {
    id: "character-attributes-playground",
    pointsPerLevel: 5,
    headSegments: 5,
    tailSegments: 3,
    shape: "rounded",
    requireAllPoints: true,
    class: "w-xl"
  },
  render: (args) => `<div class="max-w-xl">${card(args)}</div>`,
};

export default meta;
type Story = StoryObj<CharacterAttributesCardArgs>;

export const Playground: Story = {};

export const Slanted: Story = {
  name: "Geneigte Segmente",
  args: { id: "character-attributes-slanted", shape: "slanted" },
};

export const ExtremeBuild: Story = {
  name: "Extreme Skillung",
  parameters: {
    docs: {
      description: {
        story:
          "Intelligenz steht auf 48, Stärke auf 5: Die Leiste zeigt die Punkte 1 bis 5, ein Ellipsis-Element für 40 ausgeblendete Punkte und die Punkte 46 bis 48. Das Ellipsis erscheint ab mehr Punkten als Segmenten (5 + 3).",
      },
    },
  },
  args: {
    id: "character-attributes-extreme",
    values: { strength: 5, dexterity: 8, vitality: 12, intelligence: 48 },
  },
};

export const PartialSubmit: Story = {
  name: "Absenden ohne alle Punkte",
  parameters: {
    docs: {
      description: {
        story: "Mit requireAllPoints = false darf abgeschickt werden, sobald mindestens ein Punkt verteilt ist.",
      },
    },
  },
  args: { id: "character-attributes-partial", requireAllPoints: false },
};
