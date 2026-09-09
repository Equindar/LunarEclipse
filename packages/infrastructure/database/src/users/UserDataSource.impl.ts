// packages/infrastructure/database/src/users/UserDataSource.impl.ts
import { and, eq, isNull } from 'drizzle-orm';
import type { Database } from '../client.js';
import { users } from '../../drizzle/migrations/schema.js';
import type { UserDataSource, UserRow, NewUserRow } from './UserDataSource.interface.js';

export class UserDataSourceImpl implements UserDataSource {
  constructor(private readonly db: Database) { }

  async insert(row: NewUserRow): Promise<boolean> {
    const result = await this.db.insert(users).values(row);
    return result[0].affectedRows === 1;
  }

  async findAll(): Promise<UserRow[]> {
    return this.db.select().from(users).where(isNull(users.deletedAt));
  }

  async findById(id: number): Promise<UserRow | null> {
    const [row] = await this.db
      .select()
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deletedAt)));
    return row ?? null;
  }

  async findByPId(pId: string): Promise<UserRow | null> {
    const [row] = await this.db
      .select()
      .from(users)
      .where(and(eq(users.pId, pId), isNull(users.deletedAt)));
    return row ?? null;
  }

  async updateById(id: number, row: Partial<NewUserRow>): Promise<UserRow> {
    await this.db.update(users).set(row).where(eq(users.id, id));
    const updated = await this.findById(id);
    if (!updated) throw new Error(`User ${id} not found after update`);
    return updated;
  }
}
