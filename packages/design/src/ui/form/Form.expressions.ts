import { safeUrl } from "../../utils/safeUrl";
import type { FormArgs } from "./Form.types";

/**
 * Datastar-Submit-Handler des Forms (@post).
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 *
 * @param target Wert von `data-target` (falls vorhanden), wird als `target: '…'` übergeben
 */
export function buildSubmitHandler(
  args: Pick<FormArgs, "id" | "action" | "contentType" | "formDataFields">,
  target?: string
): string {
  const action = safeUrl(args.action ?? "");
  const targetOption = target === undefined ? "" : `, target: '${target}'`;

  // Mit formDataFields: JSON senden, gefiltert auf formId und <formId>.* (z. B. {"formId": "login", "login": {...}})
  if (args.formDataFields?.length) {
    const sanitizedId = (args.id ?? "").replaceAll("-", "_");
    const filterSignals = `filterSignals: {include: /^(formId|${sanitizedId}\\.)/}`;

    return `@post('${action}', {contentType: 'json', ${filterSignals}${targetOption}})`;
  }

  // Standard: contentType "form", außer es ist explizit "json"
  const contentType = args.contentType === "json" ? "json" : "form";

  return `@post('${action}', {contentType: '${contentType}'${targetOption}})`;
}
