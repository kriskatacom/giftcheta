import { z } from "zod";

const slugRegex = /^[a-z0-9_-]+$/;

export const createCategoryNameSchema = z.object({
    id: z.number().nullable().optional(),

    name: z
        .string()
        .trim()
        .min(1, "Името е задължително")
        .max(50, "Името е твърде дълго"),

    slug: z
        .string()
        .trim()
        .min(1, "Slug е задължителен")
        .max(50, "Slug е твърде дълъг")
        .regex(
            slugRegex,
            "Slug може да съдържа само малки букви, цифри, тирета и долна черта",
        ),

    excerpt: z.string().trim().max(255, "Прегледът е твърде дълъг").optional(),
});

export type CategoryNameFormInput = z.infer<typeof createCategoryNameSchema>;