import { createSignals } from "../../utils/SignalManager";
import type { StepperArgs, StepperDataState, StepperSignals } from "./Stepper.types";

/**
 * Datastar-Expressions und Bausteine des Steppers.
 * Interne Datei: wird bewusst nicht über index.ts exportiert.
 *
 * Aufbau: Der Root hält den Zustand (Signale) und lauscht auf das Event "stepper-go".
 * Trigger, Zurück und Weiter melden nur den gewünschten Zielschritt per Event. Der Root
 * validiert, setzt das Signal und ruft onValueChange auf. Das ersetzt den Store des React-Originals.
 */

export const DEFAULT_ORIENTATION = "horizontal";
export const DEFAULT_ACTIVATION_MODE = "automatic";

/** Name des Events, mit dem Teile einen Schrittwechsel beim Root anfragen */
export const GO_EVENT = "stepper-go";

/** Leerer Signal-State (für Teilkomponenten zählt nur der Signal-Name, nicht der Inhalt) */
export const stepperEmptySignals: StepperSignals = {
  value: "",
  steps: [],
  completed: [],
  disabledSteps: [],
  disabled: false,
};

/** Signal-Manager eines Steppers (Signal-Name = ID mit "-" → "_") */
export const stepperSignals = (id: string, initial: StepperSignals = stepperEmptySignals) =>
  createSignals<StepperSignals>(id, initial);

/**
 * Initialer Signal-State aus den Root-Args.
 * Doppelte Schrittwerte: Reihenfolge des ersten Auftretens, die späteren Angaben gewinnen (wie Map.set).
 */
export function buildInitialSignals(args: Pick<StepperArgs, "steps" | "value" | "defaultValue" | "disabled">): StepperSignals {
  const steps = new Map<string, { completed: boolean; disabled: boolean }>();
  for (const step of args.steps) {
    steps.set(step.value, { completed: step.completed ?? false, disabled: step.disabled ?? false });
  }
  const values = [...steps.keys()];

  return {
    value: args.value ?? args.defaultValue ?? "",
    steps: values,
    completed: values.filter((value) => steps.get(value)?.completed),
    disabledSteps: values.filter((value) => steps.get(value)?.disabled),
    disabled: args.disabled ?? false,
  };
}

