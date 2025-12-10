import UserStatus from "./interfaces/userStatus";

export default class ArchivedUserStatus extends UserStatus {
  public setDisplayName(name: string): void {
    throw new Error("Method not implemented.");
  }
  public doAction(): void {
    throw new Error("Method not implemented.");
  }
}
