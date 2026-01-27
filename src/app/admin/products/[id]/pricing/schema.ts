import { z } from "zod";

export const productPriceSchema = z
    .object({
        id: z.number().nullable().optional(),

        price: z.coerce.number().min(0.01, "Цената трябва да е по-голяма от 0"),

        sale_price: z
            .union([
                z.coerce
                    .number()
                    .positive("Промоционалната цена трябва да е положителна"),
                z.literal("").transform(() => null),
                z.null(),
                z.undefined(),
            ])
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (data.sale_price != null && data.sale_price >= data.price) {
            ctx.addIssue({
                path: ["sale_price"],
                message:
                    "Промоционалната цена трябва да е по-ниска от основната",
                code: z.ZodIssueCode.custom,
            });
        }
    });

export type ProductPriceInput = z.infer<typeof productPriceSchema>;
