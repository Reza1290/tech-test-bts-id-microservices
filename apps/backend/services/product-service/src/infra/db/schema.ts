import { pgTable, serial, varchar, numeric, text, jsonb } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  price: numeric('price', { precision: 12, scale: 2 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }).notNull(),
  images: jsonb('images').$type<string[]>().notNull(),
  created_at: varchar('created_at', { length: 30 }).notNull(),
  created_by: varchar('created_by', { length: 100 }).notNull(),
  created_by_id: varchar('created_by_id', { length: 50 }).notNull(),
  updated_at: varchar('updated_at', { length: 30 }).notNull(),
  updated_by: varchar('updated_by', { length: 100 }).notNull(),
  updated_by_id: varchar('updated_by_id', { length: 50 }).notNull(),
});

export type ProductSelect = typeof products.$inferSelect;
export type ProductInsert = typeof products.$inferInsert;
