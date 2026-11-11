import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import { Label } from "../label";
import {
    applyFieldStateAttribute,
    buildFieldDataAttributes,
    buildFieldSlotAttributes,
    collectFieldErrorMessages,
    DEFAULT_FIELD_LEGEND_VARIANT,
    DEFAULT_FIELD_ORIENTATION,
    resolveFieldSlot,
} from "./Field.expressions";
import type {
    FieldArgs,
    FieldContentArgs,
    FieldDescriptionArgs,
    FieldErrorArgs,
    FieldGroupArgs,
    FieldLabelArgs,
    FieldLegendArgs,
    FieldOrientation,
    FieldPartArgs,
    FieldSeparatorArgs,
    FieldSetArgs,
    FieldTitleArgs,
} from "./Field.types";

const fieldSetTw = tw`flex flex-col gap-6 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3`;
const fieldLegendTw = tw`mb-3 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base`;
const fieldGroupTw = tw`group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4`;
const fieldBaseTw = tw`group/field flex w-full gap-3 data-[invalid=true]:text-destructive`;

const fieldOrientationTw: Record<FieldOrientation, string> = {
  vertical: tw`flex-col *:w-full [&>.sr-only]:w-auto`,
  horizontal: tw`flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px`,
  responsive: tw`flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px`,
};

const fieldContentTw = tw`group/field-content flex flex-1 flex-col gap-1 leading-snug`;
const fieldLabelTw = tw`group/field-label peer/field-label flex w-fit has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-data-checked:bg-primary/5 has-data-checked:border-primary/30 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10 gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:hover:bg-muted/50 has-[>[data-slot=field]]:has-focus-visible:border-ring has-[>[data-slot=field]]:has-focus-visible:ring-ring/50 has-[>[data-slot=field]]:has-focus-visible:ring-3 *:data-[slot=field]:p-3`;
const fieldTitleTw = tw`flex w-fit items-center gap-2 leading-snug text-sm font-medium group-data-[disabled=true]/field:opacity-50`;
const fieldDescriptionTw = tw`leading-normal font-normal group-has-data-[orientation=horizontal]/field:text-balance last:mt-0 nth-last-2:-mt-1 [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary text-muted-foreground text-left text-sm [[data-variant=legend]+&]:-mt-1.5`;
const fieldSeparatorTw = tw`relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2`;
const fieldSeparatorLineTw = tw`shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full absolute inset-0 top-1/2`;
const fieldSeparatorContentTw = tw`relative mx-auto block w-fit bg-background text-muted-foreground px-2`;
const fieldErrorTw = tw`text-destructive text-sm font-normal`;
const fieldErrorListTw = tw`ml-4 flex list-disc flex-col gap-1`;


export interface FieldVariantsArgs {
  orientation?: FieldOrientation;
  class?: string;
}

export function fieldVariants(args: FieldVariantsArgs = {}): string {
  return cn(fieldBaseTw, fieldOrientationTw[args.orientation ?? DEFAULT_FIELD_ORIENTATION], args.class);
}

/**
 * Gemeinsamer Renderer für die einfachen Teile.
 * Nutzer-Attribute werden zuerst übernommen und von den Standard-Attributen überschrieben (ausser data-slot).
 */
function renderPart(
  tag: string,
  slot: string,
  baseClass: string,
  args: FieldPartArgs,
  extra: HtmlAttributes = {},
): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...extra,
    ...buildFieldSlotAttributes(slot, args.attributes),
    class: cn(baseClass, args.class),
  };

  return `<${tag}${renderAttributes(attrs)}>${renderChildren(args.children)}</${tag}>`;
}

/** Semantisches `<fieldset>` mit Abstand zwischen den Kindern */
export function FieldSet(args: FieldSetArgs = {}): string {
  return renderPart("fieldset", "field-set", fieldSetTw, args);
}

/** `<legend>` eines FieldSets; `variant="label"` verwendet die Label-Grösse */
export function FieldLegend(args: FieldLegendArgs = {}): string {
  const variant = args.variant ?? DEFAULT_FIELD_LEGEND_VARIANT;
  return renderPart("legend", "field-legend", fieldLegendTw, args, { "data-variant": variant });
}

