import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { createSignals } from "../../utils/SignalManager";
import { tw } from "../../utils/tw";
import type { TextareaArgs } from "./Textarea.types";

const DEFAULT_ROWS = 4;

/** Basis-Klassen der Textarea (shadcn/ui New York v4) */
export const textareaTw = tw`placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-md bg-transparent px-3 py-2 text-base text-foreground transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`;

/** Rahmen- und Fokus-Styles (entfallen bei borderless) */
export const textareaBorderTw = tw`border-input border shadow-xs dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive`;

export function textareaVariants(args: Pick<TextareaArgs, "class" | "borderless"> = {}): string {
  return cn(textareaTw, !args.borderless && textareaBorderTw, args.class);
}

/** Wert für data-bind: Form-ID als Signal-Name (Bindestriche → Unterstriche) + Feldname */
function buildTextareaBind(formId: string, name: string): string {
  return `${createSignals(formId, {}).id}.${name}`;
}

/** Textarea. Nutzer-Attribute werden zuerst übernommen und von den Standard-Attributen überschrieben. */
export function Textarea(args: TextareaArgs = {}): string {
  const attrs: HtmlAttributes = { ...args.attributes };

  attrs["data-slot"] = "textarea";
  attrs.class = textareaVariants(args);

  if (args.placeholder) attrs.placeholder = args.placeholder;
  if (args.name) attrs.name = args.name;
  if (args.id) attrs.id = args.id;
  if (args.disabled) attrs.disabled = true;
  if (args.required) attrs.required = true;

  attrs.rows = args.rows || DEFAULT_ROWS;

  // data-bind nur mit formId und name; das Signal legt Datastar bzw. das Form an
  if (args.formId && args.name) {
    attrs["data-bind"] = buildTextareaBind(args.formId, args.name);
  }

  return `<textarea${renderAttributes(attrs)}>${escapeHtml(args.value ?? "")}</textarea>`;
}
