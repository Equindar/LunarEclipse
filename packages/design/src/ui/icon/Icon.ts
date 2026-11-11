import { renderIcon } from "../../utils/renderIcon";
import type { IconArgs, IconName } from "./Icon.types";
import { iconBodies } from "./Icons.generated";

/** Alle verfügbaren Icon-Namen (alphabetisch) */
export const iconNames = Object.keys(iconBodies) as IconName[];

/** Prüft zur Laufzeit, ob ein String ein bekannter Icon-Name ist (z. B. für Namen aus Konfigurationsdaten) */
export function isIconName(value: string): value is IconName {
  return Object.prototype.hasOwnProperty.call(iconBodies, value);
}

/** Inline-SVG-Icon per Name. Ein unbekannter Name (nur ohne TypeScript möglich) wirft einen Fehler. */
export function Icon(args: IconArgs): string {
  const name: string = args.name;
  if (!isIconName(name)) throw new Error(`Unbekanntes Icon: "${name}"`);

  return renderIcon(iconBodies[name], args);
}
