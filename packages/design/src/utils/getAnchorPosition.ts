/** Positionierungsseite für Anchor-positionierte Elemente */
export type AnchorSide = "top" | "bottom" | "left" | "right";

/** Ausrichtung für Anchor-positionierte Elemente */
export type AnchorAlign = "start" | "center" | "end";

/**
 * Erzeugt CSS Anchor Positioning anhand von Seite und Ausrichtung.
 */
export function getAnchorPosition(
  side: AnchorSide | undefined,
  align: AnchorAlign | undefined,
  sideOffset: number
): string {
  const offset = `${sideOffset}px`;

  switch (side) {
    case "top":
      // Element erscheint oberhalb des Anchors
      switch (align) {
        case "start":
          return `top: anchor(top); left: anchor(left); translate: 0 calc(-100% - ${offset})`;
        case "end":
          return `top: anchor(top); left: anchor(right); translate: -100% calc(-100% - ${offset})`;
        default:
          return `top: anchor(top); left: anchor(center); translate: -50% calc(-100% - ${offset})`;
      }
    case "bottom":
      // Element erscheint unterhalb des Anchors
      switch (align) {
        case "start":
          return `top: anchor(bottom); left: anchor(left); translate: 0 ${offset}`;
        case "end":
          return `top: anchor(bottom); left: anchor(right); translate: -100% ${offset}`;
        default:
          return `top: anchor(bottom); left: anchor(center); translate: -50% ${offset}`;
      }
    case "right":
      // Element erscheint rechts vom Anchor
      switch (align) {
        case "start":
          return `top: anchor(top); left: anchor(right); translate: ${offset} 0`;
        case "end":
          return `top: anchor(bottom); left: anchor(right); translate: ${offset} -100%`;
        default:
          return `top: anchor(center); left: anchor(right); translate: ${offset} -50%`;
      }
    case "left":
      // Element erscheint links vom Anchor
      switch (align) {
        case "start":
          return `top: anchor(top); left: anchor(left); translate: calc(-100% - ${offset}) 0`;
        case "end":
          return `top: anchor(bottom); left: anchor(left); translate: calc(-100% - ${offset}) -100%`;
        default:
          return `top: anchor(center); left: anchor(left); translate: calc(-100% - ${offset}) -50%`;
      }
    default:
      // Standard: unten, zentriert
      return `top: anchor(bottom); left: anchor(center); translate: -50% ${offset}`;
  }
}
