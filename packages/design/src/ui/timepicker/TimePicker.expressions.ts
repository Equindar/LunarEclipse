import { createSignals } from "../../utils/SignalManager";
import type {
    TimePickerPlaceholder,
    TimePickerRuntimeConfig,
    TimePickerSegment,
    TimePickerSignals,
} from "./TimePicker.types";

/**
 * Datastar-Expressions und Client-Runtime des Time-Pickers.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 *
 * Die Vorlage (Dice UI) hält ihren Zustand in einem React-Store. Im Port liegen nur `value` und `open` als Signale vor.
 * Die Eingabelogik der Segmente (Auto-Padding, Auto-Advance, Pfeiltasten, Backspace) steckt in einer Runtime-Funktion,
 * die der Root einmal pro Instanz per `data-init` auf `el._tp` ablegt. Alle Handler der Teilkomponenten rufen sie auf.
 */

export const DEFAULT_STEP = 1;
export const DEFAULT_SEGMENT_PLACEHOLDER = "--";

/** Initialer Signal-State */
export const timePickerInitialSignals: TimePickerSignals = { value: "", open: false };

/** Signal-Manager eines Time-Pickers (Signal-Name = ID mit "-" zu "_") */
export const timePickerSignals = (id: string, initial: TimePickerSignals = timePickerInitialSignals) =>
  createSignals<TimePickerSignals>(id, initial);

/** IDs der Teilkomponenten, abgeleitet aus der ID des Roots (die Runtime findet die Elemente darüber) */
export const timePickerPartId = (id: string, part: "label" | "input-group" | "trigger" | "content"): string =>
  `${id}-${part}`;

export const timePickerSegmentId = (id: string, segment: TimePickerSegment): string => `${id}-${segment}`;

/** Schrittweite absichern (positive Ganzzahl), sonst würde die Spaltenliste unendlich lang */
export function normalizeStep(step: number | undefined): number {
  const value = Math.floor(step ?? DEFAULT_STEP);
  return Number.isFinite(value) && value >= 1 ? value : DEFAULT_STEP;
}

export function normalizePlaceholder(placeholder: TimePickerPlaceholder | undefined): Record<TimePickerSegment, string> {
  if (typeof placeholder === "string") {
    return { hour: placeholder, minute: placeholder, second: placeholder, period: placeholder };
  }
  return {
    hour: placeholder?.hour ?? DEFAULT_SEGMENT_PLACEHOLDER,
    minute: placeholder?.minute ?? DEFAULT_SEGMENT_PLACEHOLDER,
    second: placeholder?.second ?? DEFAULT_SEGMENT_PLACEHOLDER,
    period: placeholder?.period ?? DEFAULT_SEGMENT_PLACEHOLDER,
  };
}

/** CSS-Variablen für die Breite der Segmente (Vorlage: am Input-Group, hier am Root, sie vererben sich) */
export function buildInputWidthStyle(ph: Record<TimePickerSegment, string>): string {
  return [
    `--time-picker-hour-input-width: ${ph.hour.length}ch`,
    `--time-picker-minute-input-width: ${ph.minute.length}ch`,
    `--time-picker-second-input-width: ${ph.second.length}ch`,
    `--time-picker-period-input-width: ${Math.max(ph.period.length, 2) + 0.5}ch`,
  ].join("; ");
}

/**
 * Runtime des Time-Pickers (reines JavaScript als String, damit kein Build-Schritt den Code verändert).
 *
 * Regeln, weil Datastar Expressions bei ";" und Zeilenumbruch in Statements zerlegt und wieder zusammensetzt:
 * - keine Kommentare, keine Zeilenumbrüche (werden unten zu Leerzeichen), keine ";" in Stringliteralen
 * - kein "$" und kein "@" (Datastar ersetzt Signal-Referenzen und Actions)
 * - jedes Statement endet mit ";" oder "}" (kein Verlass auf ASI)
 *
 * Signatur: (root, cfg, get, set, getOpen, setOpen). Die Accessoren kapseln die Signale (`$<id>.value`, `$<id>.open`).
 */
const js = String.raw;

