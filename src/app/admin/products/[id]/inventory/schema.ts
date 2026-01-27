import { z } from "zod";

export const productInventorySchema = z.object({
    id: z.number().nullable(),

    status: z
        .string()
        .refine(
            (val) => ["active", "inactive", "draft"].includes(val),
            {
                message: "Невалиден статус",
            },
        ),

    stock_quantity: z.coerce
        .number()
        .int("Количеството трябва да е цяло число")
        .min(0, "Количеството не може да е отрицателно"),
});

export type ProductInventoryInput = z.infer<
    typeof productInventorySchema
>;
