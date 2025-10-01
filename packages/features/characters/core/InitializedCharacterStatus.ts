import ActiveCharacterStatus from "./ActiveCharacterStatus";
import ArchivedCharacterStatus from "./ArchivedCharacterStatus";
import BlockedCharacterStatus from "./BlockedCharacterStatus";
import Character from "./entities/Character";
import { CharacterStatus } from "./interfaces/characterStatus";

export default class InitializedCharacterStatus implements CharacterStatus {
    constructor(private character: Character) { }

    init(): void {
        throw new Error("Character is already initialized.");
    }
    activate(): void {
        this.character.setStatus(new ActiveCharacterStatus(this.character));
    }
    block(): void {
        this.character.setStatus(new BlockedCharacterStatus(this.character));
    }
    archive(): void {
        this.character.setStatus(new ArchivedCharacterStatus(this.character));
    }
}