const RUNTIME_SOURCE = js`
(function (root, cfg, get, set, getOpen, setOpen) {
  var ORDER = ["hour", "minute", "second", "period"];
  var PH = cfg.ph;
  var is12 = false;
  var ready = false;
  var mount = new Date();
  var via = false;
  var wasOpen = false;
  var lastEvt = null;

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function clamp(v, a, b) { return Math.min(Math.max(v, a), b); }
  function to12(h) { return { h: h % 12 || 12, p: h >= 12 ? "PM" : "AM" }; }
  function to24(h, p) { return h === 12 ? (p === "PM" ? 12 : 0) : (p === "PM" ? h + 12 : h); }
  function num(s, max) { var n = parseInt(s, 10); return !isNaN(n) && n >= 0 && n <= max ? n : undefined; }
  function part(p, i, max) { return p[i] && p[i] !== "--" ? num(p[i], max) : undefined; }
  function detect12(l) {
    var f = new Intl.DateTimeFormat(l || undefined, { hour: "numeric" }).format(new Date(2000, 0, 1, 13, 0, 0));
    return /am|pm/i.test(f) || f.indexOf("13") < 0;
  }

  function parse(s) {
    if (!s) return null;
    var p = s.split(":");
    if (p.length < 2) return null;
    var t = { h: part(p, 0, 23), m: part(p, 1, 59), s: part(p, 2, 59) };
    return t.h === undefined && t.m === undefined && t.s === undefined ? null : t;
  }
  function f2(n) { return n === undefined ? "--" : pad(n); }
  function fmt(t, sec) { return f2(t.h) + ":" + f2(t.m) + (sec ? ":" + f2(t.s) : ""); }
  function copy(t) { return t ? { h: t.h, m: t.m, s: t.s } : {}; }
  function commit(t, sec) {
    var v = t.h === undefined && t.m === undefined && t.s === undefined ? "" : fmt(t, sec);
    if (v !== get()) set(v);
  }

  function text(seg, t) {
    if (!t) return PH[seg];
    if (seg === "hour") return t.h === undefined ? PH.hour : pad(is12 ? to12(t.h).h : t.h);
    if (seg === "minute") return t.m === undefined ? PH.minute : pad(t.m);
    if (seg === "second") return t.s === undefined ? PH.second : pad(t.s);
    return t.h === undefined ? PH.period : to12(t.h).p;
  }

  function update(seg, v, create) {
    if (!v || v === PH[seg]) return;
    var t = parse(get());
    if (!t && !create) return;
    var nt = copy(t);
    var d = parseInt(v, 10);
    if (seg === "hour") {
      if (!isNaN(d)) {
        if (is12) {
          var cp = t && t.h !== undefined ? to12(t.h).p : to12(new Date().getHours()).p;
          nt.h = to24(clamp(d, 1, 12), cp);
        } else {
          nt.h = clamp(d, 0, 23);
        }
      }
    } else if (seg === "minute") {
      if (!isNaN(d)) nt.m = clamp(d, 0, 59);
    } else if (seg === "second") {
      if (!isNaN(d)) nt.s = clamp(d, 0, 59);
    } else if ((v === "AM" || v === "PM") && t && t.h !== undefined) {
      nt.h = to24(to12(t.h).h, v);
    }
    commit(nt, cfg.showSeconds);
  }

  function fill() {
    var t = parse(get());
    if (!t) return;
    var d = new Date();
    var nt = copy(t);
    var need = false;
    if (nt.h === undefined) { nt.h = d.getHours(); need = true; }
    if (nt.m === undefined) { nt.m = d.getMinutes(); need = true; }
    if (cfg.showSeconds && nt.s === undefined) { nt.s = d.getSeconds(); need = true; }
    if (need) commit(nt, cfg.showSeconds);
  }

  function byId(p) { return document.getElementById(cfg.id + "-" + p); }
  function segOf(el) { return el.getAttribute("data-segment"); }
  function inputs() { return Array.prototype.slice.call(root.querySelectorAll('input[data-slot="time-picker-input"]')); }
  function inputOf(seg) { return root.querySelector('input[data-segment="' + seg + '"]'); }
  function cols() {
    var sel = ORDER.map(function (n) { return '[data-slot="time-picker-' + n + '"]'; }).join(",");
    return Array.prototype.slice.call(root.querySelectorAll(sel));
  }
  function itemsOf(col) { return Array.prototype.slice.call(col.querySelectorAll("button")); }

  function next(seg) {
    for (var i = ORDER.indexOf(seg) + 1; i < ORDER.length; i++) {
      var n = inputOf(ORDER[i]);
      if (n) { n.focus(); n.select(); return; }
    }
  }
  function selectLater(el) { queueMicrotask(function () { el.select(); }); }

  function commitEdit(el, seg) {
    var ev = el._edit;
    if (ev && ev.length > 0 && ev !== PH[seg]) {
      if (ev.length === 2) {
        update(seg, ev, true);
      } else if (ev.length === 1) {
        var n = parseInt(ev, 10);
        if (!isNaN(n)) update(seg, pad(n), true);
      }
    }
  }

  function inFocus(el) {
    el._ed = true;
    el._pend = null;
    el._cancel = false;
    el._edit = text(segOf(el), parse(get()));
    if (cfg.openOnFocus && !getOpen()) { via = true; setOpen(true); }
    selectLater(el);
  }

  function inBlur(el) {
    var seg = segOf(el);
    el._ed = false;
    if (el._cancel) {
      el._cancel = false;
    } else {
      var ev = el._edit;
      if (ev && ev !== PH[seg] && ev.length > 0) {
        var v = ev;
        if (seg !== "period" && ev.length === 1) {
          var n = parseInt(ev, 10);
          if (!isNaN(n)) v = pad(n);
        }
        update(seg, v, true);
        queueMicrotask(fill);
      }
    }
    el._pend = null;
    el._edit = text(seg, parse(get()));
    el.value = el._edit;
  }

  function inInput(el) {
    var seg = segOf(el);
    var ph = PH[seg];
    var nv = el.value;
    if (el._edit === ph && nv.length > 0 && nv !== ph && nv.indexOf(ph) === 0) nv = nv.slice(ph.length);

    if (seg === "period") {
      var c = nv.charAt(0).toUpperCase();
      var np = c === "A" || c === "1" ? "AM" : (c === "P" || c === "2" ? "PM" : null);
      if (np) { el._edit = np; update("period", np, true); selectLater(el); }
      el.value = el._edit;
      return;
    }

    nv = nv.replace(/\D/g, "");
    if (nv.length > 2) nv = nv.slice(0, 2);
    var n = parseInt(nv, 10);
    if (!isNaN(n) && nv.length > 0) {
      if (el._pend !== null && nv.length === 1) {
        var comb = parseInt(el._pend + nv, 10);
        if (!isNaN(comb)) {
          el._edit = pad(comb);
          update(seg, el._edit, true);
          el._pend = null;
          queueMicrotask(function () { next(seg); });
          el.value = el._edit;
          return;
        }
      }
      var maxFirst = seg === "hour" ? (is12 ? 1 : 2) : 5;
      var first = parseInt(nv.charAt(0) || "0", 10);
      if (nv.length === 1) {
        el._edit = pad(n);
        if (first > maxFirst) {
          update(seg, el._edit, true);
          el._pend = null;
          queueMicrotask(function () { next(seg); });
        } else {
          el._pend = nv;
          selectLater(el);
        }
      } else if (nv.length === 2) {
        el._edit = pad(n);
        update(seg, el._edit, true);
        el._pend = null;
        queueMicrotask(function () { next(seg); });
      }
    } else if (nv.length === 0) {
      el._edit = "";
      el._pend = null;
    }
    el.value = el._edit;
  }

  function inKey(el, evt) {
    var seg = segOf(el);
    var k = evt.key;
    var ph = PH[seg];

    if (k === "ArrowLeft" || k === "ArrowRight") {
      evt.preventDefault();
      var all = inputs();
      var i = all.indexOf(el);
      if (i !== -1) {
        var j = k === "ArrowLeft" ? Math.max(0, i - 1) : Math.min(all.length - 1, i + 1);
        if (all[j] !== el) { all[j].focus(); all[j].select(); }
      }
      return;
    }

    if ((k === "Backspace" || k === "Delete") && el.selectionStart === 0 && el.selectionEnd === el.value.length) {
      evt.preventDefault();
      el._edit = ph;
      el.value = ph;
      el._pend = null;
      var t = parse(get());
      if (t) {
        var nt = copy(t);
        if (seg === "hour") nt.h = undefined;
        if (seg === "minute") nt.m = undefined;
        if (seg === "second") nt.s = undefined;
        commit(nt, cfg.showSeconds);
      } else if (get() !== "") {
        set("");
      }
      selectLater(el);
      return;
    }

    if (k === "Escape") {
      evt.preventDefault();
      el._cancel = true;
      if (getOpen()) { via = false; setOpen(false); }
      el.blur();
      return;
    }

    if (k === "Tab") { commitEdit(el, seg); return; }

    if (k === "Enter") {
      evt.preventDefault();
      commitEdit(el, seg);
      selectLater(el);
      return;
    }

    if (seg === "period") {
      var lk = k.toLowerCase();
      var pv = null;
      if (lk === "a" || lk === "1") pv = "AM";
      if (lk === "p" || lk === "2") pv = "PM";
      if (k === "ArrowUp" || k === "ArrowDown") {
        var cur = el._edit === ph || el._edit === "" ? "AM" : el._edit;
        pv = cur === "AM" || cur === "A" ? "PM" : "AM";
      }
      if (pv) {
        evt.preventDefault();
        el._edit = pv;
        el.value = pv;
        update("period", pv, true);
        selectLater(el);
      }
      return;
    }

    if (k === "ArrowUp" || k === "ArrowDown") {
      evt.preventDefault();
      var up = k === "ArrowUp";
      var out;
      if (el._edit === ph || el._edit === "") {
        out = seg === "hour" ? (is12 ? 12 : (up ? 0 : 23)) : (up ? 0 : 59);
      } else {
        var cv = parseInt(el._edit, 10);
        if (isNaN(cv)) return;
        if (seg === "hour") {
          if (is12) out = up ? (cv === 12 ? 1 : cv + 1) : (cv === 1 ? 12 : cv - 1);
          else out = up ? (cv === 23 ? 0 : cv + 1) : (cv === 0 ? 23 : cv - 1);
        } else {
          out = up ? (cv === 59 ? 0 : cv + 1) : (cv === 0 ? 59 : cv - 1);
        }
      }
      el._edit = pad(out);
      el.value = el._edit;
      update(seg, el._edit, true);
      selectLater(el);
    }
  }

  function pick(name, v) {
    var t = parse(get());
    var d = new Date();
    var nt = copy(t);
    var sec = cfg.showSeconds;
    if (name === "hour") {
      var h = v;
      if (is12) h = to24(v, t && t.h !== undefined ? to12(t.h).p : to12(d.getHours()).p);
      nt.h = h;
      if (nt.m === undefined) nt.m = d.getMinutes();
      if (sec && nt.s === undefined) nt.s = d.getSeconds();
    } else if (name === "minute") {
      nt.m = v;
      if (nt.h === undefined) nt.h = d.getHours();
      if (sec && nt.s === undefined) nt.s = d.getSeconds();
    } else if (name === "second") {
      nt.s = v;
      if (nt.h === undefined) nt.h = d.getHours();
      if (nt.m === undefined) nt.m = d.getMinutes();
      sec = true;
    } else {
      nt.h = to24(to12(t && t.h !== undefined ? t.h : d.getHours()).h, v);
      if (nt.m === undefined) nt.m = d.getMinutes();
      if (sec && nt.s === undefined) nt.s = d.getSeconds();
    }
    commit(nt, sec);
  }

  function focusFirst(cands) {
    var prev = document.activeElement;
    for (var i = 0; i < cands.length; i++) {
      var c = cands[i];
      if (!c) continue;
      if (c === prev) return;
      c.focus();
      if (document.activeElement !== prev) return;
    }
  }
  function focusCol(col) {
    var its = itemsOf(col);
    var sel = its.filter(function (b) { return b.hasAttribute("data-selected"); })[0];
    focusFirst(sel ? [sel].concat(its) : its);
  }

  function itemOf(evt) {
    var b = evt.target && evt.target.closest ? evt.target.closest("button") : null;
    return b && b.getAttribute("data-slot") === "time-picker-column-item" ? b : null;
  }
  function itemClick(evt) {
    var b = itemOf(evt);
    if (!b) return;
    var name = b.parentNode.getAttribute("data-slot").replace("time-picker-", "");
    var raw = b.getAttribute("data-value");
    pick(name, name === "period" ? raw : parseInt(raw, 10));
    b.focus();
  }
  function itemKey(evt) {
    var b = itemOf(evt);
    if (!b) return;
    var k = evt.key;
    var col = b.parentNode;
    if (k === "ArrowUp" || k === "ArrowDown") {
      evt.preventDefault();
      var its = itemsOf(col);
      var i = its.indexOf(b);
      var n = k === "ArrowUp" ? (i > 0 ? i - 1 : its.length - 1) : (i < its.length - 1 ? i + 1 : 0);
      its[n].focus();
      its[n].click();
    } else if (k === "Tab" || k === "ArrowLeft" || k === "ArrowRight") {
      evt.preventDefault();
      var prev = k === "ArrowLeft" || (k === "Tab" && evt.shiftKey);
      queueMicrotask(function () {
        var all = cols();
        var ci = all.indexOf(col);
        if (ci === -1) return;
        var ni = prev ? (ci > 0 ? ci - 1 : all.length - 1) : (ci < all.length - 1 ? ci + 1 : 0);
        focusCol(all[ni]);
      });
    }
  }

  function groupDown(evt) {
    if (cfg.disabled || cfg.readOnly || evt.defaultPrevented) return;
    var t = evt.target;
    var tr = byId("trigger");
    if (t.tagName === "INPUT" || (t.closest && t.closest("input"))) return;
    if (tr && tr.contains(t)) return;
    evt.preventDefault();
  }
  function groupClick(evt) {
    if (cfg.disabled || cfg.readOnly || evt.defaultPrevented) return;
    var t = evt.target;
    var tr = byId("trigger");
    if (t.tagName === "INPUT" || (t.closest && t.closest("input"))) return;
    if (tr && tr.contains(t)) return;
    if (cfg.groupAction === "open") { lastEvt = evt; via = false; setOpen(true); return; }
    var a = document.activeElement;
    var g = byId("input-group");
    if (a && a.tagName === "INPUT" && g && g.contains(a)) return;
    for (var i = 0; i < ORDER.length; i++) {
      var el = inputOf(ORDER[i]);
      if (el) { el.focus(); el.select(); return; }
    }
  }

  function toggle(evt) {
    lastEvt = evt;
    var o = !!getOpen();
    via = false;
    setOpen(!o);
  }
  function outside(evt) {
    if (!getOpen() || evt === lastEvt) return;
    var t = evt.target;
    var tr = byId("trigger");
    var g = byId("input-group");
    if (tr && tr.contains(t)) return;
    if (cfg.openOnFocus && g && g.contains(t)) return;
    via = false;
    setOpen(false);
  }
  function esc(evt) {
    if (evt.key !== "Escape" || !getOpen()) return;
    var c = byId("content");
    var inside = c && c.contains(document.activeElement);
    via = false;
    setOpen(false);
    var tr = byId("trigger");
    if (inside && tr) tr.focus();
  }
  function clear(evt) {
    evt.preventDefault();
    if (cfg.disabled || cfg.readOnly) return;
    if (get() !== "") set("");
  }

  function mark(name, v) {
    var col = root.querySelector('[data-slot="time-picker-' + name + '"]');
    if (!col) return;
    itemsOf(col).forEach(function (b) {
      var sel = b.getAttribute("data-value") === String(v);
      if (sel !== b.hasAttribute("data-selected")) {
        b.toggleAttribute("data-selected", sel);
        if (sel && wasOpen && b.scrollIntoView) b.scrollIntoView({ block: "nearest" });
      }
    });
  }

  function afterShow() {
    root.querySelectorAll('[data-slot="time-picker-column-item"][data-selected]').forEach(function (b) {
      if (b.scrollIntoView) b.scrollIntoView({ block: "nearest" });
    });
    if (via) { via = false; return; }
    var first = cols()[0];
    if (first) focusCol(first);
  }

  function sync() {
    if (!ready) return;
    var t = parse(get());
    inputs().forEach(function (el) {
      if (!el._ed) { var s = text(segOf(el), t); el._edit = s; el.value = s; }
    });
    var rh = t && t.h !== undefined ? t.h : mount.getHours();
    mark("hour", is12 ? to12(rh).h : rh);
    mark("minute", t && t.m !== undefined ? t.m : mount.getMinutes());
    mark("second", t && t.s !== undefined ? t.s : mount.getSeconds());
    mark("period", to12(rh).p);

    var open = !!getOpen();
    var c = byId("content");
    if (c && open && !wasOpen) {
      wasOpen = true;
      try { c.showPopover(); } catch (e) {}
      afterShow();
    } else if (c && !open && wasOpen) {
      wasOpen = false;
      via = false;
      try { c.hidePopover(); } catch (e) {}
    }
  }

  function buildCols() {
    cols().forEach(function (col) {
      var name = col.getAttribute("data-slot").replace("time-picker-", "");
      if (name === "period") {
        if (!is12) { col.remove(); return; }
        col.style.display = "";
      }
      var f = col.getAttribute("data-format");
      var list = [];
      var i;
      var n;
      if (name === "period") {
        list = ["AM", "PM"];
      } else if (name === "hour") {
        n = Math.ceil((is12 ? 12 : 24) / cfg.hourStep);
        for (i = 0; i < n; i++) { var h = i * cfg.hourStep; list.push(is12 ? (h % 12 === 0 ? 12 : h % 12) : h); }
      } else {
        var st = name === "minute" ? cfg.minuteStep : cfg.secondStep;
        n = Math.ceil(60 / st);
        for (i = 0; i < n; i++) list.push(i * st);
      }
      list.forEach(function (v) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = cfg.itemClass;
        b.setAttribute("data-slot", "time-picker-column-item");
        b.setAttribute("data-value", String(v));
        b.textContent = f === "2-digit" && typeof v === "number" ? pad(v) : String(v);
        col.appendChild(b);
      });
    });
  }

  function init() {
    is12 = detect12(cfg.locale);
    inputs().forEach(function (el) {
      if (cfg.disabled) el.disabled = true;
      if (cfg.readOnly) el.readOnly = true;
      if (segOf(el) === "period") {
        if (is12) el.style.display = "";
        else el.remove();
      }
    });
    root.querySelectorAll('[data-slot="time-picker-trigger"],[data-slot="time-picker-clear"]').forEach(function (b) {
      if (cfg.disabled) b.disabled = true;
    });
    buildCols();
    if (getOpen()) via = true;
    ready = true;
    sync();
  }

  return {
    init: init,
    sync: sync,
    toggle: toggle,
    outside: outside,
    esc: esc,
    clear: clear,
    groupDown: groupDown,
    groupClick: groupClick,
    focus: inFocus,
    blur: inBlur,
    input: inInput,
    key: inKey,
    click: function (el) { el.select(); },
    itemClick: itemClick,
    itemKey: itemKey
  };
})
`;

