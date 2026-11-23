import type {
    MessageScrollerCommandOptions,
    MessageScrollerControllerConfig,
    MessageScrollerPosition,
} from "./MessageScroller.types";

/**
 * Datastar-Expressions des Message Scrollers.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 *
 * Bei shadcn steckt das gesamte Scroll-Verhalten (Anker, Follow-Output, Prepend-Erhalt,
 * Öffnungsposition) in `@shadcn/react/message-scroller`. Dieses Paket gibt es für HTML-Strings
 * nicht, deshalb übernimmt hier ein kleiner Controller dieselbe Aufgabe. Er hält den Zustand
 * wie das Original imperativ und spiegelt ihn auf data-Attribute (kein Signal-State).
 */

export const DEFAULT_AUTO_SCROLL = false;
export const DEFAULT_SCROLL_POSITION: MessageScrollerPosition = "end";
export const DEFAULT_SCROLL_EDGE_THRESHOLD = 8;
export const DEFAULT_SCROLL_MARGIN = 0;
export const DEFAULT_SCROLL_PREVIOUS_ITEM_PEEK = 64;

/** Name des Events, über das Sprungbefehle den Controller erreichen */
export const COMMAND_EVENT = "message-scroller:command";

/**
 * Feste data-slot-Werte. Der Controller findet seine Teile darüber, deshalb dürfen
 * Nutzer-`attributes` sie nicht ersetzen (die Standard-Attribute überschreiben sie).
 */
export const SLOT = {
  provider: "message-scroller-provider",
  root: "message-scroller",
  viewport: "message-scroller-viewport",
  content: "message-scroller-content",
  spacer: "message-scroller-spacer",
  item: "message-scroller-item",
  button: "message-scroller-button",
} as const;

/** Zufalls-ID des Providers: `message_scroller_<8 Hex-Zeichen>` */
export function createScrollerId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `message_scroller_${hex}`;
}

/*
 * Controller (läuft per data-init am Provider; `el` ist der Provider).
 *
 * Regeln für diesen Quelltext:
 * - Datastar ersetzt in Expressions "$name" und "@name(" ausserhalb von Strings. Beides darf hier nicht vorkommen.
 * - Kein Backtick und kein "${" (der Code steht in einem Template-String).
 * - Alle Anweisungen enden mit Semikolon oder Klammer; Zeilenumbrüche werden zu Leerzeichen.
 *
 * Aufgaben: data-scrollable, data-pending-scroll und data-autoscrolling spiegeln, Buttons
 * aktivieren, Öffnungsposition, Anker mit Platzhalter, Follow-Output am Live-Edge, Prepend-Erhalt,
 * Sprungbefehle per Event. Der Platzhalter wird bei Änderungen ans Ende des Contents geschoben,
 * damit Zeilen auch per Datastar-Append (hinter dem Platzhalter) eingefügt werden können.
 */
