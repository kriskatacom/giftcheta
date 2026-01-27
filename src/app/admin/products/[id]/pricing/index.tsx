"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiLoader, FiSave } from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TextField as CustomTextField } from "@/components/form/text-field";
import { Product } from "@/lib/types";
import { NAVBAR_ICON_SIZES } from "@/lib/constants";
import {
    ProductPriceInput,
    productPriceSchema,
} from "@/app/admin/products/[id]/pricing/schema";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";

type Params = {
    product: Product | null;
};

type FormErrors = Partial<Record<keyof ProductPriceInput, string>>;

export default function PricingForm({ product }: Params) {
    const [formData, setFormData] = useState<ProductPriceInput>({
        id: product?.id ?? null,
        price: product?.price ?? 0,
        sale_price: product?.sale_price ?? null,
    });

    const [openValue, setOpenValue] = useState<string | undefined>();

    useEffect(() => {
        const saved = localStorage.getItem("accordion-pricing-open");
        if (saved) {
            setOpenValue(saved);
        }
    }, []);

    useEffect(() => {
        if (openValue !== undefined) {
            localStorage.setItem("accordion-pricing-open", openValue);
        }
    }, [openValue]);

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: keyof ProductPriceInput, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validate = (): boolean => {
        const parsed = productPriceSchema.safeParse(formData);

        if (!parsed.success) {
            const fieldErrors: FormErrors = {};
            parsed.error.issues.forEach((issue) => {
                const key = issue.path[0] as keyof ProductPriceInput;
                fieldErrors[key] = issue.message;
            });
            setErrors(fieldErrors);
            return false;
        }

        setErrors({});
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);

        try {
            const res = await axios.post("/api/products/pricing", formData);

            if (res.data.success) {
                toast.success("Промените са запазени!");
                setFormData(res.data.data);
            } else {
                toast.error(res.data.error || "Възникна грешка");
            }
        } catch (err: any) {
            if (err.response?.status === 400) {
                setErrors(err.response.data?.errors ?? {});
            } else {
                console.error(err);
                toast.error("Грешка при изпращане");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Accordion
            type="single"
            collapsible
            value={openValue}
            onValueChange={(value) => setOpenValue(value)}
        >
            <AccordionItem value="pricing" className="border rounded-md">
                <AccordionTrigger className="px-5 text-xl cursor-pointer hover:bg-accent border-b">
                    Ценообразуване
                </AccordionTrigger>
                <AccordionContent className="p-0">
                    <form onSubmit={handleSubmit}>
                        <div className="p-5 space-y-10 border-b rounded-md">
                            <CustomTextField
                                id="price"
                                label="Основна цена"
                                required
                                value={formData.price as any}
                                placeholder="Въведете основната цена на продукта"
                                disabled={isSubmitting}
                                error={errors.price}
                                onChange={(value) =>
                                    handleChange("price", value)
                                }
                            />

                            <CustomTextField
                                id="sale_price"
                                label="Цена на промоция"
                                value={formData.sale_price ?? ""}
                                placeholder="Въведете цена на промоция"
                                disabled={isSubmitting}
                                error={errors.sale_price}
                                onChange={(value) =>
                                    handleChange("sale_price", value)
                                }
                            />

                            <Button
                                type="submit"
                                variant="outline"
                                size="lg"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <FiLoader
                                        size={NAVBAR_ICON_SIZES.md}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <FiSave size={NAVBAR_ICON_SIZES.md} />
                                )}
                                <span className="ml-2">
                                    {isSubmitting
                                        ? "Записване..."
                                        : "Запазване"}
                                </span>
                            </Button>
                        </div>
                    </form>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
