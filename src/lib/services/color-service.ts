import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

export interface Color {
    id: number;
    name: string;
    code: string;
    sort_order?: number;
}

export interface CreateColorDTO {
    name: string;
    code: string;
}

export interface UpdateColorDTO {
    name?: string;
    code?: string;
    sort_order?: string;
}

export class ColorService {
    constructor(private readonly pool: Pool) {}

    // CREATE
    async createColor(data: CreateColorDTO): Promise<Color> {
        const [result] = await this.pool.execute<ResultSetHeader>(
            `INSERT INTO colors (name, code) VALUES (?, ?)`,
            [data.name, data.code],
        );

        return {
            id: result.insertId,
            name: data.name,
            code: data.code,
        };
    }

    // READ ALL
    async getAllColors(): Promise<Color[]> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            `SELECT id, name, code FROM colors ORDER BY sort_order`,
        );

        return rows as Color[];
    }

    // READ BY ID
    async getColorById(id: number): Promise<Color | null> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            `SELECT id, name, code FROM colors WHERE id = ?`,
            [id],
        );

        if (rows.length === 0) {
            return null;
        }

        return rows[0] as Color;
    }

    // UPDATE
    async updateColor(id: number, data: UpdateColorDTO): Promise<boolean> {
        const fields: string[] = [];
        const values: any[] = [];

        if (data.name !== undefined) {
            fields.push("name = ?");
            values.push(data.name);
        }

        if (data.code !== undefined) {
            fields.push("code = ?");
            values.push(data.code);
        }

        if (data.sort_order !== undefined) {
            fields.push("sort_order = ?");
            values.push(data.sort_order);
        }

        if (fields.length === 0) {
            return false;
        }

        values.push(id);

        const [result] = await this.pool.execute<ResultSetHeader>(
            `UPDATE colors SET ${fields.join(", ")} WHERE id = ?`,
            values,
        );

        return result.affectedRows > 0;
    }

    // DELETE
    async deleteColor(id: number): Promise<boolean> {
        const [result] = await this.pool.execute<ResultSetHeader>(
            `DELETE FROM colors WHERE id = ?`,
            [id],
        );

        return result.affectedRows > 0;
    }

    // DELETE ALL
    async deleteAllItems(
        useTruncate: boolean = false,
    ): Promise<void> {
        if (useTruncate) {
            await this.pool.execute(`TRUNCATE TABLE colors`);
        } else {
            await this.pool.execute<ResultSetHeader>(`DELETE FROM colors`);
        }
    }
}
