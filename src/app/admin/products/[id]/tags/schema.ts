import { z } from "zod";

export const productTagsSchema = z.object({
    id: z.number().nullable().optional(),

    tags: z
        .array(
            z
                .string()
                .min(1, "Тагът не може да е празен")
                .max(50, "Тагът е твърде дълъг"),
        )
        .max(20, "Може да добавите до 20 тага")
        .optional()
        .default([]),
});

export type ProductTagsInput = z.infer<typeof productTagsSchema>;
