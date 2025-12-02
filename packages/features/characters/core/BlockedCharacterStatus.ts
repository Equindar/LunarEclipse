
import ActiveCharacterStatus from "./ActiveCharacterStatus";
import ArchivedCharacterStatus from "./ArchivedCharacterStatus";
import Character from "./entities/Character";
import { CharacterStatus } from "./interfaces/characterStatus";

export default class BlockedCharacterStatus implements CharacterStatus {
  constructor() { }

  init(character: Character): void {
    throw new Error("Blocked Character cant get initialized.");
  }
  activate(character: Character): void {
    character.setStatus(new ActiveCharacterStatus());
  }
  block(character: Character): void {
    throw new Error("Character is already blocked.");
  }
  archive(character: Character): void {
    character.setStatus(new ArchivedCharacterStatus());
  }
}
