"use client";

import { DOMAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
    checkoutSchema,
    CheckoutFormData,
} from "@/app/checkout/checkout-schema";
import { Checkbox } from "@/components/ui/checkbox";
import { useCartStore } from "@/stores/cart-store";
import PrimaryButton from "@/components/ui/primary-button";
import { sendOrderConfirmation } from "@/app/checkout/actions/send-order-confirmation";

export default function CheckoutForm() {
    const [loading, setLoading] = useState(false);
    const { items } = useCartStore((state) => state);

    const form = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            fullname: "",
            phone: "",
            email: "",
            address: "",
            notes: "",
            terms: false,
        },
        mode: "onChange",
        reValidateMode: "onChange",
        shouldFocusError: true,
    });

    const onSubmit = async (data: CheckoutFormData) => {
        setLoading(true);
        try {
            const result = await sendOrderConfirmation({
                ...data, // това са стойностите от формата
                items, // добавяме масива с продукти
            });

            console.log("Потвърждение:", result);
            // тук можеш да покажеш toast или redirect
        } catch (error) {
            console.error(error);
            // тук можеш да покажеш грешка на потребителя
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Име и фамилия</FormLabel>
                            <FormControl>
                                <Input placeholder="Мария Иванова" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Телефон</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="08XXXXXXXX"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Имейл</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="example@email.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Адрес за доставка</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Област, град, ул. Примерна 12, ап. 3"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Бележка към поръчката (по избор)
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Час за доставка, уточнения…"
                                    {...field}
                                    rows={10}
                                    className="h-40"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-normal">
                                Декларирам, че съм запознат/а и приемам{" "}
                                <Link
                                    href="/terms"
                                    className="text-primary underline"
                                >
                                    Общите условия на сайта
                                </Link>
                            </FormLabel>
                            <FormControl>
                                <Checkbox
                                    checked={!!field.value}
                                    onCheckedChange={(checked) =>
                                        field.onChange(checked === true)
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <PrimaryButton
                    type="submit"
                    isLoading={loading}
                    disabled={loading || !form.formState.isValid}
                    className="bg-primary hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:pointer-events-none w-full"
                >
                    Завършване на поръчката
                </PrimaryButton>
            </form>
        </Form>
    );
}