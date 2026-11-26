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
  return `<div class="grid gap-3 p-8">${CharacterAttributesCard({
    ...args,
    id,
    submitAction: args.submitAction ?? summaryAction(id, outputId),
    attributes: { onsubmit: "return false;", ...args.attributes },
  })}<p id="${outputId}" class="max-w-md text-sm text-muted-foreground" aria-live="polite"></p></div>`;
};

const meta: Meta<CharacterAttributesCardArgs> = {
  title: "Examples/CharacterAttributes",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Beispiel-Card zur Verteilung von Attributspunkten nach einem Level-Up. Jede Zeile zeigt ein SegmentedProgress mit +1 und +5, die Card steckt in einem Formular. Attribute haben kein Maximum: Die Leiste zeigt ein Anzeigefenster, ein Ellipsis-Element markiert das offene Ende. Funktioniert nur mit geladenem Datastar.",
      },
    },
  },
  argTypes: {
    pointsPerLevel: { control: { type: "number", min: 0, max: 20 } },
    visibleSegments: { control: { type: "number", min: 1, max: 40 } },
    shape: { control: "select", options: ["rounded", "parallelogram"] },
    requireAllPoints: { control: "boolean" },
  },
  args: {
    id: "character-attributes-playground",
    pointsPerLevel: 5,
    visibleSegments: 20,
    shape: "rounded",
    requireAllPoints: true,
  },
  render: (args) => card(args),
};

export default meta;
type Story = StoryObj<CharacterAttributesCardArgs>;

export const Playground: Story = {};

export const Parallelogram: Story = {
  args: { id: "character-attributes-parallelogram", shape: "parallelogram" },
};

export const AboveVisibleRange: Story = {
  name: "Wert über dem Anzeigefenster",
  parameters: {
    docs: {
      description: {
        story:
          "Stärke steht auf 27, das Fenster zeigt 20 Segmente: Die Leiste ist voll, das Ellipsis-Element ist hervorgehoben, der genaue Wert steht daneben.",
      },
    },
  },
  args: {
    id: "character-attributes-above-range",
    values: { strength: 27, dexterity: 15, vitality: 9, intelligence: 4 },
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
