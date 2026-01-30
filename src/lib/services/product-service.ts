import { Product, ProductStatus } from "@/lib/types";
import { getDb } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { ProductBaseInput } from "@/app/admin/products/[id]/name-and-slug-form/schema";
import { deleteUploadedFile } from "@/app/api/lib";
import { ProductPriceInput } from "@/app/admin/products/[id]/pricing/schema";
import { ProductDescriptionInput } from "@/app/admin/products/[id]/description/schema";
import { ProductTagsInput } from "@/app/admin/products/[id]/tags/schema";
import { ProductInventoryInput } from "@/app/admin/products/[id]/inventory/schema";
import { Pool, ResultSetHeader } from "mysql2/promise";

/* =========================
   CREATE
========================= */

export interface CreateProductDTO {
    name: string;
    slug: string;
}

type Result = {
    created?: boolean;
    updated?: boolean;
    product: Product | null;
};

type ProductFilter = {
    id: number;
    slug: string;
    name: string;
    category_id: number;
    status: ProductStatus;
};

export type GetProductsOptions<
    K extends keyof ProductFilter = keyof ProductFilter,
> = {
    column?: K;
    value?: ProductFilter[K];
    order_by?: "name" | "sort_order" | "created_at" | "updated_at";
    limit?: number;
    is_featured?: boolean;
};

const allowedColumns: (keyof ProductFilter)[] = [
    "id",
    "slug",
    "name",
    "category_id",
    "status",
];

export class ProductService {
    constructor(private readonly pool: Pool) {}

    async createItem(data: CreateProductDTO): Promise<Result> {
        const [result] = await this.pool.execute<ResultSetHeader>(
            `INSERT INTO products (name, slug) VALUES (?, ?)`,
            [data.name, data.slug],
        );

        const product = await this.getItemByColumn("id", result.insertId);

        return {
            created: result.affectedRows > 0,
            product,
        };
    }

    async getItems(options?: GetProductsOptions): Promise<Product[]> {
        let sql = `SELECT * FROM products`;
        const params: (string | number)[] = [];

        if (
            options?.column &&
            options.value !== undefined &&
            allowedColumns.includes(options.column)
        ) {
            sql += ` WHERE ${options.column} = ?`;
            params.push(options.value);
        }

        if (options?.is_featured) {
            sql += ` AND is_featured = 1`;
        }

        sql += ` ORDER BY ${options?.order_by ?? "sort_order"} ASC`;

        if (options?.limit) {
            sql += ` LIMIT ?`;
            params.push(options.limit);
        }

        const [rows] = await getDb().query<any[]>(sql, params);

        return rows.map((row) => ({
            ...row,
            tags: row.tags ? JSON.parse(row.tags) : null,
            images: row.images ? JSON.parse(row.images) : null,
        }));
    }

    async getItemByColumn(
        column: "id" | "slug",
        value: string | number,
    ): Promise<Product | null> {
        const [rows] = await getDb().execute<any[]>(
            `SELECT * FROM products WHERE ${column} = ? LIMIT 1`,
            [value],
        );

        const product = rows[0];
        if (!product) return null;

        return {
            ...product,
            tags: product.tags ? JSON.parse(product.tags) : null,
            images: product.images ? JSON.parse(product.images) : null,
        };
    }

    async updateItem(id: number, product: Partial<Product>): Promise<Product> {
        const fields: string[] = [];
        const values: any[] = [];

        for (const [key, value] of Object.entries(product)) {
            if (key === "tags" || key === "images") {
                fields.push(`${key} = ?`);
                values.push(value ? JSON.stringify(value) : null);
            } else {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fields.length === 0) {
            throw new Error("No fields provided for update.");
        }

        const sql = `
        UPDATE products
        SET ${fields.join(", ")}
        WHERE id = ?
    `;

        values.push(id);

        try {
            await getDb().execute(sql, values);

            const updatedProduct = await this.getItemByColumn("id", id);

            return {
                id,
                ...updatedProduct,
            } as Product;
        } catch (err) {
            console.error("Error updating product:", err);
            throw err;
        }
    }

    async deleteItemsBulk(ids: number[]): Promise<number> {
        if (ids.length === 0) return 0;

        const placeholders = ids.map(() => "?").join(", ");
        const sql = `DELETE FROM products WHERE id IN (${placeholders})`;

        try {
            const [result] = await getDb().execute(sql, ids);
            return (result as any).affectedRows ?? 0;
        } catch (err) {
            console.error("Error bulk deleting products:", err);
            throw err;
        }
    }

    async getItemsByIds(ids: number[]) {
        if (!ids || ids.length === 0) return [];

        const placeholders = ids.map(() => "?").join(",");

        const query = `
        SELECT id, image, images
        FROM products
        WHERE id IN (${placeholders})
    `;

        const [rows] = await getDb().execute(query, ids);

        const products = (rows as any[]).map((row) => ({
            id: row.id,
            image: row.image,
            images: row.images ? JSON.parse(row.images) : [],
        }));

        return products;
    }

    async deleteProductsWithImages(ids: number[]): Promise<number> {
        if (!ids || ids.length === 0) return 0;

        const products = await this.getItemsByIds(ids);

        const imageUrls: string[] = [];
        for (const product of products) {
            if (product.image) imageUrls.push(product.image);
            if (product.images && Array.isArray(product.images))
                imageUrls.push(...product.images);
        }

        await Promise.all(
            imageUrls.map(async (url) => {
                try {
                    await deleteUploadedFile(url);
                } catch (err) {
                    console.warn(`Неуспешно изтриване на файл ${url}`, err);
                }
            }),
        );

        const deletedCount = await this.deleteItemsBulk(ids);

        return deletedCount;
    }
}