
import ActiveCharacterStatus from "./ActiveCharacterStatus";
import ArchivedCharacterStatus from "./ArchivedCharacterStatus";
import Character from "./entities/Character";
import { CharacterStatus } from "./interfaces/characterStatus";

export default class BlockedCharacterStatus implements CharacterStatus {
    constructor(private character: Character) { }

    init(): void {
        throw new Error("Blocked Character cant get initialized.");
    }
    activate(): void {
        this.character.setStatus(new ActiveCharacterStatus(this.character));
    }
    block(): void {
        throw new Error("Character is already blocked.");
    }
    archive(): void {
        this.character.setStatus(new ArchivedCharacterStatus(this.character));
    }
}