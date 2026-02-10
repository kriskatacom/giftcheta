import { z } from "zod";

export const checkoutSchema = z.object({
    fullname: z.string().min(2, "Името трябва да е поне 2 символа"),
    phone: z.string().min(8, "Невалиден телефонен номер"),
    email: z.string().email("Невалиден имейл адрес"),
    address: z.string().min(5, "Моля, въведи адрес за доставка"),
    notes: z.string().optional(),
    terms: z.boolean().refine((value) => value === true, {
        message: "Трябва да приемете условията за ползване",
    }),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;