"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiLoader, FiSave } from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { NAVBAR_ICON_SIZES } from "@/lib/constants";
import {
    ProductColorsInput,
    productColorsSchema,
} from "@/app/admin/products/[id]/colors/schema";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Color } from "@/lib/services/color-service";

type Params = {
    product: Product;
    colors: Color[];
};

type FormErrors = Partial<Record<"colors", string>>;

export default function ColorsForm({ product, colors }: Params) {
    const [formData, setFormData] = useState<ProductColorsInput>({
        id: product?.id ?? null,
        colors: product?.colors ?? [],
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openValue, setOpenValue] = useState<string | undefined>();

    useEffect(() => {
        const saved = localStorage.getItem("accordion-product-colors-open");
        if (saved) setOpenValue(saved);
    }, []);

    useEffect(() => {
        if (openValue !== undefined) {
            localStorage.setItem("accordion-product-colors-open", openValue);
        }
    }, [openValue]);

    const toggleColor = (colorId: number) => {
        setFormData((prev) => ({
            ...prev,
            colors: prev.colors.includes(colorId)
                ? prev.colors.filter((id) => id !== colorId)
                : [...prev.colors, colorId],
        }));
    };

    const validate = (): boolean => {
        const parsed = productColorsSchema.safeParse(formData);

        if (!parsed.success) {
            setErrors({ colors: parsed.error.issues[0]?.message });
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
            const res = await axios.put("/api/products/colors", formData);

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

    const copyColor = async (
        e: React.MouseEvent<HTMLButtonElement>,
        code: string,
    ) => {
        e.preventDefault();
        e.stopPropagation();

        await navigator.clipboard.writeText(code);
        toast.success(`Кодът ${code} е копиран!`);
    };

    function getTextColor(bgColor: string) {
        const hex = bgColor.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 125 ? "#000000" : "#FFFFFF";
    }

    return (
        <Accordion
            type="single"
            collapsible
            value={openValue}
            onValueChange={setOpenValue}
            className="w-full"
        >
            <AccordionItem value="product-colors" className="border rounded-md">
                <AccordionTrigger className="px-5 text-xl cursor-pointer hover:bg-accent border-b">
                    <div className="flex items-center gap-2">
                        <span>Цветове</span>
                        {formData.colors.length > 0 && (
                            <span>({formData.colors.length})</span>
                        )}
                    </div>
                </AccordionTrigger>

                <AccordionContent className="rounded-md border-b">
                    <form onSubmit={handleSubmit} className="p-5 space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                            {colors.map((color) => (
                                <label
                                    key={color.id}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <Checkbox
                                        checked={formData.colors.includes(
                                            color.id,
                                        )}
                                        onCheckedChange={() =>
                                            toggleColor(color.id)
                                        }
                                    />
                                    <div className="relative flex items-center gap-2 group">
                                        <button
                                            onClick={(e) =>
                                                copyColor(e, color.code)
                                            }
                                            title="Копиране на кода"
                                            className="relative py-2 px-4 rounded-full shrink-0 transition-transform transform group-hover:scale-110 cursor-pointer"
                                            style={{
                                                backgroundColor: color.code,
                                                color: getTextColor(color.code),
                                            }}
                                        >
                                            {color.code}
                                        </button>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {errors.colors && (
                            <p className="text-sm text-red-500">
                                {errors.colors}
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