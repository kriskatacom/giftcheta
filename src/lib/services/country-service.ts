import { Product } from "@/lib/types";
import { getDb } from "@/lib/db";

/* =========================
   CREATE
========================= */
export async function createProduct(product: Product): Promise<Product> {
    const {
        name,
        slug,
        description,
        short_description,
        price,
        currency,
        old_price,
        stock_quantity,
        is_active,
        category_id,
        tags,
        image,
        images,
    } = product;

    const sql = `
        INSERT INTO products
        (name, slug, description, short_description, price, currency, old_price,
         stock_quantity, is_active, category_id, tags, image, images)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const [result] = await getDb().execute(sql, [
            name,
            slug,
            description ?? null,
            short_description ?? null,
            price,
            currency ?? "EUR",
            old_price ?? null,
            stock_quantity ?? 0,
            is_active ?? true,
            category_id ?? null,
            tags ? JSON.stringify(tags) : null,
            image ?? null,
            images ? JSON.stringify(images) : null,
        ]);

        return { id: (result as any).insertId, ...product };
    } catch (err) {
        console.error("Error creating product:", err);
        throw err;
    }
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