import { z } from "zod";

export const categoryDescriptionSchema = z.object({
    id: z.number().nullable().optional(),
    excerpt: z.string().trim().max(255, "Прегледът е твърде дълъг").optional(),
    content: z.string().nullable(),
});

export type CategoryDescriptionInput = z.infer<typeof categoryDescriptionSchema>;
