import { User } from "@features/users/core/entities/User";

export class UserDTO {
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
