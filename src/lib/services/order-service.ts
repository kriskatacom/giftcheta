import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

export enum OrderStatusEnum {
    Pending = "pending",
    Confirmed = "confirmed",
    Processing = "processing",
    Shipped = "shipped",
    Delivered = "delivered",
    Cancelled = "cancelled",
    Refunded = "refunded",
}

export enum PaymentStatusEnum {
    Unpaid = "unpaid",
    Paid = "paid",
    Refunded = "refunded",
    Failed = "failed",
    Pending = "pending",
}

export interface OrderItem {
    productId: number;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    image: string;
    link: string;
    description?: string;
}

export interface Order {
    id: number;
    order_number: string;

    fullname: string;
    email: string;
    phone: string;

    address: string;
    country: string;

    notes: string | null;
    delivery_date: Date | null;

    status: OrderStatusEnum;
    payment_status: PaymentStatusEnum;
    payment_method: string | null;
    total_amount: number;
    currency: string;

    created_at: Date;
    updated_at: Date;
    completed_at: Date | null;
    cancelled_at: Date | null;

    user_id: number | null;
    guest: boolean;

    tracking_number: string | null;
    shipping_provider: string | null;
    discount_code: string | null;
    tax_amount: number;
    shipping_cost: number;
    notes_internal: string | null;

    items: OrderItem[];

    gift: boolean;
    gift_message: string | null;
    is_priority: boolean;
    allow_marketing: boolean;
    feedback_given: boolean;
}

export interface CreateOrderDTO {
    order_number: string;

    fullname: string;
    email: string;
    phone: string;

    address: string;
    country?: string;

    notes?: string | null;
    delivery_date?: Date;

    status: OrderStatusEnum;
    payment_status: PaymentStatusEnum;
    payment_method?: string;
    total_amount: number;
    currency?: string;

    user_id?: number;
    guest?: boolean;

    tracking_number?: string;
    shipping_provider?: string;
    discount_code?: string;
    tax_amount?: number;
    shipping_cost?: number;
    notes_internal?: string;

    items: OrderItem[];

    gift?: boolean;
    gift_message?: string;
    is_priority?: boolean;
    allow_marketing?: boolean;
    feedback_given?: boolean;
}

export interface UpdateOrderDTO {
    fullname?: string;
    email?: string;
    phone?: string;
    address?: string;
    country?: string;
    notes?: string;
    delivery_date?: Date;
    status?: string;
    payment_status?: string;
    payment_method?: string;
    total_amount?: number;
    currency?: string;
    user_id?: number;
    guest?: boolean;
    tracking_number?: string;
    shipping_provider?: string;
    discount_code?: string;
    tax_amount?: number;
    shipping_cost?: number;
    notes_internal?: string;
    items?: OrderItem[];
    gift?: boolean;
    gift_message?: string;
    is_priority?: boolean;
    allow_marketing?: boolean;
    feedback_given?: boolean;
}

export class OrderService {
    constructor(private readonly pool: Pool) {}

    // CREATE
    async createOrder(data: CreateOrderDTO): Promise<Order> {
        const [result] = await this.pool.execute<ResultSetHeader>(
            `INSERT INTO orders
      (
        order_number, fullname, email, phone,
        address, country, notes, delivery_date,
        status, payment_status, payment_method,
        total_amount, currency, user_id, guest,
        tracking_number, shipping_provider, discount_code,
        tax_amount, shipping_cost, notes_internal,
        items, gift, gift_message, is_priority, allow_marketing, feedback_given
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.order_number,
                data.fullname,
                data.email,
                data.phone,
                data.address,
                data.country || "Bulgaria",
                data.notes || null,
                data.delivery_date || null,
                data.status || OrderStatusEnum.Pending,
                data.payment_status || "unpaid",
                data.payment_method || null,
                data.total_amount,
                data.currency || "BGN",
                data.user_id || null,
                data.guest ?? true,
                data.tracking_number || null,
                data.shipping_provider || null,
                data.discount_code || null,
                data.tax_amount || 0,
                data.shipping_cost || 0,
                data.notes_internal || null,
                JSON.stringify(data.items),
                data.gift ?? false,
                data.gift_message || null,
                data.is_priority ?? false,
                data.allow_marketing ?? false,
                data.feedback_given ?? false,
            ],
        );

        return {
            id: result.insertId,
            order_number: data.order_number,
            fullname: data.fullname,
            email: data.email,
            phone: data.phone,
            address: data.address,
            country: data.country || "Bulgaria",
            notes: data.notes || null,
            delivery_date: data.delivery_date || null,
            status: data.status || OrderStatusEnum.Pending,
            payment_status: data.payment_status || PaymentStatusEnum.Unpaid,
            payment_method: data.payment_method || null,
            total_amount: data.total_amount,
            currency: data.currency || "BGN",
            user_id: data.user_id || null,
            guest: data.guest ?? true,
            tracking_number: data.tracking_number || null,
            shipping_provider: data.shipping_provider || null,
            discount_code: data.discount_code || null,
            tax_amount: data.tax_amount ?? 0,
            shipping_cost: data.shipping_cost ?? 0,
            notes_internal: data.notes_internal || null,
            items: data.items,
            gift: data.gift ?? false,
            gift_message: data.gift_message || null,
            is_priority: data.is_priority ?? false,
            allow_marketing: data.allow_marketing ?? false,
            feedback_given: data.feedback_given ?? false,
            created_at: new Date(),
            updated_at: new Date(),
            completed_at: null,
            cancelled_at: null,
        };
    }

    // READ ALL
    async getAllOrders(): Promise<Order[]> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            `SELECT * FROM orders ORDER BY created_at DESC`,
        );
        return rows.map((row) => ({
            ...row,
            items: JSON.parse(row.items),
        })) as Order[];
    }

    // READ BY COLUMN
    async getOrderByColumn(
        column: "id" | "order_number",
        value: number | string,
    ): Promise<Order | null> {
        const query = `SELECT * FROM orders WHERE ${column} = ? LIMIT 1`;

        const [rows] = await this.pool.execute<RowDataPacket[]>(query, [value]);

        if (rows.length === 0) return null;

        return {
            ...rows[0],
            items: JSON.parse(rows[0].items),
        } as Order;
    }

    // UPDATE
    async updateOrder(id: number, data: UpdateOrderDTO): Promise<boolean> {
        const fields: string[] = [];
        const values: any[] = [];

        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) {
                if (key === "items") {
                    fields.push(`items = ?`);
                    values.push(JSON.stringify(value));
                } else {
                    fields.push(`${key} = ?`);
                    values.push(value);
                }
            }
        }

        if (fields.length === 0) return false;

        values.push(id);

        const [result] = await this.pool.execute<ResultSetHeader>(
            `UPDATE orders SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            values,
        );

        return result.affectedRows > 0;
    }

    // DELETE
    async deleteOrder(id: number): Promise<boolean> {
        const [result] = await this.pool.execute<ResultSetHeader>(
            `DELETE FROM orders WHERE id = ?`,
            [id],
        );

        return result.affectedRows > 0;
    }

    // DELETE ALL
    async deleteAllOrders(useTruncate: boolean = false): Promise<void> {
        if (useTruncate) {
            await this.pool.execute(`TRUNCATE TABLE orders`);
        } else {
            await this.pool.execute<ResultSetHeader>(`DELETE FROM orders`);
        }
    }
}
