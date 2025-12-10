import UserStatus from "./interfaces/userStatus";

export default class InitializedUserStatus extends UserStatus {

  constructor() {
    super();
    this.name = "initialized";
  }

  public setDisplayName(name: string): void {
    this.user.name = name;
  }

  public doAction(): void {
    console.log("doAction");
  }


}
