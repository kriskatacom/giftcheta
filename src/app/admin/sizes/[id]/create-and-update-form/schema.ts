import z from "zod";

export const createItemSchema = z.object({
    name: z.string().min(1, "Името е задължително"),
    width: z.coerce.number().min(0, "Ширината трябва да е положителна"),
    height: z.coerce.number().min(0, "Височината трябва да е положителна"),
    depth: z.coerce.number().min(0, "Дълбочината трябва да е положителна"),
    unit: z.enum(["cm", "inch", "mm"]),
});

export type SizeFormInput = z.infer<typeof createItemSchema>;
