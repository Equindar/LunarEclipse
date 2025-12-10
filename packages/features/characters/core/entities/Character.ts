import { CharacterStatus } from "../interfaces/characterStatus";
import InitializedCharacterStatus from "../InitializedCharacterStatus";
import { User } from "@features/users/core/entities/User";
import { ULID, ulid } from "ulid";

interface CharacterProps {
  name: string;
  status: CharacterStatus;
  owner: User;
  experience: number;
}

export default class Character implements CharacterProps {
  id: number = 0;
  uuid: ULID = ulid();
  experience: number = 0;
  name: string;
  status: CharacterStatus = new InitializedCharacterStatus();
  owner: User;

  constructor(name: string, status: CharacterStatus, owner: User, exp?: number, id?: number, uuid?: string) {
    this.name = name;
    this.experience = exp ?? this.experience;
    this.owner = owner;
    this.status = status;
    this.id = id ?? this.id;
    this.uuid = uuid ?? this.uuid;

  }

  public setStatus(status: CharacterStatus): void {
    this.status = status;
  }

  public getStatus(): string {
    return this.status.constructor.name;
  }
}
