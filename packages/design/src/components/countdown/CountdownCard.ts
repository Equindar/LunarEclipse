import { Card, CardContent, CardHeader, CardTitle, Toggle } from "@lunareclipse/design";
import { escapeHtml } from "../../utils/escapeHtml";
import { countdownExpressions } from "./CountdownCard.expressions";

const attr = (name: string, expr: string) => `${name}="${escapeHtml(expr)}"`;

export interface CountdownCardArgs {
  /** Eindeutige ID pro Instanz (Standard: Zufalls-ID) */
  id?: string;
  title?: string;
  /** Zielzeitpunkt als Epoch-Millisekunden */
  targetMs: number;
}

export function CountdownCard({
  id = `countdown_${crypto.randomUUID().slice(0, 8)}`,
  title = "Zeitangaben",
  targetMs,
}: CountdownCardArgs): string {
  const x = countdownExpressions(id);

  return `
<div ${attr("data-signals", x.signals(targetMs))}
     ${attr(`data-computed:${x.remainingName}`, x.remaining)}
     ${attr("data-on-interval__duration.1s", x.tick)}>
  ${Card({
    children: [
      CardHeader({
        children: [
          CardTitle({ children: title }),
          Toggle({
            id,
            variant: "outline",
            size: "sm",
            attributes: { "aria-label": "Restzeit anzeigen" },
            children: "Restzeit",
          }),
        ].join(""),
      }),
      CardContent({
        children: `
          <div ${attr("data-show", x.showTimestamp)}>
            Zeitpunkt: <span ${attr("data-text", x.timestampText)}></span>
          </div>
          <div style="display:none" ${attr("data-show", x.showRemaining)}>
            Restzeit: <span ${attr("data-text", x.remainingText)}></span>
          </div>`,
      })
    ]
  })}
</div>`;
}
