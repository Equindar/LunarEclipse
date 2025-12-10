
import ActiveCharacterStatus from "./ActiveCharacterStatus";
import Character from "./entities/Character";
import { CharacterStatus } from "./interfaces/characterStatus";

export default class ArchivedCharacterStatus implements CharacterStatus {
  constructor() { }

  init(character: Character): void {
    throw new Error("Blocked Character cant get initialized.");
  }
  activate(character: Character): void {
    character.setStatus(new ActiveCharacterStatus());
  }
  block(character: Character): void {
    throw new Error("Archived Character cannot become blocked.");
  }
  archive(character: Character): void {
    throw new Error("Character is already archived.");
  }
}
