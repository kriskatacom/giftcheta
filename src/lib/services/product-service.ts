import { Product } from "@/lib/types";
import { getDb } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { ProductBaseInput } from "@/app/admin/products/[id]/name-and-slug-form";

/* =========================
   CREATE
========================= */

type Result = {
    id: number;
    created: boolean;
};

export async function createOrUpdateProductNameSlug(
    input: ProductBaseInput,
): Promise<Result> {
    const db = getDb();

    const finalSlug =
        input.slug && input.slug.trim() !== ""
            ? slugify(input.slug)
            : slugify(input.name);

    const [existing] = await db.execute<any[]>(
        `
        SELECT id
        FROM products
        WHERE slug = ?
        ${input.id ? "AND id != ?" : ""}
        LIMIT 1
        `,
        input.id ? [finalSlug, input.id] : [finalSlug],
    );

    if (existing.length > 0) {
        throw {
            code: "slug",
            message: "Този URL адрес вече съществува",
        };
    }

    // ✏️ UPDATE
    if (input.id) {
        await db.execute(
            `
            UPDATE products
            SET name = ?, slug = ?
            WHERE id = ?
        `,
            [input.name, finalSlug, input.id],
        );

        return {
            id: input.id,
            created: false,
        };
    }

    // ➕ CREATE
    const [result] = await db.execute(
        `
        INSERT INTO products (name, slug)
        VALUES (?, ?)
    `,
        [input.name, finalSlug],
    );

    return {
        id: (result as any).insertId,
        created: true,
    };
}

/* =========================
   GET
========================= */
type GetProductsOptions = {
    column?: "id" | "slug" | "name" | "category_id";
    value?: string | number;
};

export async function getProducts(
    options?: GetProductsOptions,
): Promise<Product[]> {
    let sql = `SELECT * FROM products`;
    const params: (string | number)[] = [];

    if (options?.column && options.value !== undefined) {
        sql += ` WHERE ${options.column} = ?`;
        params.push(options.value);
    }

    const [rows] = await getDb().query<any[]>(sql, params);

    return rows.map((row) => ({
        ...row,
        tags: row.tags ? JSON.parse(row.tags) : null,
        images: row.images ? JSON.parse(row.images) : null,
    }));
}

export async function getProductByColumn(
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

/* =========================
   UPDATE
========================= */
export async function updateProduct(
    id: number,
    product: Partial<Product>,
): Promise<Product> {
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

        return {
            id,
            ...product,
        } as Product;
    } catch (err) {
        console.error("Error updating product:", err);
        throw err;
    }
}

/* =========================
   DELETE
========================= */
export async function deleteProduct(id: number): Promise<boolean> {
    try {
        const [result] = await getDb().execute(
            `DELETE FROM products WHERE id = ?`,
            [id],
        );

        return ((result as any).affectedRows ?? 0) > 0;
    } catch (err) {
        console.error("Error deleting product:", err);
        throw err;
    }
}

export async function deleteProductsBulk(ids: number[]): Promise<number> {
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