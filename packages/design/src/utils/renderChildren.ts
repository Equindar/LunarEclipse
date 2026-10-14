import type { Children } from "../types/Children";

export function renderChildren(children?: Children): string {
  if (children === undefined) return "";
  return typeof children === "string" ? children : children.join("");
}