/** Layout-Container, der Fields stapelt; aktiviert Container-Queries für `orientation="responsive"` */
export function FieldGroup(args: FieldGroupArgs = {}): string {
  return renderPart("div", "field-group", fieldGroupTw, args);
}

/** Einzelnes Feld mit `role="group"`; `invalid` und `disabled` setzen `data-invalid="true"` bzw. `data-disabled="true"` */
export function Field(args: FieldArgs = {}): string {
  const orientation = args.orientation ?? DEFAULT_FIELD_ORIENTATION;

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildFieldDataAttributes(orientation, args.attributes),
    class: fieldVariants({ orientation, class: args.class }),
  };
  applyFieldStateAttribute(attrs, "data-invalid", args.invalid);
  applyFieldStateAttribute(attrs, "data-disabled", args.disabled);

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/** Spalte für Label und Beschreibung neben einem Steuerelement */
export function FieldContent(args: FieldContentArgs = {}): string {
  return renderPart("div", "field-content", fieldContentTw, args);
}

/**
 * Label eines Fields, gerendert über die Label-Komponente.
 * Ein `data-slot` aus `attributes` ersetzt den Standardwert "field-label".
 */
export function FieldLabel(args: FieldLabelArgs = {}): string {
  const attributes: HtmlAttributes = {
    ...args.attributes,
    "data-slot": resolveFieldSlot("field-label", args.attributes),
  };
  if (args.for) attributes.for = args.for;

  return Label({
    class: cn(fieldLabelTw, args.class),
    attributes,
    children: args.children,
  });
}

/**
 * Titel mit Label-Darstellung.
 * Die Quelle setzt hier ebenfalls `data-slot="field-label"` (damit greifen die Selektoren der Field-Ausrichtung); unverändert übernommen.
 */
export function FieldTitle(args: FieldTitleArgs = {}): string {
  return renderPart("div", "field-label", fieldTitleTw, args);
}

/** Hilfetext (`<p>`); Links darin werden unterstrichen */
export function FieldDescription(args: FieldDescriptionArgs = {}): string {
  return renderPart("p", "field-description", fieldDescriptionTw, args);
}

/** Trennlinie; mit `children` steht der Text mittig auf der Linie */
export function FieldSeparator(args: FieldSeparatorArgs = {}): string {
  const content = renderChildren(args.children);
  const hasContent = content !== "";

  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildFieldSlotAttributes("field-separator", args.attributes),
    "data-content": String(hasContent),
    class: cn(fieldSeparatorTw, args.class),
  };

  const line = `<div data-slot="separator" data-orientation="horizontal" data-horizontal role="separator" class="${escapeHtml(fieldSeparatorLineTw)}"></div>`;
  const text = hasContent
    ? `<span data-slot="field-separator-content" class="${escapeHtml(fieldSeparatorContentTw)}">${content}</span>`
    : "";

  return `<div${renderAttributes(attrs)}>${line}${text}</div>`;
}

/**
 * Fehlermeldung mit `role="alert"`.
 * Vorrang hat `children`; sonst werden `errors` ausgegeben (eine eindeutige Meldung als Text, mehrere als Liste).
 * Ohne Inhalt wird nichts gerendert (leerer String).
 */
export function FieldError(args: FieldErrorArgs = {}): string {
  let content = renderChildren(args.children);

  if (content === "") {
    const messages = collectFieldErrorMessages(args.errors);
    if (messages.length === 1) {
      content = escapeHtml(messages[0] ?? "");
    } else if (messages.length > 1) {
      const items = messages.map((message) => `<li>${escapeHtml(message)}</li>`).join("");
      content = `<ul class="${escapeHtml(fieldErrorListTw)}">${items}</ul>`;
    }
  }

  if (content === "") return "";

  return renderPart("div", "field-error", fieldErrorTw, { ...args, children: content }, { role: "alert" });
}
