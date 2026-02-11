import { z } from "zod";

const slugRegex = /^[a-z0-9_-]+$/;

export const createTagNameSchema = z.object({
    id: z.number().nullable().optional(),

    name: z
        .string()
        .trim()
        .min(1, "Името е задължително")
        .max(20, "Името е твърде дълго"),

    heading: z
        .string()
        .trim()
        .min(1, "Заглавието е задължително")
        .max(50, "Заглавието е твърде дълго"),

    slug: z
        .string()
        .trim()
        .min(1, "Slug е задължителен")
        .max(20, "Slug е твърде дълъг")
        .regex(
            slugRegex,
            "Slug може да съдържа само малки букви, цифри, тирета и долна черта",
        ),
});

export type TagNameFormInput = z.infer<typeof createTagNameSchema>;
