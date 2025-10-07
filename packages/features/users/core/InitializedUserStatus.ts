import ActiveUserStatus from "./ActiveUserStatus";
import ArchivedUserStatus from "./ArchivedUserStatus";
import BlockedUserStatus from "./BlockedUserStatus";
import { User } from "./entities/user";
import { UserStatus } from "./userStatus";

export default class InitializedUserStatus implements UserStatus {
    constructor(private user: User) { }

    init(): void {
        throw new Error("User is already initialized.");
    }
    activate(): void {
        this.user.setStatus(new ActiveUserStatus(this.user));
    }
    block(): void {
        this.user.setStatus(new BlockedUserStatus(this.user));
    }
    archive(): void {
        this.user.setStatus(new ArchivedUserStatus(this.user));
    }
}