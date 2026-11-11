import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import {
    buildContentAttributes,
    buildRootAttributes,
    buildTriggerAttributes,
    DEFAULT_COLLAPSIBLE_OPEN,
} from "./Collapsible.expressions";
import type { CollapsibleArgs, CollapsibleContentArgs, CollapsibleTriggerArgs } from "./Collapsible.types";

/**
 * Wurzel des Collapsibles (`<div>`). Hält den Zustand als Datastar-Signal `$<id>.open`.
 * Die Quelle (shadcn/ui) bringt keine eigenen Tailwind-Klassen mit, daher gibt es hier kein `collapsibleTw`.
 * Nutzer-Attribute werden zuerst übernommen und von den Standard-Attributen überschrieben.
 */
export function Collapsible(args: CollapsibleArgs): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildRootAttributes(args.id, args.open ?? DEFAULT_COLLAPSIBLE_OPEN, args.disabled ?? false),
  };

  if (args.class) attrs.class = args.class;

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}

/**
 * Trigger: schaltet `$<id>.open` um. Standardmäßig ein `<button type="button">`.
 * Mit `render` lässt sich ein eigenes Element (z. B. Button) verwenden, das die Attribute übernimmt.
 */
export function CollapsibleTrigger(args: CollapsibleTriggerArgs): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildTriggerAttributes(args.id, args.open ?? DEFAULT_COLLAPSIBLE_OPEN, args.disabled ?? false),
  };

  if (args.render) return args.render(attrs);

  if (args.class) attrs.class = args.class;

  return `<button${renderAttributes(attrs)}>${renderChildren(args.children)}</button>`;
}

/**
 * Auf- und zuklappbarer Bereich (`<div id="<id>-content">`). Die Kinder bleiben im DOM und
 * werden per `data-show` ein- und ausgeblendet (die React-Vorlage rendert sie im geschlossenen Zustand nicht).
 */
export function CollapsibleContent(args: CollapsibleContentArgs): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildContentAttributes(args.id, args.open ?? DEFAULT_COLLAPSIBLE_OPEN, args.attributes?.style),
  };

  if (args.class) attrs.class = args.class;

  return `<div${renderAttributes(attrs)}>${renderChildren(args.children)}</div>`;
}
