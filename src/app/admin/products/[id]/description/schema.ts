import { z } from "zod";

export const productDescriptionSchema = z.object({
    id: z.number().nullable().optional(),
    short_description: z.string().optional(),
    description: z.string().nullable(),
});

export type ProductDescriptionInput = z.infer<typeof productDescriptionSchema>;
