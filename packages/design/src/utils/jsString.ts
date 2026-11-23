/**
 * JS-String-Literal für Datastar-Expressions.
 * Zusätzlich zu JSON.stringify werden `;` und `$` maskiert: Datastar teilt Expressions an Semikolons
 * und ersetzt `$name` durch Signal-Zugriffe, beides darf Werte in Strings nicht verändern.
 */
export function jsString(value: string): string {
  return JSON.stringify(value).replaceAll(";", "\\u003b").replaceAll("$", "\\u0024");
}
