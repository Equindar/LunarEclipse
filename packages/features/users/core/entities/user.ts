import { ULID, ulid } from "ulid";
import BlockedUserStatus from "../BlockedUserStatus";
import UserStatus from "../interfaces/userStatus";
import InitializedUserStatus from "../InitializedUserStatus";

export class User {
  id?: number;

  private constructor(
    readonly uuid: ULID,
    readonly name: string,
    private status: UserStatus,
    readonly createdDate: Date
  ) { }

  static register(nickname: string): User {
    return new User(
      ulid(),
      nickname,
      new InitializedUserStatus(),
      new Date()
    );
  }

  static get(id: number, uuid: ULID, nickname: string, createdDate: Date): User {
    const user = new User(
      uuid,
      nickname,
      new InitializedUserStatus(),
      createdDate
    );
    user.id = id;
    return user;
  }

  static edit(id: number, uuid: ULID, nickname: string, createdDate: Date): User {
    const user = new User(
      ulid(),
      nickname,
      new InitializedUserStatus(),
      new Date()
    );
    user.id = id;
    return user;
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
