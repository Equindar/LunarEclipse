export interface CharacterStatus {
  init(character: Character): void;
  activate(character: Character): void;
  block(character: Character): void;
  archive(character: Character): void;
}
