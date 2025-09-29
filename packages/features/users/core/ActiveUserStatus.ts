import ArchivedUserStatus from "./ArchivedUserStatus";
import BlockedUserStatus from "./BlockedUserStatus";
import { User } from "./user";
import { UserStatus } from "./userStatus";

export default class ActiveUserStatus implements UserStatus {
    constructor(private user: User) { }

    init(): void {
        throw new Error("Blocked User cant get initialized.");
    }
    activate(): void {
        throw new Error("User is already active.");
    }
    block(): void {
        this.user.setStatus(new BlockedUserStatus(this.user));
    }
    archive(): void {
        this.user.setStatus(new ArchivedUserStatus(this.user));
    }
}