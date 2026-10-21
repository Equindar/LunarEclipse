import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import type { ButtonArgs, ButtonSize, ButtonVariant } from "./Button.types";


const baseClasses =
  tw`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive`;

const variantClasses: Record<ButtonVariant, string> = {
  default:
    tw`bg-primary text-primary-foreground shadow-xs hover:bg-primary/90`,
  destructive:
    tw`bg-danger text-white shadow-xs hover:bg-danger/90 focus-visible:ring-danger/20 dark:focus-visible:ring-danger/4`,
  outline:
    tw`border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/5`,
  secondary:
    tw`bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/8`,
  ghost:
    tw`hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/5`,
  link:
    tw`text-primary underline-offset-4 hover:underline`
};

const sizeClasses: Record<ButtonSize, string> = {
  default:
    tw`h-9 px-4 py-2 has-[>svg]:px-3`,
  sm:
    tw`h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5`,
  lg:
    tw`h-10 rounded-md px-6 has-[>svg]:px-4`,
  icon:
    tw`size-9`,
};


export function buttonVariants(
  variant: ButtonVariant | "" = "",
  size: ButtonSize | "" = "",
  className = ""
): string {
  const v: ButtonVariant = variant || "default";
  const s: ButtonSize = size || "default";

  const classes = [baseClasses, variantClasses[v], sizeClasses[s]];
  if (className) classes.push(className);

  return cn(...classes);
}



export function Button(args: ButtonArgs): string {
  // Set default values
  const buttonType = args.type || "button";

  // Generate the CSS classes using our variant system
  const classes = buttonVariants(args.variant, args.size, args.class);
  const children = renderChildren(args.children);
  const attrs = renderAttributes(args.attributes);

  if (args.asChild) {
    // AsChild is wrapper compatibility only; it does not transfer child attributes.
    const disabledAttr = args.disabled ? ' aria-disabled="true"' : "";
    return `<span class="${escapeHtml(classes)}"${disabledAttr}${attrs}>${children}</span>`;
  }

  // Default button element
  const disabledAttr = args.disabled ? " disabled" : "";

  // HTML Rendering
  return `<button type="${escapeHtml(buttonType)}" class="${escapeHtml(
    classes
  )}"${disabledAttr}${attrs}>${children}</button>`;
}
