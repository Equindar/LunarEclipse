/** Inline-Style, der ein Element als Anchor benennt: `anchor-name: --<name>` */
export function buildAnchorStyle(anchorName?: string): string {
  return anchorName ? `anchor-name: --${anchorName}` : "";
}

/** Inline-Style, der ein Element an einem Anchor positioniert: `position-anchor: --<name>` */
export function buildPositionAnchorStyle(anchorName?: string): string {
  return anchorName ? `position-anchor: --${anchorName}` : "";
}
