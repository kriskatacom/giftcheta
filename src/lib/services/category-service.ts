import { CategoryNameFormInput } from "@/app/admin/categories/[id]/name-and-slug-form/schema";
import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

export interface Category {
    id: number;
    name: string;
    slug: string;
    heading?: string;
    excerpt?: string;
    image?: string;
    content?: string;
    parent_id?: number | null;
    sort_order?: number;
    parent_name?: string | null;
    children_count?: number;
    created_at?: string;
    updated_at?: string;
}

export interface UpdateCategoryDTO {
    name?: string;
    slug?: string;
    heading?: string;
    excerpt?: string | null;
    image?: string;
    content?: string | null;
    parent_id?: number | null;
}

type CategoryFilter = {
    id: number;
    slug: string;
    name: string;
    parent_id: number | null;
    status: number;
};

export type GetCategoriesOptions<
    K extends keyof CategoryFilter = keyof CategoryFilter,
> = {
    column?: K;
    value?: CategoryFilter[K];
    order_by?: "name" | "sort_order" | "created_at" | "updated_at";
    limit?: number;
};

export class CategoryService {
    constructor(private readonly pool: Pool) {}

    // CREATE
    async createItem(data: CategoryNameFormInput): Promise<Category> {
        const [result] = await this.pool.execute<ResultSetHeader>(
            `INSERT INTO categories (name, slug, excerpt)
         VALUES (?, ?, ?)`,
            [data.name, data.slug || ""],
        );

        return {
            id: result.insertId,
            name: data.name,
            slug: data.slug,
        };
    }

    async getAllItems(
        parent_id?: number | null,
        options?: GetCategoriesOptions,
    ): Promise<Category[]> {
        let query = `
        SELECT 
            c.id,
            c.name,
            c.slug,
            c.heading,
            c.excerpt,
            c.image,
            c.content,
            c.parent_id,
            c.sort_order,
            p.name AS parent_name,
            c.created_at,
            c.updated_at,
            (SELECT COUNT(*) FROM categories WHERE parent_id = c.id) AS children_count
        FROM categories c
        LEFT JOIN categories p ON c.parent_id = p.id
    `;

        const params: (string | number)[] = [];
        const conditions: string[] = [];

        // 🔹 parent_id логиката СИ ОСТАВА
        if (parent_id !== undefined) {
            if (parent_id === null) {
                conditions.push(`c.parent_id IS NULL`);
            } else {
                conditions.push(`c.parent_id = ?`);
                params.push(parent_id);
            }
        }

        // 🔹 column + value (като при продуктите)
        if (options?.column && options.value !== undefined) {
            conditions.push(`c.${options.column} = ?`);
            params.push(options.value as any);
        }

        if (conditions.length) {
            query += ` WHERE ` + conditions.join(" AND ");
        }

        // 🔹 order
        query += ` ORDER BY c.${options?.order_by ?? "sort_order"} ASC`;

        // 🔹 limit
        if (options?.limit) {
            query += ` LIMIT ?`;
            params.push(options.limit);
        }

        const [rows] = await this.pool.execute<RowDataPacket[]>(query, params);

        return rows.map((row) => ({
            id: row.id,
            name: row.name,
            slug: row.slug,
            heading: row.heading,
            excerpt: row.excerpt,
            image: row.image,
            content: row.content,
            parent_id: row.parent_id,
            sort_order: row.sort_order,
            parent_name: row.parent_name,
            children_count: row.children_count,
            created_at: row.created_at,
            updated_at: row.updated_at,
        })) as Category[];
    }

    // READ BY ID
    async getItemById(id: number): Promise<Category | null> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            `SELECT * FROM categories WHERE id = ?`,
            [id],
        );

        if (rows.length === 0) {
            return null;
        }

        return rows[0] as Category;
    }

    // UPDATE
    async updateItem(id: number, data: UpdateCategoryDTO): Promise<boolean> {
        const fields: string[] = [];
        const values: any[] = [];

        if (data.name !== undefined) {
            fields.push("name = ?");
            values.push(data.name);
        }
        if (data.slug !== undefined) {
            fields.push("slug = ?");
            values.push(data.slug);
        }
        if (data.heading !== undefined) {
            fields.push("heading = ?");
            values.push(data.heading);
        }
        if (data.excerpt !== undefined) {
            fields.push("excerpt = ?");
            values.push(data.excerpt);
        }
        if (data.image !== undefined) {
            fields.push("image = ?");
            values.push(data.image);
        }
        if (data.content !== undefined) {
            fields.push("content = ?");
            values.push(data.content);
        }
        if (data.parent_id !== undefined) {
            fields.push("parent_id = ?");
            values.push(data.parent_id);
        }

        if (fields.length === 0) {
            return false;
        }

        values.push(id);

        const [result] = await this.pool.execute<ResultSetHeader>(
            `UPDATE categories SET ${fields.join(", ")} WHERE id = ?`,
            values,
        );

        return result.affectedRows > 0;
    }

    // DELETE
    async deleteItem(id: number): Promise<boolean> {
        const [result] = await this.pool.execute<ResultSetHeader>(
            `DELETE FROM categories WHERE id = ?`,
            [id],
        );

        return result.affectedRows > 0;
    }

    async deleteItemsBulk(ids: number[]): Promise<number> {
        if (ids.length === 0) return 0;

        const placeholders = ids.map(() => "?").join(", ");

        try {
            const [result] = await this.pool.execute<ResultSetHeader>(
                `DELETE FROM categories WHERE id IN (${placeholders})`,
                [ids],
            );
            return (result as any).affectedRows ?? 0;
        } catch (err) {
            console.error("Error bulk deleting categories:", err);
            throw err;
        }
    }

    // DELETE ALL
    async deleteAllItems(useTruncate: boolean = false): Promise<void> {
        if (useTruncate) {
            await this.pool.execute(`TRUNCATE TABLE categories`);
        } else {
            await this.pool.execute<ResultSetHeader>(`DELETE FROM categories`);
        }
    }
}