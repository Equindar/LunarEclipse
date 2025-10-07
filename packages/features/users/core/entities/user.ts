import InitializedUserStatus from "../InitializedUserStatus";
import { UserStatus } from "../userStatus";

interface UserProps {
  name: string;
  uuid: string;
}

export class User implements UserProps {
  // private status: UserStatus;
  name: string;
  uuid: string;

  constructor(name: string, uuid: string) {
    // this.status = new InitializedUserStatus(this);
    this.name = name;
    this.uuid = uuid;
  }

  // public setStatus(status: UserStatus): void {
  //   this.status = status;
  // }

  // public getStatus(): string {
  //   return this.status.constructor.name;
  // }
}
