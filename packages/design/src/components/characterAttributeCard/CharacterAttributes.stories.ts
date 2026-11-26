import type { Meta, StoryObj } from "@storybook/html-vite";
import { CharacterAttributesCard } from "./CharacterAttributes";
import type { CharacterAttributesCardArgs } from "./CharacterAttributes.types";

/**
 * Stories nutzen statt eines POST eine Konsolen-Ausgabe der Signale.
 * Die Signal-ID entspricht der Story-ID mit "_" statt "-".
 */
const logAction = (id: string): string => ""
  // `console.log('Skillung uebernommen', JSON.stringify($${id.replaceAll("-", "_")}))`;

const card = (args: CharacterAttributesCardArgs): string =>
  `<div class="p-8">${CharacterAttributesCard({
    ...args,
    submitAction: args.submitAction ?? logAction(args.id ?? ""),
    attributes: { onsubmit: "return false;", ...args.attributes },
  })}</div>`;

const meta: Meta<CharacterAttributesCardArgs> = {
  title: "Components/CharacterAttributes",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Beispiel-Card zur Verteilung von Attributspunkten nach einem Level-Up. Jede Zeile zeigt ein SegmentedProgress mit +1 und +5, die Card steckt in einem Formular. Funktioniert nur mit geladenem Datastar.",
      },
    },
  },
  argTypes: {
    pointsPerLevel: { control: { type: "number", min: 0, max: 20 } },
    maxValue: { control: { type: "number", min: 1, max: 30 } },
    shape: { control: "select", options: ["rounded", "slanted"] },
    requireAllPoints: { control: "boolean" },
  },
  args: {
    id: "character-attributes-playground",
    pointsPerLevel: 5,
    maxValue: 20,
    shape: "rounded",
    requireAllPoints: true,
  },
  render: (args) => card(args)
};

export default meta;
type Story = StoryObj<CharacterAttributesCardArgs>;

export const Playground: Story = {};

export const Parallelogram: Story = {
  args: { id: "character-attributes-parallelogram", shape: "slanted" },
  render: (args) => card(args)
};

export const NearLimit: Story = {
  name: "Nahe am Maximum",
  parameters: {
    docs: {
      description: {
        story: "Strength steht auf 18 von 20: +5 ist gesperrt, +1 geht noch zweimal.",
      },
    },
  },
  args: {
    id: "character-attributes-near-limit",
    values: { strength: 18, dexterity: 15, vitality: 9, intelligence: 4 },
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
