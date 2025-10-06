import { User } from "@features/users/core/user";
import { CharacterStatus } from "../interfaces/characterStatus";
import InitializedCharacterStatus from "../InitializedCharacterStatus";

interface CharacterProps {
    name: string;
    level: number;
    experience: number;
}

export default class Character {
    name: string = "Char 1";
    // status: CharacterStatus;
    // owner: User;



    // constructor(private props: CharacterProps, owner: User) {
    //     this.name = props.name;
    // this.status = new InitializedCharacterStatus(this);
    // this.owner = owner;
    // }

    // public setStatus(status: CharacterStatus): void {
    //     this.status = status;
    // }

    // public getStatus(): string {
    //     return this.status.constructor.name;
    // }
}