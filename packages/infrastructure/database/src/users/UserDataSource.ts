import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { users } from '../../drizzle/migrations/schema.js';

export type UserRow = InferSelectModel<typeof users>;

export type NewUserRow = InferInsertModel<typeof users>;

export interface UserDataSource {
  insert(row: NewUserRow): Promise<boolean>;
  findAll(): Promise<UserRow[]>;
  findById(id: number): Promise<UserRow | null>;
  findByPId(pId: string): Promise<UserRow | null>;
  updateById(id: number, row: Partial<NewUserRow>): Promise<UserRow>;
}
