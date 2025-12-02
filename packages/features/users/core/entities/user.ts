import { ULID, ulid } from "ulid";
import BlockedUserStatus from "../BlockedUserStatus";
import UserStatus from "../interfaces/userStatus";

export class User {
  id: number;
  name: string;
  uuid: ULID = ulid();
  private status!: UserStatus;

  constructor(id: number, name: string, status: UserStatus, uuid?: string) {
    this.name = name;
    this.uuid = uuid ?? this.uuid;
    this.id = id;
    this.setStatus(status);
  }

  public setStatus(status: UserStatus): void {
    console.log(`User: setStatus to ${(<any>status).constructor.name}.`);
    this.status = status;
    this.status.setUser(this);
  }

  public getStatus(): UserStatus {
    return this.status;
  }

  public isBlocked(): boolean {
    return this.getStatus instanceof BlockedUserStatus;
  }
}
