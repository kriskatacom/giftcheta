"use client";

import { useState } from "react";
import axios from "axios";
import { FiLoader, FiSave } from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/form/text-field";
import { Product } from "@/lib/types";
import { NAVBAR_ICON_SIZES } from "@/lib/constants";
import {
    ProductPriceInput,
    productPriceSchema,
} from "@/app/admin/products/[id]/pricing/schema";

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
        <form onSubmit={handleSubmit} className="h-fit border rounded-md">
            <h3 className="p-5 text-xl font-semibold leading-none mb-0">
                Ценообразуване
            </h3>

            <hr />

            <div className="p-5 space-y-10">
                <TextField
                    id="price"
                    label="Основна цена"
                    required
                    value={formData.price as any}
                    placeholder="Въведете основната цена на продукта"
                    disabled={isSubmitting}
                    error={errors.price}
                    onChange={(value) => handleChange("price", value)}
                />

                <TextField
                    id="sale_price"
                    label="Цена на промоция"
                    value={formData.sale_price ?? ""}
                    placeholder="Въведете цена на промоция"
                    disabled={isSubmitting}
                    error={errors.sale_price}
                    onChange={(value) => handleChange("sale_price", value)}
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
                        {isSubmitting ? "Записване..." : "Запазване"}
                    </span>
                </Button>
            </div>
        </form>
    );
}
