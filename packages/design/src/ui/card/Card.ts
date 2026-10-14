import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes } from "../../utils/renderHtmlAttributes";
import type { CardPartArgs } from "./Card.types";


const cardClasses = {
  card: "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
  "card-header":
    "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
  "card-title": "leading-none font-semibold",
  "card-description": "text-muted-foreground text-sm",
  "card-action":
    "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
  "card-content": "px-6",
  "card-footer": "flex items-center px-6 [.border-t]:pt-6",
} as const;

export type CardSlot = keyof typeof cardClasses;

/** Entspricht cardVariants() / cardHeaderVariants() / ... aus variants.go */
export function cardVariants(slot: CardSlot, className = ""): string {
  return cn(cardClasses[slot], className);
}

function createCardPart(slot: CardSlot) {
  return (args: CardPartArgs = {}): string => {
    const classes = cardVariants(slot, args.class);
    return `<div data-slot="${slot}" class="${escapeHtml(classes)}"${renderAttributes(
      args.attributes
    )}>${renderChildren(args.children)}</div>`;
  };
}

/** Main card container */
export const Card = createCardPart("card");
/** Contains the card title, description, and optional action */
export const CardHeader = createCardPart("card-header");
/** Displays the main title of the card */
export const CardTitle = createCardPart("card-title");
/** Displays the description text of the card */
export const CardDescription = createCardPart("card-description");
/** Displays action elements (like buttons) in the card header */
export const CardAction = createCardPart("card-action");
/** Contains the main content of the card */
export const CardContent = createCardPart("card-content");
/** Contains footer content like buttons or additional info */
export const CardFooter = createCardPart("card-footer");