/** Runtime als einzeilige Expression (Zeilenumbrüche würde Datastar zu ";" machen) */
export const TIME_PICKER_RUNTIME: string = RUNTIME_SOURCE.replace(/\s*\n\s*/g, " ").trim();

/**
 * JSON als JavaScript-Literal ausgeben. ";", "$" und "@" werden als Unicode-Escape geschrieben,
 * damit Datastar die Expression nicht zerlegt oder umschreibt (sie kommen nur in Strings vor).
 */
function toSafeJsLiteral(value: unknown): string {
  return JSON.stringify(value).replace(/;/g, "\\u003b").replace(/\$/g, "\\u0024").replace(/@/g, "\\u0040");
}

/** Zugriff auf die Runtime einer Instanz (der Root legt sie per data-init auf `el._tp` ab) */
export const timePickerRef = (id: string): string => `document.getElementById(${JSON.stringify(id)})._tp`;

/** data-init des Roots: Runtime erzeugen und starten */
export function buildInitHandler(id: string, config: TimePickerRuntimeConfig): string {
  const s = timePickerSignals(id);

  return [
    `el._tp = (${TIME_PICKER_RUNTIME})(el, ${toSafeJsLiteral(config)}, () => ${s.signal("value")}, v => { ${s.set("value", "v")} }, () => ${s.signal("open")}, v => { ${s.set("open", "v")} })`,
    "el._tp.init()",
  ].join("; ");
}

