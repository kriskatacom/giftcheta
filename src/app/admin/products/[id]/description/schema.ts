import { z } from "zod";

export const productDescriptionSchema = z.object({
    id: z.number().nullable().optional(),

    short_description: z
        .string()
        .min(10, "Краткото описание трябва да е поне 10 символа")
        .max(255, "Краткото описание е твърде дълго")
        .optional(),

    description: z
        .string()
        .min(20, "Дългото описание трябва да е поне 20 символа")
        .max(5000, "Дългото описание е твърде дълго")
        .optional(),
});

export type ProductDescriptionInput = z.infer<typeof productDescriptionSchema>;
