import { z } from "zod";

const hexColorRegex = /^#([0-9A-Fa-f]{6})$/;

const colorBaseSchema = {
    id: z.number().nullable().optional(),
    
    name: z
        .string()
        .trim()
        .min(1, "Името е задължително")
        .max(50, "Името е твърде дълго"),

    code: z
        .string()
        .trim()
        .toUpperCase()
        .regex(hexColorRegex, "Невалиден HEX код (пример: #FF0000)"),
};

export const createColorSchema = z.object(colorBaseSchema);

export type ColorFormInput = z.infer<typeof createColorSchema>;
