import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

// Интерфейс за размер
export interface Size {
    id: number;
    name: string;
    width: number;
    height: number;
    depth: number;
    unit: "cm" | "inch" | "mm";
    sort_order?: number;
}

// DTO за създаване на размер
export interface createItemDTO {
    name: string;
    width: number;
    height: number;
    depth: number;
    unit?: "cm" | "inch" | "mm"; // По избор, default = 'cm'
}

// DTO за обновяване на размер
export interface updateItemDTO {
    name?: string;
    width?: number;
    height?: number;
    depth?: number;
    unit?: "cm" | "inch" | "mm";
}

export class SizeService {
    constructor(private readonly pool: Pool) {}

    // CREATE
    async createItem(data: createItemDTO): Promise<Size> {
        const [result] = await this.pool.execute<ResultSetHeader>(
            `INSERT INTO sizes (name, width, height, depth, unit) VALUES (?, ?, ?, ?, ?)`,
            [data.name, data.width, data.height, data.depth, data.unit || "cm"],
        );

        return {
            id: result.insertId,
            name: data.name,
            width: data.width,
            height: data.height,
            depth: data.depth,
            unit: data.unit || "cm",
        };
    }

    // READ ALL
    async getAllItems(): Promise<Size[]> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            `SELECT id, name, width, height, depth, unit FROM sizes ORDER BY sort_order`,
        );

        return rows as Size[];
    }

    // READ BY ID
    async getItemById(id: number): Promise<Size | null> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            `SELECT id, name, width, height, depth, unit FROM sizes WHERE id = ?`,
            [id],
        );

        if (rows.length === 0) {
            return null;
        }

        return rows[0] as Size;
    }

    // UPDATE
    async updateItem(id: number, data: updateItemDTO): Promise<boolean> {
        const fields: string[] = [];
        const values: any[] = [];

        if (data.name !== undefined) {
            fields.push("name = ?");
            values.push(data.name);
        }
        if (data.width !== undefined) {
            fields.push("width = ?");
            values.push(data.width);
        }
        if (data.height !== undefined) {
            fields.push("height = ?");
            values.push(data.height);
        }
        if (data.depth !== undefined) {
            fields.push("depth = ?");
            values.push(data.depth);
        }
        if (data.unit !== undefined) {
            fields.push("unit = ?");
            values.push(data.unit);
        }

        if (fields.length === 0) {
            return false;
        }

        values.push(id);

        const [result] = await this.pool.execute<ResultSetHeader>(
            `UPDATE sizes SET ${fields.join(", ")} WHERE id = ?`,
            values,
        );

        return result.affectedRows > 0;
    }

    // DELETE
    async deleteItem(id: number): Promise<boolean> {
        const [result] = await this.pool.execute<ResultSetHeader>(
            `DELETE FROM sizes WHERE id = ?`,
            [id],
        );

        return result.affectedRows > 0;
    }

    // DELETE ALL
    async deleteAllItems(useTruncate: boolean = false): Promise<void> {
        if (useTruncate) {
            await this.pool.execute(`TRUNCATE TABLE sizes`);
        } else {
            await this.pool.execute<ResultSetHeader>(`DELETE FROM sizes`);
        }
    }
}
