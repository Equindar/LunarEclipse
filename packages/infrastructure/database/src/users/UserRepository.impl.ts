import { User, UserRepository } from '@lunareclipse/features/users';
import type { UserDataSource } from './UserDataSource.interface.js';
import { toDomain, toRow } from './UserMapper.js';

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly dataSource: UserDataSource) { }

  async create(subject: User): Promise<boolean> {
    return this.dataSource.insert(toRow(subject));
  }

  async list(): Promise<User[]> {
    const rows = await this.dataSource.findAll();
    return rows.map(toDomain);
  }

  async getById(id: number): Promise<User | null> {
    const row = await this.dataSource.findById(id);
    return row ? toDomain(row) : null;
  }

  async getByUuid(uuid: User['uuid']): Promise<User | null> {
    throw new Error('Method not implemented.');
  }

  async update(subject: User): Promise<User> {
    if (subject.id === null) throw new Error('Cannot update user without id');
    const row = await this.dataSource.updateById(subject.id, toRow(subject));
    return toDomain(row);
  }
}
