// Rekursive Variante von Partial, um verschachtelte Objekte zuzulassen
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>
} : T;
