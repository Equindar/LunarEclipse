import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { SignalManager } from "../../utils/SignalManager";
import { tw } from "../../utils/tw";
import { Label } from "../label";
import { buildSubmitHandler } from "./Form.expressions";
import type {
    FormArgs,
    FormDescriptionArgs,
    FormItemArgs,
    FormLabelArgs,
    FormMessageArgs,
} from "./Form.types";

/* Tailwind-Klassen (shadcn/ui New York v4) */
export const formItemTw = tw`grid gap-2`;
export const formLabelErrorTw = tw`data-[error=true]:text-destructive`;
export const formDescriptionTw = tw`text-muted-foreground text-sm`;
export const formMessageTw = tw`text-destructive text-sm`;

export function formItemVariants(args: Pick<FormItemArgs, "class"> = {}): string {
  return cn(formItemTw, args.class);
}

export function formLabelVariants(args: Pick<FormLabelArgs, "class" | "hasError"> = {}): string {
  return cn(args.hasError && formLabelErrorTw, args.class);
}

export function formDescriptionVariants(args: Pick<FormDescriptionArgs, "class"> = {}): string {
  return cn(formDescriptionTw, args.class);
}

export function formMessageVariants(args: Pick<FormMessageArgs, "class"> = {}): string {
  return cn(formMessageTw, args.class);
}

/* Signale mit formId auf Root-Ebene */

/**
 * SignalManager, dessen data-signals zusätzlich die formId auf Root-Ebene enthält,
 * damit das Backend erkennt, zu welchem Form die Signale gehören:
 * {"formId": "<id>", "<id>": {...}}
 */
export class FormSignalManager<T extends object> extends SignalManager<T> {
  override readonly dataSignals: string;

  constructor(formId: string, signals: T) {
    super(formId, signals);
    this.dataSignals = JSON.stringify({ formId: this.id, [this.id]: signals });
  }
}

export function signalsWithFormId<T extends object>(formId: string, signals: T): FormSignalManager<T> {
  return new FormSignalManager(formId, signals);
}

/* Komponenten */

/** Form-Wrapper; bei gesetzter action wird ein Datastar-Submit-Handler (@post) ergänzt */
export function Form(args: FormArgs = {}): string {
  // Nutzer-Attribute zuerst übernehmen, Form-spezifische überschreiben
  const attrs: HtmlAttributes = { ...args.attributes };

  if (args.id) attrs.id = args.id;

  if (args.action) {
    // data-target steuert das @post-Ziel und wird dabei aus den Attributen entfernt
    let target: string | undefined;
    if (args.attributes && Object.hasOwn(args.attributes, "data-target")) {
      target = String(args.attributes["data-target"]);
      delete attrs["data-target"];
    }

    attrs["data-on:submit"] = buildSubmitHandler(args, target);
    attrs["data-indicator-fetching"] = "";
  }

  if (args.class) attrs.class = args.class;

  return `<form${renderAttributes(attrs)}>${renderChildren(args.children)}</form>`;
}

/** Container für ein Formularfeld */
export function FormItem(args: FormItemArgs = {}): string {
  return `<div data-slot="form-item" class="${escapeHtml(formItemVariants(args))}"${renderAttributes(args.attributes)}>${renderChildren(args.children)}</div>`;
}

/** Label für ein Formularfeld (setzt data-error="true" bei hasError) */
export function FormLabel(args: FormLabelArgs = {}): string {
  return Label({
    class: formLabelVariants(args),
    for: args.for,
    attributes: {
      ...args.attributes,
      "data-slot": "form-label",
      ...(args.hasError ? { "data-error": "true" } : {}),
    },
    children: args.children,
  });
}

/** Hilfetext für ein Formularfeld */
export function FormDescription(args: FormDescriptionArgs = {}): string {
  const id = args.id ? ` id="${escapeHtml(args.id)}"` : "";

  return `<p data-slot="form-description"${id} class="${escapeHtml(formDescriptionVariants(args))}"${renderAttributes(args.attributes)}>${renderChildren(args.children)}</p>`;
}

/** Fehlermeldung für ein Formularfeld; ohne message wird nichts gerendert */
export function FormMessage(args: FormMessageArgs = {}): string {
  if (!args.message) return "";

  const id = args.id ? ` id="${escapeHtml(args.id)}"` : "";

  return `<p data-slot="form-message"${id} class="${escapeHtml(formMessageVariants(args))}"${renderAttributes(args.attributes)}>${escapeHtml(args.message)}</p>`;
}
