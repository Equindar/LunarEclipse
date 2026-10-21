type Prop<T> = Extract<keyof T, string>;



export interface StateAction {
  condition: string;
  actions: readonly string[];
}



export class SignalManager<T extends object> {
  /** ID mit "-" → "_" (damit sie als JS-Identifier nach "$" funktioniert) */
  readonly id: string;
  /** Wert für das data-signals-Attribut: {"<id>": {...signals}} */
  readonly dataSignals: string;

  constructor(
    id: string,
    readonly signals: T
  ) {
    this.id = id.replaceAll("-", "_");
    this.dataSignals = JSON.stringify({ [this.id]: signals });
  }

  signal(property: Prop<T>): string {
    return `$${this.id}.${property}`;
  }

  toggle(property: Prop<T>): string {
    const ref = this.signal(property);
    return `${ref} = !${ref}`;
  }

  set(property: Prop<T>, value: string): string {
    return `${this.signal(property)} = ${value}`;
  }

  setString(property: Prop<T>, value: string): string {
    return `${this.signal(property)} = '${value}'`;
  }

  conditional(property: Prop<T>, trueValue: string, falseValue: string): string {
    return `${this.signal(property)} ? ${trueValue} : ${falseValue}`;
  }

  conditionalAction(condition: string, property: Prop<T>, value: string): string {
    return `${condition} ? (${this.set(property, value)}) : void 0`;
  }

  conditionalMultiAction(condition: string, ...actions: string[]): string {
    if (actions.length === 0) return "";
    return `${condition} ? (${actions.join(", ")}) : void 0`;
  }

  multiStateConditional(states: readonly StateAction[]): string {
    if (states.length === 0) return "";

    let result = "";
    states.forEach((state, i) => {
      if (i > 0) result += " : ";

      const actionsStr = state.actions.join(", ");
      const isLast = i === states.length - 1;

      if (isLast && state.condition === "true") {
        result += state.actions.length === 1 ? actionsStr : `(${actionsStr})`;
      } else if (state.actions.length === 1) {
        result += `${state.condition} ? ${actionsStr}`;
      } else {
        result += `${state.condition} ? (${actionsStr})`;
      }
    });
    return result;
  }

  dataClass(classConditions: Record<string, string>): string {
    const entries = Object.entries(classConditions);
    if (entries.length === 0) return "{}";

    const parts = entries.map(
      ([className, condition]) => `'${className.replaceAll("'", "\\'")}': ${condition}`
    );
    return `{${parts.join(", ")}}`;
  }

  equals(property: Prop<T>, value: string): string {
    return `${this.signal(property)} === '${value}'`;
  }

  notEquals(property: Prop<T>, value: string): string {
    return `${this.signal(property)} !== '${value}'`;
  }

  ternaryClass(property: Prop<T>, trueClass: string, falseClass: string): string {
    return `${this.signal(property)} ? '${trueClass}' : '${falseClass}'`;
  }

  ternaryStyle(property: Prop<T>, trueStyle: string, falseStyle: string): string {
    return `${this.signal(property)} ? '${trueStyle}' : '${falseStyle}'`;
  }
}


export function createSignals<T extends object>(id: string, signals: T): SignalManager<T> {
  return new SignalManager(id, signals);
}