const CONTROLLER_SOURCE = `
function (host, cfg) {
  if (host.__messageScroller) { host.__messageScroller.destroy(); }
  var root = host.querySelector('[data-slot="${SLOT.root}"]');
  var vp = host.querySelector('[data-slot="${SLOT.viewport}"]');
  var content = host.querySelector('[data-slot="${SLOT.content}"]');
  if (!vp || !content) { return; }
  var spacer = content.querySelector(':scope > [data-slot="${SLOT.spacer}"]');
  var following = cfg.auto, prog = false, progTimer = 0, opened = false;
  var anchorEl = null, ref = null, queued = null;
  var known = new Set(), knownLast = null;

  function items() {
    return Array.prototype.filter.call(content.children, function (c) {
      return c.getAttribute('data-slot') === '${SLOT.item}';
    });
  }
  function vpTop() { return vp.getBoundingClientRect().top; }
  function topOf(el) { return el.getBoundingClientRect().top - vpTop() + vp.scrollTop; }
  function maxScroll() { return Math.max(0, vp.scrollHeight - vp.clientHeight); }
  function atEnd() { return maxScroll() - vp.scrollTop <= cfg.edge; }
  function flag(el, name, on, value) {
    if (!el) { return; }
    if (on) { if (el.getAttribute(name) !== value) { el.setAttribute(name, value); } }
    else if (el.hasAttribute(name)) { el.removeAttribute(name); }
  }

  function remember() {
    if (prog) { return; }
    var top = vpTop(), list = items();
    ref = null;
    for (var i = 0; i < list.length; i++) {
      var b = list[i].getBoundingClientRect();
      if (b.bottom > top + 1) { ref = { el: list[i], top: b.top - top }; break; }
    }
  }
  function settle() {
    prog = false;
    flag(root, 'data-autoscrolling', false);
    flag(vp, 'data-autoscrolling', false);
    remember();
  }
  function go(y, behavior, auto) {
    prog = true;
    clearTimeout(progTimer);
    if (auto) { flag(root, 'data-autoscrolling', true, ''); flag(vp, 'data-autoscrolling', true, ''); }
    vp.scrollTo({ top: Math.min(Math.max(0, y), maxScroll()), behavior: behavior || 'auto' });
    progTimer = setTimeout(settle, behavior === 'smooth' ? 1500 : 100);
  }

  function sync() {
    var st = vp.scrollTop;
    var canStart = st > cfg.edge, canEnd = maxScroll() - st > cfg.edge;
    var v = canStart && canEnd ? 'start end' : canStart ? 'start' : canEnd ? 'end' : '';
    flag(root, 'data-scrollable', v !== '', v);
    flag(vp, 'data-scrollable', v !== '', v);
    var buttons = host.querySelectorAll('[data-message-scroller-button]');
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i];
      var on = b.getAttribute('data-direction') === 'start' ? canStart : canEnd;
      b.setAttribute('data-active', on ? 'true' : 'false');
      b.toggleAttribute('inert', !on);
      if (on) { b.removeAttribute('tabindex'); } else { b.setAttribute('tabindex', '-1'); }
    }
  }

  function updateSpacer() {
    if (!spacer) { return; }
    var gap = parseFloat(getComputedStyle(content).rowGap) || 0;
    var mt = (-gap) + 'px';
    if (spacer.style.marginTop !== mt) { spacer.style.marginTop = mt; }
    var h = 0;
    if (anchorEl && anchorEl.isConnected) {
      h = Math.max(0, Math.ceil(vp.clientHeight - cfg.margin - cfg.peek - (topOf(spacer) - topOf(anchorEl))));
    } else { anchorEl = null; }
    var hs = h + 'px';
    if (spacer.style.height !== hs) { spacer.style.height = hs; }
  }

  function keep() {
    if (prog || !ref || !ref.el.isConnected) { return; }
    if (vp.getAttribute('data-preserve-scroll-on-prepend') === 'false') { return; }
    var d = ref.el.getBoundingClientRect().top - vpTop() - ref.top;
    if (Math.abs(d) > 0.5) { go(vp.scrollTop + d, 'auto', false); }
  }

  function layout() {
    updateSpacer();
    if (cfg.auto && following && opened) {
      if (maxScroll() - vp.scrollTop > 0.5) { go(maxScroll(), 'auto', true); }
    } else { keep(); }
    sync();
    remember();
  }

  function jump(d) {
    var behavior = d.behavior || 'auto';
    if (d.type === 'end') { following = cfg.auto; go(maxScroll(), behavior, true); return true; }
    if (d.type === 'start') { following = false; go(0, behavior, false); return true; }
    if (d.type !== 'message') { return false; }
    var el = null, list = items();
    for (var i = 0; i < list.length; i++) {
      if (list[i].getAttribute('data-message-id') === d.id) { el = list[i]; break; }
    }
    if (!el) { if (!list.length) { queued = d; return true; } return false; }
    var m = d.scrollMargin == null ? cfg.margin : d.scrollMargin;
    var t = topOf(el), h = el.offsetHeight, ch = vp.clientHeight, st = vp.scrollTop, a = d.align || 'start', y;
    if (a === 'start') { y = t - m; }
    else if (a === 'end') { y = t + h - ch + m; }
    else if (a === 'center') { y = t - (ch - h) / 2; }
    else if (t - m < st) { y = t - m; }
    else if (t + h + m > st + ch) { y = t + h - ch + m; }
    else { y = st; }
    following = false;
    go(y, behavior, false);
    return true;
  }

  function open() {
    var list = items();
    if (list.length && cfg.pos !== 'start') {
      var a = null;
      if (cfg.pos === 'last-anchor') {
        for (var i = list.length - 1; i >= 0; i--) {
          if (list[i].getAttribute('data-scroll-anchor') === 'true') { a = list[i]; break; }
        }
      }
      if (a && vp.scrollHeight - topOf(a) > vp.clientHeight) { go(topOf(a) - cfg.margin, 'auto', false); }
      else { go(maxScroll(), 'auto', false); }
      following = cfg.auto && atEnd();
    }
    flag(root, 'data-pending-scroll', false);
    flag(vp, 'data-pending-scroll', false);
    opened = true;
  }

  function keepSpacerLast() {
    if (spacer && content.lastElementChild !== spacer) { content.appendChild(spacer); }
  }

  function onMutate() {
    keepSpacerLast();
    var list = items(), prev = known;
    known = new Set(list);
    var last = knownLast, anchor = null;
    list.forEach(function (n) {
      if (prev.has(n) || n.getAttribute('data-scroll-anchor') !== 'true') { return; }
      if (!last || !last.isConnected || (last.compareDocumentPosition(n) & 4)) { anchor = n; }
    });
    list.forEach(function (n) { ro.observe(n); });
    knownLast = list.length ? list[list.length - 1] : null;
    if (anchor) {
      anchorEl = anchor;
      updateSpacer();
      go(topOf(anchor) - cfg.margin - cfg.peek, 'auto', false);
      following = cfg.auto && atEnd();
      sync();
    } else { layout(); }
    if (queued) { var q = queued; queued = null; jump(q); }
  }

  function onScroll() {
    if (!prog) {
      if (atEnd()) { if (cfg.auto) { following = true; } } else { following = false; }
      remember();
    }
    sync();
  }
  function onScrollEnd() { if (prog) { clearTimeout(progTimer); settle(); } }
  function onClick(e) {
    var b = e.target.closest ? e.target.closest('[data-message-scroller-button]') : null;
    if (!b || !host.contains(b)) { return; }
    jump({ type: b.getAttribute('data-direction') === 'start' ? 'start' : 'end', behavior: b.getAttribute('data-behavior') || 'smooth' });
  }
  function onCommand(e) { var d = e.detail || {}; d.handled = jump(d); }

  keepSpacerLast();
  var list0 = items();
  known = new Set(list0);
  knownLast = list0.length ? list0[list0.length - 1] : null;
  if (list0.length && cfg.pos !== 'start') {
    flag(root, 'data-pending-scroll', true, '');
    flag(vp, 'data-pending-scroll', true, '');
  }

  var mo = new MutationObserver(onMutate);
  var ro = new ResizeObserver(function () { layout(); });
  mo.observe(content, { childList: true });
  ro.observe(vp);
  list0.forEach(function (n) { ro.observe(n); });
  vp.addEventListener('scroll', onScroll, { passive: true });
  vp.addEventListener('scrollend', onScrollEnd);
  host.addEventListener('click', onClick);
  host.addEventListener('${COMMAND_EVENT}', onCommand);

  host.__messageScroller = {
    destroy: function () {
      mo.disconnect();
      ro.disconnect();
      clearTimeout(progTimer);
      vp.removeEventListener('scroll', onScroll);
      vp.removeEventListener('scrollend', onScrollEnd);
      host.removeEventListener('click', onClick);
      host.removeEventListener('${COMMAND_EVENT}', onCommand);
      delete host.__messageScroller;
    }
  };

  open();
  layout();
}
`
  .replace(/\s*\n\s*/g, " ")
  .trim();

