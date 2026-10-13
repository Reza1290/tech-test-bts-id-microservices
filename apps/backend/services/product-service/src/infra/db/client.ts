import pg from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema.js';

export type Database = NodePgDatabase<typeof schema>;

export interface DatabaseConnectionOptions {
  connectionString?: string;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
}

export const createDatabaseClient = (options: DatabaseConnectionOptions): { db: Database; pool: pg.Pool } => {
  const pool = new pg.Pool(
    options.connectionString
      ? { connectionString: options.connectionString }
      : {
          host: options.host ?? 'localhost',
          port: options.port ?? 5432,
          user: options.user ?? 'postgres',
          password: options.password ?? 'postgres',
          database: options.database ?? 'bts_products',
        },
  );

  const db = drizzle(pool, { schema });
  return { db, pool };
};
