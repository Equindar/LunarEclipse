import InitializedUserStatus from "./InitializedUserStatus";
import { UserStatus } from "./userStatus";

export class User {
  private status: UserStatus;

  constructor() {
    this.status = new InitializedUserStatus(this);
  }

  public setStatus(status: UserStatus): void {
    this.status = status;
  }

  public getStatus(): string {
    return this.status.constructor.name;
  }
}
