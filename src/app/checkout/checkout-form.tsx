"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import axios from "axios";
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
import { UserOrderData } from "@/lib/session";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type CheckoutFormProps = {
    initialValues: UserOrderData | undefined;
};

export default function CheckoutForm({ initialValues }: CheckoutFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { clearCart, items } = useCartStore((state) => state);

    const form = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            fullname: initialValues?.fullname ?? "",
            phone: initialValues?.phone ?? "",
            email: initialValues?.email ?? "",
            address: initialValues?.address ?? "",
            notes: "",
            terms: true,
            allow_marketing: initialValues?.allow_marketing ?? false,
            is_priority: false,
            is_saving: true,
        },
        mode: "onChange",
        reValidateMode: "onChange",
        shouldFocusError: true,
    });

    const onSubmit = async (data: CheckoutFormData) => {
        setLoading(true);
        try {
            const result = await sendOrderConfirmation(data, items);
            await axios.post("/api/session", data);

            if (result.order) {
                clearCart();
                router.push(`/order-thank-you/${result.order.order_number}`);
            }
        } catch (err: unknown) {
            let message = "Възникна грешка";

            if (err instanceof Error) {
                message = err.message;
            } else if (axios.isAxiosError(err)) {
                message = err.response?.data?.message ?? err.message;
            } else if (typeof err === "string") {
                message = err;
            } else if (err && typeof err === "object" && "message" in err) {
                message = (err as any).message;
            }

            toast.error(message);
            console.error("Caught error:", err);
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
                            <FormLabel className="text-sm font-normal flex-wrap">
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

                <FormField
                    control={form.control}
                    name="allow_marketing"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-normal">
                                Желая да получавам промоции и новини по имейл
                            </FormLabel>
                            <FormControl>
                                <Checkbox
                                    checked={!!field.value}
                                    onCheckedChange={(checked) =>
                                        field.onChange(checked === true)
                                    }
                                />
                            </FormControl>
                            <p className="text-xs text-gray-500 mt-1">
                                Ако отметнете това поле, ще получавате
                                информация за промоции, специални оферти и нови
                                продукти на имейл.
                            </p>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="is_priority"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-normal">
                                Желая приоритетна обработка на поръчката
                            </FormLabel>
                            <FormControl>
                                <Checkbox
                                    checked={!!field.value}
                                    onCheckedChange={(checked) =>
                                        field.onChange(checked === true)
                                    }
                                />
                            </FormControl>
                            <p className="text-xs text-gray-500 mt-1">
                                Ако отметнете това поле, поръчката ви ще бъде
                                обработена с приоритет пред останалите.
                            </p>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="is_saving"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-normal">
                                Запазване на данните
                            </FormLabel>
                            <FormControl>
                                <Checkbox
                                    checked={!!field.value}
                                    onCheckedChange={(checked) =>
                                        field.onChange(checked === true)
                                    }
                                />
                            </FormControl>
                            <p className="text-xs text-gray-500 mt-1">
                                Ако желаете данните Ви да се съхраняват в онлайн
                                магазина, за да можете да правите следващи
                                поръчки по-бързо в бъдеще.
                            </p>
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
