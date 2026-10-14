import { escapeHtml } from "./escapeHtml";

export interface HtmlAttributes {
  [key: string]: string | number | boolean | undefined;
}

export function renderAttributes(attributes?: HtmlAttributes): string {
  if (!attributes) return "";
  return Object.entries(attributes)
    .filter(([, value]) => value !== undefined && value !== false)
    .map(([key, value]) =>
      value === true ? ` ${key}` : ` ${key}="${escapeHtml(String(value))}"`
    )
    .join("");
}
