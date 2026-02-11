import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

export interface Tag {
    id: number;
    name: string;
    slug: string;
    heading?: string | null;
    sort_order?: number;
}

export interface CreateTagDTO {
    name: string;
    slug: string;
    heading?: string;
    sort_order?: number;
}

export interface UpdateTagDTO {
    name?: string;
    slug?: string;
    heading?: string;
    sort_order?: number;
}

export class TagService {
    constructor(private readonly pool: Pool) {}

    // CREATE
    async createItem(data: CreateTagDTO): Promise<Tag> {
        const [result] = await this.pool.execute<ResultSetHeader>(
            `INSERT INTO tags (name, slug, heading) VALUES (?, ?, ?)`,
            [data.name, data.slug, data.heading]
        );

        return {
            id: result.insertId,
            name: data.name,
            slug: data.slug,
            heading: data.heading || null,
        };
    }

    // READ ALL
    async getAllItems(): Promise<Tag[]> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            `SELECT id, name, slug, heading FROM tags ORDER BY name`
        );

        return rows as Tag[];
    }

    // READ BY ID
    async getItemById(id: number): Promise<Tag | null> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            `SELECT id, name, slug, heading FROM tags WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) return null;
        return rows[0] as Tag;
    }

    // UPDATE
    async updateItem(id: number, data: UpdateTagDTO): Promise<boolean> {
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

        if (fields.length === 0) return false;

        values.push(id);

        const [result] = await this.pool.execute<ResultSetHeader>(
            `UPDATE tags SET ${fields.join(", ")} WHERE id = ?`,
            values
        );

        return result.affectedRows > 0;
    }

    // DELETE
    async deleteItem(id: number): Promise<boolean> {
        const [result] = await this.pool.execute<ResultSetHeader>(
            `DELETE FROM tags WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    }

    // DELETE ALL
    async deleteAllItems(useTruncate: boolean = false): Promise<void> {
        if (useTruncate) {
            await this.pool.execute(`SET FOREIGN_KEY_CHECKS = 0`);
            await this.pool.execute(`TRUNCATE TABLE tags`);
            await this.pool.execute(`SET FOREIGN_KEY_CHECKS = 1`);
        } else {
            await this.pool.execute<ResultSetHeader>(`DELETE FROM tags`);
        }
    }
}
