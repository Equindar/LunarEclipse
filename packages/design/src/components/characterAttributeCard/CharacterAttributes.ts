import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { SegmentedProgress } from "../../ui/segmentedprogress";
import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import type { SignalManager } from "../../utils/SignalManager";
import { tw } from "../../utils/tw";
import { withSlot } from "../../utils/withSlot";
import {
    ATTRIBUTE_STEPS,
    buildAddDisabled,
    buildAddHandler,
    buildBarValue,
    buildDeltaExpression,
    buildOverflowCondition,
    buildResetHandler,
    buildSubmitDisabled,
    characterSignals,
} from "./CharacterAttributes.expressions";
import type {
    CharacterAttributeDefinition,
    CharacterAttributeShape,
    CharacterAttributeSignals,
    CharacterAttributeValues,
    CharacterAttributesCardArgs,
} from "./CharacterAttributes.types";

const DEFAULT_POINTS_PER_LEVEL = 5;
const DEFAULT_VISIBLE_SEGMENTS = 20;
const MAX_SAFE_VALUE = 999_999;
const DEFAULT_SUBMIT_ACTION = "@post('/api/character/attributes')";

/** Standardwerte eines frischen Charakters */
export const defaultCharacterValues: CharacterAttributeValues = {
  strength: 10,
  dexterity: 8,
  vitality: 12,
  intelligence: 6,
};

/** Zeilen der Card in Anzeigereihenfolge */
export const characterAttributeDefinitions: readonly CharacterAttributeDefinition[] = [
  { key: "strength", label: "Stärke", description: "Erhöht Nahkampfschaden und Tragkraft." },
  { key: "dexterity", label: "Geschicklichkeit", description: "Verbessert Ausweichen und Initiative." },
  { key: "vitality", label: "Vitalität", description: "Erhöht Lebenspunkte und Widerstand." },
  { key: "intelligence", label: "Intelligenz", description: "Erhöht Magieschaden und Manapool." },
];

export const characterAttributeRowTw = tw`grid gap-2`;
export const characterAttributeValueTw = tw`flex shrink-0 items-baseline gap-1 text-sm tabular-nums`;
export const characterAttributeEllipsisTw = tw`shrink-0 select-none text-sm leading-none text-muted-foreground transition-colors`;

/** Zufalls-ID: character_attributes_<8 Hex-Zeichen> */
function randomId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return `character_attributes_${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
}

/** Ganzzahl im Bereich [min, max]; ungültige Werte fallen auf min zurück */
function clampInt(value: number | undefined, min: number, max: number): number {
  if (value === undefined || !Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

/**
 * Einzige Stelle, die SegmentedProgress aufruft.
 * Die Leiste zeigt `visibleSegments` Segmente und folgt dem Signal (reaktiv). Der Wert ist nach oben
 * offen: Ein Ellipsis-Element hinter der Leiste markiert das offene Ende und wird hervorgehoben,
 * sobald der Wert das Anzeigefenster übersteigt.
 */
function renderAttributeBar(args: {
  label: string;
  value: number;
  visibleSegments: number;
  shape: CharacterAttributeShape;
  barValue: string;
  valueSignal: string;
  overflow: string;
}): string {
  const attributes: HtmlAttributes = {
    "aria-label": args.label,
    "aria-valuemin": 0,
    "data-attr:aria-valuenow": args.valueSignal,
  };

  const bar = SegmentedProgress({
    value: Math.min(args.value, args.visibleSegments),
    max: args.visibleSegments,
    valueSignal: args.barValue,
    attributes,
  });

  const ellipsisAttrs: HtmlAttributes = {
    "data-slot": "segmented-progress-ellipsis",
    "aria-hidden": "true",
    class: cn(characterAttributeEllipsisTw, args.value > args.visibleSegments && "text-primary!"),
    "data-class": `{'text-primary!': ${args.overflow}}`,
  };

  return `<div class="flex min-w-0 flex-1 items-center gap-2"><div class="min-w-0 flex-1">${bar}</div><span${renderAttributes(ellipsisAttrs)}>&hellip;</span></div>`;
}

function renderAttributeRow(
  definition: CharacterAttributeDefinition,
  signals: SignalManager<CharacterAttributeSignals>,
  baseValue: number,
  visibleSegments: number,
  shape: CharacterAttributeShape
): string {
  const { key, label, description } = definition;
  const valueSignal = signals.signal(key);
  const delta = buildDeltaExpression(signals, key, baseValue);

  const buttons = ATTRIBUTE_STEPS.map((amount) =>
    Button({
      children: `+${amount}`,
      variant: "outline",
      size: "sm",
      attributes: {
        type: "button",
        "aria-label": `${label} um ${amount} erhöhen`,
        "data-on:click": buildAddHandler(signals, key, amount),
        "data-attr:disabled": buildAddDisabled(signals, amount),
      },
    })
  ).join("");

  const rowAttrs = withSlot({ "data-attribute": key, class: characterAttributeRowTw }, "character-attribute-row");

  return `<div${renderAttributes(rowAttrs)}>
  <div class="flex items-start justify-between gap-3">
    <div class="grid gap-0.5">
      <span class="text-sm font-medium">${escapeHtml(label)}</span>
      <p class="text-xs text-muted-foreground">${escapeHtml(description)}</p>
    </div>
    <div class="${characterAttributeValueTw}">
      <span data-text="${escapeHtml(valueSignal)}">${baseValue}</span>
      <span class="text-xs font-medium text-primary" data-text="'+' + (${escapeHtml(delta)})" data-show="${escapeHtml(delta)} > 0" style="display: none;"></span>
    </div>
  </div>
  <div class="flex items-center gap-3">
    ${renderAttributeBar({
      label,
      value: baseValue,
      visibleSegments,
      shape,
      barValue: buildBarValue(signals, key, visibleSegments),
      valueSignal,
      overflow: buildOverflowCondition(signals, key, visibleSegments),
    })}
    <div class="flex shrink-0 gap-1">${buttons}</div>
  </div>
