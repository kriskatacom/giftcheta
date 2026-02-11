import { z } from "zod";

export const productTagsSchema = z.object({
    id: z.number().nullable().optional(),

    tag_ids: z
        .array(
            z
                .number()
                .int("Невалиден таг")
                .positive("Невалиден таг"),
        )
        .max(20, "Може да добавите до 20 тага")
        .optional()
        .default([]),
});

export type ProductTagsInput = z.infer<typeof productTagsSchema>;
