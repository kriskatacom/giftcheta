import { z } from "zod";

export const productColorsSchema = z.object({
    id: z.number().nullable().optional(),

    colors: z
        .array(
            z
                .number()
                .int("Невалиден цвят")
                .positive("Невалиден цвят"),
        )
        .max(20, "Може да добавите до 20 цвята")
        .optional()
        .default([]),
});

export type ProductColorsInput = z.infer<typeof productColorsSchema>;
