import ArchivedCharacterStatus from "./ArchivedCharacterStatus";
import BlockedCharacterStatus from "./BlockedCharacterStatus";
import Character from "./entities/Character";
import { CharacterStatus } from "./interfaces/characterStatus";

export default class ActiveCharacterStatus implements CharacterStatus {
    constructor(private character: Character) { }

    init(): void {
        throw new Error("Blocked Character cant get initialized.");
    }
    activate(): void {
        throw new Error("Character is already active.");
    }
    block(): void {
        this.character.setStatus(new BlockedCharacterStatus(this.character));
    }
    archive(): void {
        this.character.setStatus(new ArchivedCharacterStatus(this.character));
    }
}