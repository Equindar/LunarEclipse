
import ActiveCharacterStatus from "./ActiveCharacterStatus";
import Character from "./entities/Character";
import { CharacterStatus } from "./interfaces/characterStatus";

export default class ArchivedCharacterStatus implements CharacterStatus {
    constructor(private character: Character) { }

    init(): void {
        throw new Error("Blocked Character cant get initialized.");
    }
    activate(): void {
        this.character.setStatus(new ActiveCharacterStatus(this.character));
    }
    block(): void {
        throw new Error("Archived Character cannot become blocked.");
    }
    archive(): void {
        throw new Error("Character is already archived.");
    }
}