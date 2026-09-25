export interface IdGenerator<TId extends string = string> {
  generate(): TId;
}
