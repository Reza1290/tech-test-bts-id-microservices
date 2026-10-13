import { eq, ilike, and, sql } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import { products, type ProductSelect } from '../db/schema.js';
import { Product } from '../../domain/entities/Product.js';
import type {
  IProductRepository,
  FindProductsParams,
  FindProductsResult,
  CreateProductData,
  UpdateProductData,
} from '../../core/interfaces/IProductRepository.js';

const toEntity = (row: ProductSelect): Product =>
  new Product({
    id: row.id,
    title: row.title,
    price: Number(row.price),
    description: row.description ?? '',
    category: row.category,
    images: Array.isArray(row.images) ? row.images : [],
    created_at: row.created_at,
    created_by: row.created_by,
    created_by_id: row.created_by_id,
    updated_at: row.updated_at,
    updated_by: row.updated_by,
    updated_by_id: row.updated_by_id,
  });

export class PostgresProductRepository implements IProductRepository {
  constructor(private readonly db: Database) {}

  async findAll(params: FindProductsParams): Promise<FindProductsResult> {
    const conditions = [];
    if (params.search) {
      conditions.push(ilike(products.title, `%${params.search}%`));
    }
    if (params.category) {
      conditions.push(eq(products.category, params.category));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (params.page - 1) * params.limit;

    const rows = await this.db
      .select()
      .from(products)
      .where(whereClause)
      .limit(params.limit)
      .offset(offset)
      .orderBy(products.id);

    const countResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(whereClause);

    const total = Number(countResult[0]?.count ?? 0);

    return {
      products: rows.map(toEntity),
      total,
    };
  }

  async findById(id: number): Promise<Product | null> {
    const rows = await this.db.select().from(products).where(eq(products.id, id)).limit(1);
    return rows[0] ? toEntity(rows[0]) : null;
  }

  async create(data: CreateProductData): Promise<Product> {
    const inserted = await this.db
      .insert(products)
      .values({
        title: data.title,
        price: String(data.price),
        description: data.description,
        category: data.category,
        images: data.images,
        created_at: data.created_at,
        created_by: data.created_by,
        created_by_id: data.created_by_id,
        updated_at: data.updated_at,
        updated_by: data.updated_by,
        updated_by_id: data.updated_by_id,
      })
      .returning();

    return toEntity(inserted[0]);
  }

  async update(id: number, data: UpdateProductData): Promise<Product | null> {
    const updateValues: Record<string, unknown> = {
      updated_at: data.updated_at,
      updated_by: data.updated_by,
      updated_by_id: data.updated_by_id,
    };

    if (data.title !== undefined) updateValues.title = data.title;
    if (data.price !== undefined) updateValues.price = String(data.price);
    if (data.description !== undefined) updateValues.description = data.description;
    if (data.category !== undefined) updateValues.category = data.category;
    if (data.images !== undefined) updateValues.images = data.images;

    const updated = await this.db
      .update(products)
      .set(updateValues)
      .where(eq(products.id, id))
      .returning();

    return updated[0] ? toEntity(updated[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await this.db
      .delete(products)
      .where(eq(products.id, id))
      .returning({ id: products.id });

    return deleted.length > 0;
  }
}
