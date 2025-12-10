import { User } from "../entities/User";

abstract class UserStatus {
  protected user!: User;
  public name: string = "unbekannt";

  public setUser(user: User) {
    this.user = user;
  }

  public abstract setDisplayName(name: string): void;
  public abstract doAction(): void;
}

export default UserStatus;
