import UserStatus from "./interfaces/userStatus";

export default class BlockedUserStatus extends UserStatus {
  public setDisplayName(name: string): void {
    throw new Error("Blocked User: Cannot set DisplayName.");
  }
  public doAction(): void {
    throw new Error("Blocked User: Action forbidden.");
  }
}
