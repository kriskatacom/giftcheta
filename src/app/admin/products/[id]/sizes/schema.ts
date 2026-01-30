import { z } from "zod";

export const productSizesSchema = z.object({
    id: z.number().nullable().optional(),

    sizes: z
        .array(
            z
                .number()
                .int("Невалиден размер")
                .positive("Невалиден размер"),
        )
        .max(20, "Може да добавите до 20 размера")
        .optional()
        .default([]),
});

export type ProductSizesInput = z.infer<typeof productSizesSchema>;
