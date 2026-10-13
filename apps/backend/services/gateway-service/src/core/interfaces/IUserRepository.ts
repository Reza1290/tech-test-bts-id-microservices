import type { User } from '../../domain/entities/User.js';

export interface CreateUserData {
  username: string;
  password_hash: string;
}

export interface IUserRepository {
  findByUsername(username: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
}
