import { eq } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import { users, type UserSelect } from '../db/schema.js';
import { User } from '../../domain/entities/User.js';
import type { IUserRepository, CreateUserData } from '../../core/interfaces/IUserRepository.js';

const toEntity = (row: UserSelect): User =>
  new User({
    id: row.id,
    username: row.username,
    password_hash: row.password_hash,
    created_at: row.created_at,
    updated_at: row.updated_at,
  });

export class PostgresUserRepository implements IUserRepository {
  constructor(private readonly db: Database) {}

  async findByUsername(username: string): Promise<User | null> {
    const rows = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return rows[0] ? toEntity(rows[0]) : null;
  }

  async findById(id: number): Promise<User | null> {
    const rows = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return rows[0] ? toEntity(rows[0]) : null;
  }

  async create(data: CreateUserData): Promise<User> {
    const inserted = await this.db
      .insert(users)
      .values({
        username: data.username,
        password_hash: data.password_hash,
      })
      .returning();
    return toEntity(inserted[0]);
  }
}
