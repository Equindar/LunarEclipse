# Architektur-Vorgaben: Echtzeit-Charts (Hono + Datastar + SVG)

## Tech-Stack & Prinzipien
- **Backend:** TypeScript mit **Hono** (JSX für HTML/SVG-Rendering, `streamSSE` für Echtzeit-Updates).
- **Frontend:** **Datastar** (Hypermedia-Ansatz via Server-Sent Events und DOM-Morphing).
- **Chart-Engine:** Keine clientseitige Chart-Library (kein Recharts, kein Chart.js). Stattdessen **serverseitige Berechnung** der SVG-Geometrie und **DOM-Morphing** im Client.

## Umsetzung der Charts
1. **D3 nur für Mathematik (Backend):**
   - Ausschließlich `d3-scale` und `d3-shape` im Backend nutzen (kein `jsdom`, kein komplettes `d3`).
   - Skalen (`scaleLinear`, `scaleBand` etc.) und Pfad-Strings (`line()`, `area()` -> `d="..."`) werden vollständig auf dem Server berechnet.

2. **Rendering & SSE-Morphing:**
   - Hono rendert ein komplettes `<svg>`-Element mit fester `id` (z. B. `id="live-chart"`) und `viewBox`.
   - Updates werden über Hono `streamSSE` als `datastar-merge-fragments` an den Client gepusht.
   - Datastar morpht nur geänderte Attribute (`d`, `height`, `cx`, `cy`). Flüssige Animationen erfolgen rein über CSS-Transitions (z. B. `transition: d 0.3s ease`).

3. **Interaktives Tooltipping (Eigenlösung ohne JS-Library):**
   - **Zustand:** Ein lokales Datastar-Signal im umschließenden Container (`data-signals="{ tooltip: { show: false, x: 0, y: 0, label: '', value: '' } }"`).
   - **Overlay:** Ein HTML-`<div>` außerhalb des SVGs (`position: absolute`), gesteuert über `data-show="$tooltip.show"`, `data-text` und `data-style` (Positionierung via `evt.offsetX` und `evt.offsetY`).
   - **Hitboxen im SVG:** Hono rendert für jeden Datenpunkt eine unsichtbare `<rect>`-Spalte über die volle Chart-Höhe (`fill="transparent"`). Diese aktualisiert bei `data-on-mouseenter` das `$tooltip`-Signal und blendet es bei `data-on-mouseleave` wieder aus.
   - **Hover-Effekte:** Crosshair-Linien und Punkt-Vergrößerungen werden rein über CSS (`group-hover`) innerhalb einer SVG-`<g>`-Gruppe gelöst.
