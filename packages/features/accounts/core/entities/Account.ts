import Character from "@features/characters/core/entities/Character";
import { User } from "@features/users/core/entities/User";
import { ULID, ulid } from "ulid";

type AccountStatus = "init" | "active" | "inactive" | "locked";

interface AccountProps {
  uuid: ULID;
  status: AccountStatus;
  owner: User | undefined;
  users: User[] | undefined;
  characters: Character[] | undefined;
}

export default class Account implements AccountProps {
  id: number = 0;
  uuid: ULID = ulid();
  status: AccountStatus;
  owner: User | undefined;
  users: User[] = [];
  characters: Character[] = [];

  constructor(status: AccountStatus = "init", owner?: User, id?: number) {
    this.status = status;
    this.id = id ?? this.id;
  }

  public setStatus(status: AccountStatus): void {
    this.status = status;
  }

  public getStatus(): AccountStatus {
    return this.status;
  }
}