/**
 * Handler für onValueChange und onOpenChange: läuft einmal je Änderung, nicht beim ersten Durchlauf.
 * Die Expression des Nutzers steht im Komma-Zweig, mehrere Ausdrücke mit dem Komma-Operator verbinden.
 */
export function buildChangeHandler(signalRef: string, lastKey: string, handler: string): string {
  const last = `el.${lastKey}`;

  return `${last} === undefined ? (${last} = ${signalRef}) : (${signalRef} !== ${last} ? (${last} = ${signalRef}, ${handler}) : null)`;
}

/** data-effect des Roots: Anzeige synchronisieren (Segmente, Spalten, Popover) und Änderungs-Handler ausführen */
export function buildSyncEffect(id: string, onValueChange?: string, onOpenChange?: string): string {
  const s = timePickerSignals(id);
  const statements = [s.signal("value"), s.signal("open"), "el._tp && el._tp.sync()"];

  if (onValueChange) statements.push(buildChangeHandler(s.signal("value"), "_tpLastValue", onValueChange));
  if (onOpenChange) statements.push(buildChangeHandler(s.signal("open"), "_tpLastOpen", onOpenChange));

  return statements.join("; ");
}

/** Handler der Segment-Inputs */
export function buildInputHandlers(id: string): Record<string, string> {
  const tp = timePickerRef(id);

  return {
    "data-on:focus": `${tp}.focus(el)`,
    "data-on:blur": `${tp}.blur(el)`,
    "data-on:input": `${tp}.input(el)`,
    "data-on:click": `${tp}.click(el)`,
    "data-on:keydown": `${tp}.key(el, evt)`,
  };
}

