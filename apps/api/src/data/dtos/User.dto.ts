import { User } from "@features/users/core/entities/User";
import { ULID } from "ulid";

export default class UserDTO {
  uuid: string;
  nickname: string;
  status: string;

  constructor(user: User) {
    this.uuid = user.uuid;
    this.nickname = user.name;
    this.status = user.getStatus().name;
  }

  static fromEntity(user: User): UserDTO {
    return new UserDTO(user);
  }
}

export interface CreateUserDTO {
  nickname: string;
}

export interface GetUserDTO {
  uuid: ULID;
  test: string;
}

export interface UpdateUserDTO {
  nickname: string;
}
