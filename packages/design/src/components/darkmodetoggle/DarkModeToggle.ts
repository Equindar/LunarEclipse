import { Button } from "../../ui/button";
import { Icon } from "../../ui/icon";
import { toggleVariants } from "../../ui/toggle";
import { cn } from "../../utils/cn";
import { type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { tw } from "../../utils/tw";
import {
    buildDarkModeToggleAttributes,
    DEFAULT_DARK_MODE_TOGGLE_LABEL,
} from "./DarkModeToggle.expressions";
import type { DarkModeToggleArgs } from "./DarkModeToggle.types";

/**
 * Sichtbarkeit der Icons über Tailwinds dark-Variante: Im hellen Modus ist der Mond sichtbar
 * (Klick wechselt zu dunkel), im dunklen Modus die Sonne.
 * Die Klassen stehen bewusst als Literale da: Tailwind erkennt keine per Interpolation zusammengesetzten Klassen.
 */
const sunTw = tw`hidden dark:block`;
const moonTw = tw`block dark:hidden`;

/**
 * Dark-Mode-Toggle: Button für die AppBar, der die Klasse "dark" am html-Element umschaltet.
 * Ohne die Klasse gilt der helle Modus. Funktioniert nur mit geladenem Datastar.
 * Den Initialwert setzt das Inline-Script im head. Die dark-Variante von Tailwind muss klassenbasiert sein.
 * Nutzer-Attribute werden zuerst übernommen und von den Standard-Attributen überschrieben.
 */
export function DarkModeToggle(args: DarkModeToggleArgs = {}): string {
  const attrs: HtmlAttributes = {
    ...args.attributes,
    ...buildDarkModeToggleAttributes(args.label || DEFAULT_DARK_MODE_TOGGLE_LABEL),
    class: cn(toggleVariants({ variant: args.variant, size: args.size }), args.class),
  };

  if (args.id) attrs.id = args.id;

  return Button({
    variant: args.variant ?? "default",
    size: args.size ?? "default",
    attributes: attrs,
    children: [
      Icon({ name: "sun", class: sunTw}),
      Icon({ name: "moon", class: moonTw })
    ]
  })
}
