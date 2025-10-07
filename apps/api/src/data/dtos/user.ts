import { User } from "@features/users/core/entities/user";

export class UserDTO {
    id: string;
    nickname: string

    constructor(user: User) {
        this.id = user.uuid;
        this.nickname = user.name;
    }

    static fromEntity(user: User): UserDTO {
        return new UserDTO(user);
    }
}