/** Zufällige ID: "stepper_<8 Hex-Zeichen>" */
export function generateStepperId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return `stepper_${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

/** IDs der Teile eines Schritts (die originale ID mit Bindestrich gilt für DOM-Zugriffe) */
export function getStepperPartId(id: string, variant: "trigger" | "content" | "title" | "description", value: string): string {
  return `${id}-${variant}-${value}`;
}

/** JS-String-Literal (Anführungszeichen im Wert zerbrechen den Ausdruck nicht) */
const literal = (value: string): string => JSON.stringify(value);

/** Root-Element zur Laufzeit (Konfiguration steckt in data-Attributen des Roots) */
const rootElement = (id: string): string => `document.getElementById(${literal(id)})`;

/** Ausdruck: Stepper ist rein anzeigend (nonInteractive) */
const isNonInteractive = (id: string): string => `${rootElement(id)}.hasAttribute('data-non-interactive')`;

/** Event an den Root senden; liefert false, wenn der Root den Wechsel abgelehnt hat (Validierung) */
function dispatchGo(valueExpression: string, validateExpression: string): string {
  return `el.dispatchEvent(new CustomEvent(${literal(GO_EVENT)}, { bubbles: true, cancelable: true, detail: { value: ${valueExpression}, validate: ${validateExpression} } }))`;
}

/**
 * Ausdruck für data-state eines Schritts (Port von getDataState).
 * Beim Separator gilt der aktive Schritt als "inactive" (die Linie dahinter ist noch nicht gefüllt).
 */
export function buildStateExpression(id: string, value: string, variant: "item" | "separator" = "item"): string {
  const s = stepperSignals(id);
  const current = s.signal("value");
  const steps = s.signal("steps");
  const v = literal(value);
  const activeState: StepperDataState = variant === "separator" ? "inactive" : "active";

  return `${s.signal("completed")}.includes(${v}) ? 'completed' : ${current} === ${v} ? '${activeState}' : ${current} && ${steps}.indexOf(${current}) > ${steps}.indexOf(${v}) ? 'completed' : 'inactive'`;
}

/** Ausdruck (Boolean): Schritt ist abgeschlossen */
export function buildIsCompletedExpression(id: string, value: string): string {
  return `(${buildStateExpression(id, value)}) === 'completed'`;
}

/** Ausdruck (Boolean): Schritt ist aktiv */
export function buildIsActiveExpression(id: string, value: string): string {
  return `${stepperSignals(id).signal("value")} === ${literal(value)}`;
}

/** Ausdruck (Zahl): 1-basierte Position des Schritts */
export function buildPositionExpression(id: string, value: string): string {
  return `${stepperSignals(id).signal("steps")}.indexOf(${literal(value)}) + 1`;
}

/** Ausdruck (Boolean): Schritt ist der letzte (der Separator entfällt dann) */
export function buildIsNotLastExpression(id: string, value: string): string {
  const steps = stepperSignals(id).signal("steps");
  return `${steps}.indexOf(${literal(value)}) !== ${steps}.length - 1`;
}

/** Ausdruck (Boolean): Trigger ist deaktiviert (Root, Schritt) */
export function buildTriggerDisabledExpression(id: string, value: string): string {
  const s = stepperSignals(id);
  return `${s.signal("disabled")} || ${s.signal("disabledSteps")}.includes(${literal(value)})`;
}

/** Ausdruck (Boolean): Schritt ist über die Signale deaktiviert (data-disabled am Item) */
export function buildItemDisabledExpression(id: string, value: string): string {
  const s = stepperSignals(id);
  return `${s.signal("disabledSteps")}.includes(${literal(value)})`;
}

/**
 * Ausdruck (Text): tabindex des Triggers (roving tabindex).
 * Tab-Stop ist der aktive Schritt; ist keiner aktiv, der erste Schritt.
 */
export function buildTabIndexExpression(id: string, value: string): string {
  const s = stepperSignals(id);
  const v = literal(value);
  const current = s.signal("value");
  const steps = s.signal("steps");
  return `(${current} === ${v} || (${steps}.indexOf(${current}) === -1 && ${steps}[0] === ${v})) ? '0' : '-1'`;
}

/**
 * Handler am Root für das Event "stepper-go".
 * Ablauf: validieren (falls gewünscht), bei Änderung Signal setzen, onValueChange ausführen.
 * Wird der Wechsel abgelehnt, ruft der Handler evt.preventDefault() auf (dispatchEvent liefert dann false).
 */
export function buildNavigateHandler(id: string, onValidate?: string, onValueChange?: string): string {
  const s = stepperSignals(id);
  const target = "evt.detail.value";
  const direction = `(${s.signal("steps")}.indexOf(${target}) > ${s.signal("steps")}.indexOf(${s.signal("value")}) ? 'next' : 'prev')`;

  const isValid = onValidate
    ? `(!evt.detail.validate || ((value, direction) => (${onValidate}))(${target}, ${direction}))`
    : "true";

  const change = onValueChange ? `, ((value) => { ${onValueChange}; })(${target})` : "";
  // Gleicher Wert: nichts tun (wie Object.is-Prüfung im Original)
  const apply = `${s.signal("value")} === ${target} ? void 0 : (${s.set("value", target)}${change})`;

  return `${isValid} ? (${apply}) : evt.preventDefault()`;
}

/** Klick auf den Trigger: Wechsel zum Schritt anfragen (Validierung in beide Richtungen) */
export function buildTriggerClickHandler(id: string, value: string): string {
  return `!${isNonInteractive(id)} ? ${dispatchGo(literal(value), "true")} : void 0`;
}

/** mousedown: Merker, damit der folgende Fokus nicht als Tastaturfokus gilt */
export function buildTriggerMouseDownHandler(): string {
  return "el.stepperMouse = true";
}

/** Fokus per Tastatur aktiviert den Schritt (nur im Modus "automatic" und nicht bei nonInteractive) */
export function buildTriggerFocusHandler(id: string, value: string): string {
  const root = rootElement(id);
  const s = stepperSignals(id);
  const condition = [
    "!mouse",
    `${root}.dataset.activationMode !== 'manual'`,
    `!${isNonInteractive(id)}`,
    `${s.signal("value")} !== ${literal(value)}`,
  ].join(" && ");

  return `((mouse) => (el.stepperMouse = false, ${condition} ? ${dispatchGo(literal(value), "true")} : void 0))(!!el.stepperMouse)`;
}

/**
 * Tastatur am Trigger: Enter/Leertaste (manuell), Pfeile, Home/End, PageUp/PageDown.
 * Port von onKeyDown und getFocusIntent. Pfeil nach vorn validiert, Pfeil zurück nicht.
 */
export function buildTriggerKeydownHandler(id: string): string {
  const s = stepperSignals(id);
  const current = s.signal("value");
  const steps = s.signal("steps");

  const body = [
    "if (evt.key === 'Enter' && root.hasAttribute('data-non-interactive')) { evt.preventDefault(); return; }",
    "if ((evt.key === 'Enter' || evt.key === ' ') && root.dataset.activationMode === 'manual' && !root.hasAttribute('data-non-interactive')) { evt.preventDefault(); el.click(); return; }",
    "if (evt.target !== el) return;",
    "const rtl = getComputedStyle(root).direction === 'rtl';",
    "const key = rtl ? ({ ArrowLeft: 'ArrowRight', ArrowRight: 'ArrowLeft' }[evt.key] ?? evt.key) : evt.key;",
    "const orientation = root.dataset.orientation;",
    "if ((orientation === 'horizontal' && (key === 'ArrowUp' || key === 'ArrowDown')) || (orientation === 'vertical' && (key === 'ArrowLeft' || key === 'ArrowRight'))) return;",
    "const intent = ({ ArrowLeft: 'prev', ArrowUp: 'prev', ArrowRight: 'next', ArrowDown: 'next', PageUp: 'first', Home: 'first', PageDown: 'last', End: 'last' })[key];",
    "if (!intent || evt.metaKey || evt.ctrlKey || evt.altKey || evt.shiftKey) return;",
    "evt.preventDefault();",
    "let items = Array.from(root.querySelectorAll('[data-slot=\"stepper-trigger\"]')).filter((trigger) => !trigger.disabled && trigger.closest('[data-slot=\"stepper\"]') === root);",
    "if (intent === 'last') { items.reverse(); }",
    "else if (intent === 'prev' || intent === 'next') {",
    "if (intent === 'prev') items.reverse();",
    "const index = items.indexOf(el);",
    "items = root.hasAttribute('data-loop') ? items.slice(index + 1).concat(items.slice(0, index + 1)) : items.slice(index + 1);",
    "}",
    "const next = items[0];",
    "if (!next) return;",
    "const target = next.dataset.step;",
    `if (root.dataset.activationMode !== 'manual' && !root.hasAttribute('data-non-interactive') && target !== ${current}) {`,
    `const forward = ${steps}.indexOf(target) > ${steps}.indexOf(${current});`,
    `if (!${dispatchGo("target", "forward")}) return;`,
    "}",
    "next.focus();",
  ].join(" ");

  return `((root) => { ${body} })(${rootElement(id)})`;
}

/** Zurück: ein Schritt nach vorn in der Liste, ohne Validierung */
export function buildPrevClickHandler(id: string): string {
  const s = stepperSignals(id);
  const steps = s.signal("steps");
  const target = `${steps}[Math.max(${steps}.indexOf(${s.signal("value")}) - 1, 0)]`;
  return `${target} ? ${dispatchGo(target, "false")} : void 0`;
}

/** Weiter: ein Schritt weiter, mit Validierung */
export function buildNextClickHandler(id: string): string {
  const s = stepperSignals(id);
  const steps = s.signal("steps");
  const target = `${steps}[Math.min(${steps}.indexOf(${s.signal("value")}) + 1, ${steps}.length - 1)]`;
  return `${target} ? ${dispatchGo(target, "true")} : void 0`;
}

/** Ausdruck (Boolean): Zurück ist deaktiviert (erster oder kein Schritt aktiv) */
export function buildPrevDisabledExpression(id: string): string {
  const s = stepperSignals(id);
  return `${s.signal("steps")}.indexOf(${s.signal("value")}) <= 0`;
}

/** Ausdruck (Boolean): Weiter ist deaktiviert (letzter Schritt aktiv) */
export function buildNextDisabledExpression(id: string): string {
  const s = stepperSignals(id);
  return `${s.signal("steps")}.indexOf(${s.signal("value")}) >= ${s.signal("steps")}.length - 1`;
}
