import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import type { LabelArgs } from "./Label.types";

/** Tailwind-Klassen für das Label (shadcn/ui New York v4) */
export const baseClasses = tw`flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50`;

export function labelVariants(args: Pick<LabelArgs, "class"> = {}): string {
  return cn(baseClasses, args.class);
}

export function Label(args: LabelArgs = {}): string {
  // Ein data-slot aus attributes (z. B. "form-label") ersetzt den Standardwert, statt doppelt aufzutauchen
  const { "data-slot": dataSlot = "label", ...attributes } = args.attributes ?? {};
  const forAttr = args.for ? ` for="${escapeHtml(args.for)}"` : "";

  return `<label data-slot="${escapeHtml(String(dataSlot))}" class="${escapeHtml(labelVariants(args))}"${forAttr}${renderAttributes(attributes)}>${renderChildren(args.children)}</label>`;
}
