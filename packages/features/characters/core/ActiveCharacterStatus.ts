import ArchivedCharacterStatus from "./ArchivedCharacterStatus";
import BlockedCharacterStatus from "./BlockedCharacterStatus";
import Character from "./entities/Character";
import { CharacterStatus } from "./interfaces/characterStatus";

export default class ActiveCharacterStatus implements CharacterStatus {
  constructor() { }

  init(character: Character): void {
    throw new Error("Blocked Character cant get initialized.");
  }
  activate(character: Character): void {
    throw new Error("Character is already active.");
  }
  block(character: Character): void {
    character.setStatus(new BlockedCharacterStatus());
  }
  archive(character: Character): void {
    character.setStatus(new ArchivedCharacterStatus());
  }
}
