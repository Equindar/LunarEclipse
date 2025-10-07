import ActiveUserStatus from "./ActiveUserStatus";
import ArchivedUserStatus from "./ArchivedUserStatus";
import { User } from "./entities/user";
import { UserStatus } from "./userStatus";

export default class BlockedUserStatus implements UserStatus {
    constructor(private user: User) { }

    init(): void {
        throw new Error("Blocked User cant get initialized.");
    }
    activate(): void {
        this.user.setStatus(new ActiveUserStatus(this.user));
    }
    block(): void {
        throw new Error("User is already blocked.");
    }
    archive(): void {
        this.user.setStatus(new ArchivedUserStatus(this.user));
    }
}