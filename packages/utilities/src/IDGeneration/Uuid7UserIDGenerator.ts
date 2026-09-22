import { randomUUID } from 'node:crypto';
import { type UserID, asUserID } from "@lunareclipse/features/users";
import { IdGenerator } from "./IdGenerator";

export class Uuid7UserIDGenerator implements IdGenerator<UserID> {
  generate(): UserID {
    return asUserID(randomUUID());
  }
}
