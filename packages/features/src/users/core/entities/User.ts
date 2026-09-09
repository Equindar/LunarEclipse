import { ULID } from 'ulid';

export class User {
  constructor(
    public readonly id: number | null,
    public readonly uuid: ULID,
    public readonly name: string,
    public readonly email: string,
  ) { }

  static create(props: { uuid: ULID; name: string; email: string }): User {
    return new User(null, props.uuid, props.name, props.email);
  }
}