/** Handler der Eingabegruppe */
export function buildInputGroupHandlers(id: string): Record<string, string> {
  const tp = timePickerRef(id);

  return {
    "data-on:pointerdown": `${tp}.groupDown(evt)`,
    "data-on:click": `${tp}.groupClick(evt)`,
  };
}

/** Handler des Triggers */
export function buildTriggerHandlers(id: string): Record<string, string> {
  return {
    "data-on:click": `${timePickerRef(id)}.toggle(evt)`,
    "data-attr:aria-expanded": `${timePickerSignals(id).signal("open")} ? 'true' : 'false'`,
    "data-attr:data-state": `${timePickerSignals(id).signal("open")} ? 'open' : 'closed'`,
  };
}

/** Handler und Zustands-Attribute des Inhalts (Popover mit manueller Steuerung) */
export function buildContentHandlers(id: string): Record<string, string> {
  const tp = timePickerRef(id);
  const open = timePickerSignals(id).signal("open");

  return {
    "data-attr:data-open": open,
    "data-attr:data-closed": `!${open}`,
    "data-on:click__outside": `${tp}.outside(evt)`,
    "data-on:keydown__window": `${tp}.esc(evt)`,
  };
}

/** Handler einer Spalte (Delegation: die Items entstehen erst in der Runtime) */
export function buildColumnHandlers(id: string): Record<string, string> {
  const tp = timePickerRef(id);

  return {
    "data-on:click": `${tp}.itemClick(evt)`,
    "data-on:keydown": `${tp}.itemKey(evt)`,
  };
}

/** Handler des Clear-Buttons */
export function buildClearHandlers(id: string): Record<string, string> {
  return { "data-on:click": `${timePickerRef(id)}.clear(evt)` };
}

/** Standard-Attribute der Teilkomponenten: data-slot kommt über withSlot */
export const timePickerSlots = {
  root: "time-picker",
  label: "time-picker-label",
  inputGroup: "time-picker-input-group",
  input: "time-picker-input",
  trigger: "time-picker-trigger",
  content: "time-picker-content",
  hour: "time-picker-hour",
  minute: "time-picker-minute",
  second: "time-picker-second",
  period: "time-picker-period",
  separator: "time-picker-separator",
  clear: "time-picker-clear",
} as const;