/** Konfiguration des Controllers aus den Provider-Args (Standardwerte der Quelle) */
export function buildControllerConfig(args: {
  autoScroll?: boolean;
  defaultScrollPosition?: MessageScrollerPosition;
  scrollEdgeThreshold?: number;
  scrollMargin?: number;
  scrollPreviousItemPeek?: number;
}): MessageScrollerControllerConfig {
  return {
    auto: args.autoScroll ?? DEFAULT_AUTO_SCROLL,
    pos: args.defaultScrollPosition ?? DEFAULT_SCROLL_POSITION,
    edge: args.scrollEdgeThreshold ?? DEFAULT_SCROLL_EDGE_THRESHOLD,
    margin: args.scrollMargin ?? DEFAULT_SCROLL_MARGIN,
    peek: args.scrollPreviousItemPeek ?? DEFAULT_SCROLL_PREVIOUS_ITEM_PEEK,
  };
}

/** `data-init`-Expression am Provider: startet den Controller mit der Konfiguration */
export function buildInitExpression(config: MessageScrollerControllerConfig): string {
  return `(${CONTROLLER_SOURCE})(el, ${JSON.stringify(config)})`;
}

/**
 * Expression, die einen Befehl an den Controller schickt und `true` liefert, wenn er ausgeführt
 * oder vorgemerkt wurde (entspricht den Rückgabewerten von `useMessageScroller`).
 */
function buildCommandExpression(scrollerId: string, detail: Record<string, unknown>): string {
  const event = `new CustomEvent(${JSON.stringify(COMMAND_EVENT)}, { detail: d })`;

  return `((h, d) => (h ? (h.dispatchEvent(${event}), d.handled === true) : false))(document.getElementById(${JSON.stringify(scrollerId)}), ${JSON.stringify(detail)})`;
}

export function buildScrollToMessageExpression(
  scrollerId: string,
  messageId: string,
  options: MessageScrollerCommandOptions = {}
): string {
  return buildCommandExpression(scrollerId, { type: "message", id: messageId, ...options });
}

export function buildScrollToEndExpression(scrollerId: string, options: MessageScrollerCommandOptions = {}): string {
  return buildCommandExpression(scrollerId, { type: "end", ...options });
}

export function buildScrollToStartExpression(scrollerId: string, options: MessageScrollerCommandOptions = {}): string {
  return buildCommandExpression(scrollerId, { type: "start", ...options });
}
