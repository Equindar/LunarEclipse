import { escapeHtml } from "../../utils/escapeHtml";
import { type HtmlAttributes, renderAttributes } from "../../utils/renderHtmlAttributes";
import { safeUrl } from "../../utils/safeUrl";
import { buttonVariants } from "./Button";
import type { ButtonSize, ButtonVariant } from "./Button.types";

export interface LinkButtonArgs {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  target?: string;
  rel?: string;
  class?: string;
  attributes?: HtmlAttributes;
  children?: string;
}

export function LinkButton(args: LinkButtonArgs): string {
  const classes = buttonVariants(args.variant, args.size, args.class);
  const children = args.children ?? "";
  const attrs = renderAttributes(args.attributes);
  const targetAttr = args.target ? ` target="${escapeHtml(args.target)}"` : "";
  const relAttr = args.rel ? ` rel="${escapeHtml(args.rel)}"` : "";

  return `<a href="${escapeHtml(safeUrl(args.href))}" class="${escapeHtml(
    classes
  )}"${targetAttr}${relAttr}${attrs}>${children}</a>`;
}
