import { UserID } from '../value-objects/UserID';
import { Email } from '../value-objects/Email';

export class User {
  private constructor(
    public readonly uuid: UserID,
    public readonly name: string,
    public readonly email: Email,
    public readonly createdAt: Date,
  ) { }

  static create(props: { uuid: UserID; name: string; email: Email }): User {
    return new User(
      props.uuid,
      props.name,
      props.email,
      new Date()
    );
  }
}
