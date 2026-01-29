import { z } from "zod";

export const productNameSlugSchema = z.object({
    id: z.number().nullable().optional(),
    name: z
        .string()
        .min(3, "Името трябва да е поне 3 символа")
        .max(255, "Името е твърде дълго"),
    slug: z
        .string()
        .min(3, "URL адресът трябва да е поне 3 символа")
        .max(255, "URL адресът е твърде дълъг")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "URL адресът може да съдържа само малки букви, цифри и тирета",
        ),
});

export type ProductBaseInput = z.infer<typeof productNameSlugSchema>;
