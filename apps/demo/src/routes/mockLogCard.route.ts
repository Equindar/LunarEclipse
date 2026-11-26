import {
    LogCardEntry,
    LogCardSection,
    logCardContentSelector,
    logCardEntriesSelector,
    logCardSectionId,
    logCardSignalsPatch,
} from "@lunareclipse/design";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { simulation } from "./default.route";

export const mockLogCardRouter = new Hono().get("/log-card/:id", (c) =>
  streamSSE(c, async (stream) => {
    const cardId = c.req.param("id");
    const skip = Number(c.req.query("skip") ?? 0);
    const startedAt = Number(c.req.query("start"));
    const speed = Number(c.req.query("speed") ?? 6);

    const patchElements = (selector: string, elements: string) =>
      stream.writeSSE({
        event: "datastar-patch-elements",
        data: ["mode append", `selector ${selector}`, `elements ${elements}`].join("\n"),
      });

    let previous = skip > 0 ? simulation[skip - 1]!.seconds : 0;
    for (const item of simulation.slice(skip)) {
      if (stream.aborted) return;
      await stream.sleep(Math.max(((item.seconds - previous) / speed) * 1000, 150));
      previous = item.seconds;

      if (item.first) {
        const section = LogCardSection({
          ...item.section,
          id: cardId,
          sectionId: logCardSectionId(cardId, item.sectionIndex),
          startedAt,
          entries: [item.entry],
          announce: true,
        });
        await patchElements(logCardContentSelector(cardId), section);
      } else {
        const entry = LogCardEntry({ ...item.entry, cardId, startedAt, announce: true });
        await patchElements(logCardEntriesSelector(cardId, item.sectionIndex), entry);
      }
    }

    await stream.writeSSE({
      event: "datastar-patch-signals",
      data: `signals ${logCardSignalsPatch(cardId, { live: false })}`,
    });
  })
);