</div>`;
}

/**
 * Card zur Attributsverteilung nach einem Level-Up. Jede Zeile zeigt ein SegmentedProgress mit
 * +1 und +5, die Card steckt in einem form, das die neue Skillung per Datastar abschickt.
 * Funktioniert nur mit geladenem Datastar. Der Server muss die Verteilung prüfen (nicht dem Client vertrauen).
 */
export function CharacterAttributesCard(args: CharacterAttributesCardArgs = {}): string {
  const id = args.id || randomId();
  const visibleSegments = clampInt(args.visibleSegments ?? DEFAULT_VISIBLE_SEGMENTS, 1, 100);
  const pointsPerLevel = clampInt(args.pointsPerLevel ?? DEFAULT_POINTS_PER_LEVEL, 0, 999);
  const shape = args.shape ?? "rounded";
  const requireAllPoints = args.requireAllPoints ?? true;

  const values = Object.fromEntries(
    characterAttributeDefinitions.map(({ key }) => [
      key,
      clampInt(args.values?.[key] ?? defaultCharacterValues[key], 0, MAX_SAFE_VALUE),
    ])
  ) as CharacterAttributeValues;

  const signals = characterSignals(id, values, pointsPerLevel);

  const rows = characterAttributeDefinitions
    .map((definition) => renderAttributeRow(definition, signals, values[definition.key], visibleSegments, shape))
    .join("");

  const pointsBadge = Badge({
    variant: "secondary",
    children: `<span data-text="${escapeHtml(signals.signal("points"))}">${pointsPerLevel}</span>&nbsp;Punkte frei`,
    attributes: { "aria-live": "polite" },
  });

  const header = CardHeader({
    children: [
      `<div class="flex items-start justify-between gap-3">`,
      `<div class="grid gap-1">`,
      CardTitle({ children: "Attribute verteilen" }),
      CardDescription({ children: "Verteile die Punkte dieses Level-Ups auf deine Attribute." }),
      `</div>`,
      pointsBadge,
      `</div>`,
    ],
  });

  const content = CardContent({ class: "grid gap-6", children: rows });

  const footer = CardFooter({
    class: "justify-end gap-2",
    children: [
      Button({
        children: "Zurücksetzen",
        variant: "ghost",
        attributes: {
          type: "button",
          "data-on:click": buildResetHandler(signals, characterAttributeDefinitions, values, pointsPerLevel),
        },
      }),
      Button({
        children: "Skillung übernehmen",
        attributes: {
          type: "submit",
          "data-attr:disabled": buildSubmitDisabled(signals, requireAllPoints, pointsPerLevel),
        },
      }),
    ],
  });

  const formAttrs: HtmlAttributes = {
    ...withSlot(args.attributes, "character-attributes-form"),
    id,
    "data-signals": signals.dataSignals,
    "data-on:submit": args.submitAction ?? DEFAULT_SUBMIT_ACTION,
  };

  return `<form${renderAttributes(formAttrs)}>${Card({
    class: cn("w-full max-w-md", args.class),
    children: [header, content, footer],
  })}</form>`;
}
