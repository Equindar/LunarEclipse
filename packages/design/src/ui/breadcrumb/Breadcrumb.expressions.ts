import { cn } from "../../utils/cn";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/**
 * Der Breadcrumb hat keine Datastar-Logik; diese Datei enthält nur Attribut-Bausteine und die festen Icons.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 */

export const DEFAULT_BREADCRUMB_LABEL = "breadcrumb";
export const DEFAULT_ELLIPSIS_LABEL = "More";

/** Standard-Attribut jeder Teilkomponente: data-slot wie in shadcn */
export function buildBreadcrumbSlotAttributes(slot: string): HtmlAttributes {
  return { "data-slot": slot };
}

/**
 * Führt Nutzer-Attribute und Standard-Attribute zusammen (Standard gewinnt) und setzt `class` nur,
 * wenn die zusammengeführte Klasse nicht leer ist. So bleibt ein `class` aus den Nutzer-Attributen erhalten,
 * wenn weder die Komponente noch `args.class` eine Klasse liefern.
 */
export function mergeBreadcrumbAttributes(
  userAttributes: HtmlAttributes | undefined,
  defaults: HtmlAttributes,
  ...classes: Array<string | undefined>
): HtmlAttributes {
  const attrs: HtmlAttributes = { ...userAttributes, ...defaults };
  const className = cn(...classes);
  if (className) attrs.class = className;
  return attrs;
}

const svgOpen =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

/** Standard-Trenner (lucide ChevronRight). Im RTL-Kontext wird das Icon gespiegelt */
export const chevronRightIcon = `${svgOpen} class="rtl:rotate-180"><path d="m9 18 6-6-6-6"></path></svg>`;

/** Icon der Ellipsis (lucide Ellipsis, früher MoreHorizontal) */
export const ellipsisIcon = `${svgOpen}><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>`;
