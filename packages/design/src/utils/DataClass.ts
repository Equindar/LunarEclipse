export class DataClass {
  private readonly classes = new Map<string, string>();

  add(className: string, condition: string): this {
    this.classes.set(className, condition);
    return this;
  }

  build(): string {
    if (this.classes.size === 0) return "{}";
    const parts = [...this.classes].map(([className, condition]) => `'${className}': ${condition}`);
    return `{${parts.join(", ")}}`;
  }
}

export const newDataClass = (): DataClass => new DataClass();
