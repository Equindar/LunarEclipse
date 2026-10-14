import type { Children } from "../types/Children";
import { cn } from "../utils/cn";
import { escapeHtml } from "../utils/escapeHtml";
import { renderChildren } from "../utils/renderChildren";
import { type HtmlAttributes, renderAttributes } from "../utils/renderHtmlAttributes";
import { tw } from "../utils/tw";

// --- Types
export type ButtonSize = "default" | "sm" | "lg" | "icon";

export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";


/** Entspricht ButtonArgs */
export interface ButtonArgs {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * AsChild renders wrapper-styled children for compatibility only.
   * Es überträgt (wie im Original) KEINE Attribute auf ein Kind-Element,
   * sondern rendert stattdessen ein <span> mit den Button-Klassen.
   */
  asChild?: boolean;
  /** Zusätzliche CSS-Klassen */
  class?: string;
  /** Zusätzliche HTML-Attribute, z. B. Datastar-Attribute */
  attributes?: HtmlAttributes;
  /** Disabled macht den Button nicht-interaktiv */
  disabled?: boolean;
  /** Type: "button" | "submit" | "reset" */
  type?: "button" | "submit" | "reset" | "";
  /** Inhalt des Buttons (bereits fertiges HTML/Text) */
  children?: Children;
}


const baseClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive";

const variantClasses: Record<ButtonVariant, string> = {
  default: tw`bg-primary text-primary-foreground shadow-xs hover:bg-primary/90`,
  destructive:
    "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
  outline:
    "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
  secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-9 px-4 py-2 has-[>svg]:px-3",
  sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
  lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
  icon: "size-9",
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
  return `<button type="${escapeHtml(buttonType)}" class="${escapeHtml(
    classes
  )}"${disabledAttr}${attrs}>${children}</button>`;
}

// ---------------------------------------------------------------------------
// Beispiel-Nutzung mit Datastar
// ---------------------------------------------------------------------------

// Einfacher Button mit Datastar-Click-Handler:
//
// const html = Button({
//   variant: "destructive",
//   size: "lg",
//   attributes: {
//     "data-on-click": "@post('/api/delete')",
//   },
//   children: "Löschen",
// });
//
// Button mit eigenem Signal-State:
//
// const counterButton = Button({
//   attributes: {
//     "data-signals": "{count: 0}",
//     "data-on-click": "$count++",
//     "data-text": "$count",
//   },
// });
//
// LinkButton als "Button-Look" für einen Link:
//
// const link = LinkButton({
//   href: "/dashboard",
//   variant: "outline",
//   children: "Zum Dashboard",
// });
