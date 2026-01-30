"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiLoader, FiSave } from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { NAVBAR_ICON_SIZES } from "@/lib/constants";
import {
    ProductSizesInput,
    productSizesSchema,
} from "@/app/admin/products/[id]/sizes/schema";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Size } from "@/lib/services/size-service";

type Params = {
    product: Product;
    sizes: Size[];
};

type FormErrors = Partial<Record<"sizes", string>>;

export default function SizesForm({ product, sizes }: Params) {
    const [formData, setFormData] = useState<ProductSizesInput>({
        id: product?.id ?? null,
        sizes: product?.sizes ?? [],
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openValue, setOpenValue] = useState<string | undefined>();

    useEffect(() => {
        const saved = localStorage.getItem("accordion-product-sizes-open");
        if (saved) setOpenValue(saved);
    }, []);

    useEffect(() => {
        if (openValue !== undefined) {
            localStorage.setItem("accordion-product-sizes-open", openValue);
        }
    }, [openValue]);

    const toggleSize = (sizeId: number) => {
        setFormData((prev) => ({
            ...prev,
            sizes: prev.sizes.includes(sizeId)
                ? prev.sizes.filter((id) => id !== sizeId)
                : [...prev.sizes, sizeId],
        }));
    };

    const validate = (): boolean => {
        const parsed = productSizesSchema.safeParse(formData);

        if (!parsed.success) {
            setErrors({ sizes: parsed.error.issues[0]?.message });
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
            const res = await axios.put("/api/products/sizes", formData);

            if (res.data.success) {
                toast.success("Размерите са запазени!");
            } else {
                toast.error(res.data.message || "Възникна грешка");
            }
        } catch (err) {
            toast.error("Грешка при запис");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Accordion
            type="single"
            collapsible
            value={openValue}
            onValueChange={setOpenValue}
            className="w-full"
        >
            <AccordionItem value="product-sizes" className="border rounded-md">
                <AccordionTrigger className="px-5 text-xl cursor-pointer hover:bg-accent border-b">
                    <div className="flex items-center gap-2">
                        <span>Размери</span>
                        {formData.sizes.length > 0 && (
                            <span>({formData.sizes.length})</span>
                        )}
                    </div>
                </AccordionTrigger>

                <AccordionContent className="rounded-md border-b">
                    <form onSubmit={handleSubmit} className="p-5 space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {sizes.map((size) => (
                                <label
                                    key={size.id}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <Checkbox
                                        checked={formData.sizes.includes(
                                            size.id,
                                        )}
                                        onCheckedChange={() =>
                                            toggleSize(size.id)
                                        }
                                    />
                                    <span>{size.name}</span>
                                </label>
                            ))}
                        </div>

                        {errors.sizes && (
                            <p className="text-sm text-red-500">
                                {errors.sizes}
                            </p>
                        )}

                        <Button
                            type="submit"
                            variant="outline"
                            size="lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <FiLoader
                                    className="animate-spin"
                                    size={NAVBAR_ICON_SIZES.md}
                                />
                            ) : (
                                <FiSave size={NAVBAR_ICON_SIZES.md} />
                            )}
                            <span className="ml-2">
                                {isSubmitting ? "Записване..." : "Запазване"}
                            </span>
                        </Button>
                    </form>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}