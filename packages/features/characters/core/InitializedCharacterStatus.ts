import ActiveCharacterStatus from "./ActiveCharacterStatus";
import ArchivedCharacterStatus from "./ArchivedCharacterStatus";
import BlockedCharacterStatus from "./BlockedCharacterStatus";
import Character from "./entities/Character";
import { CharacterStatus } from "./interfaces/characterStatus";

export default class InitializedCharacterStatus implements CharacterStatus {
  constructor() {

  }

  init(character: Character): void {
    throw new Error("Character is already initialized.");
  }
  activate(character: Character): void {
    character.setStatus(new ActiveCharacterStatus());
  }
  block(character: Character): void {
    character.setStatus(new BlockedCharacterStatus());
  }
  archive(character: Character): void {
    character.setStatus(new ArchivedCharacterStatus());
  }
}
