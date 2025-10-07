import ActiveUserStatus from "./ActiveUserStatus";
import { User } from "./entities/user";
import { UserStatus } from "./userStatus";

export default class ArchivedUserStatus implements UserStatus {
    constructor(private user: User) { }

    init(): void {
        throw new Error("Blocked User cant get initialized.");
    }
    activate(): void {
        this.user.setStatus(new ActiveUserStatus(this.user));
    }
    block(): void {
        throw new Error("Archived User cannot become blocked.");
    }
    archive(): void {
        throw new Error("User is already archived.");
    }
}