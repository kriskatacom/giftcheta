"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiLoader, FiSave } from "react-icons/fi";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/form/text-field";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";

import { Product } from "@/lib/types";
import { NAVBAR_ICON_SIZES } from "@/lib/constants";
import {
    ProductInventoryInput,
    productInventorySchema,
} from "@/app/admin/products/[id]/inventory/schema";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Props = {
    product: Product | null;
};

type FormErrors = Partial<Record<keyof ProductInventoryInput, string>>;

const STORAGE_KEY = "accordion-inventory-open";

export default function InventoryForm({ product }: Props) {
    const [formData, setFormData] = useState<ProductInventoryInput>({
        id: product?.id ?? null,
        status: product?.status ?? "draft",
        stock_quantity: product?.stock_quantity ?? 0,
    });

    const [openValue, setOpenValue] = useState<string | undefined>();

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setOpenValue(saved);
    }, []);

    useEffect(() => {
        if (openValue !== undefined) {
            localStorage.setItem(STORAGE_KEY, openValue);
        }
    }, [openValue]);

    const handleChange = (
        field: keyof ProductInventoryInput,
        value: string,
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: field === "stock_quantity" ? Number(value) : value,
        }));
    };

    const validate = () => {
        const parsed = productInventorySchema.safeParse(formData);

        if (!parsed.success) {
            const fieldErrors: FormErrors = {};
            parsed.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0] as keyof ProductInventoryInput] =
                    issue.message;
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
            const res = await axios.post("/api/products/inventory", formData);

            if (res.data.success) {
                toast.success("Инвентарът е обновен!");
                setFormData(res.data.data);
            } else {
                toast.error(res.data.error || "Възникна грешка");
            }
        } catch (err: any) {
            if (err.response?.status === 400) {
                setErrors(err.response.data?.errors ?? {});
            } else {
                toast.error("Сървърна грешка");
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
            onValueChange={setOpenValue}
        >
            <AccordionItem value="inventory" className="border rounded-md">
                <AccordionTrigger className="px-5 text-xl hover:bg-accent border-b">
                    Наличност и статус
                </AccordionTrigger>

                <AccordionContent className="p-0">
                    <form onSubmit={handleSubmit}>
                        <div className="p-5 space-y-8">
                            <div className="space-y-2">
                                <Label>Статус</Label>

                                <Select
                                    value={formData.status}
                                    onValueChange={(value) =>
                                        handleChange("status", value)
                                    }
                                >
                                    <SelectTrigger className="text-base w-full px-5 h-12 rounded-md border bg-background">
                                        <SelectValue placeholder="Изберете статус" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">
                                            Чернова
                                        </SelectItem>
                                        <SelectSeparator />
                                        <SelectItem value="active">
                                            Активен
                                        </SelectItem>
                                        <SelectSeparator />
                                        <SelectItem value="inactive">
                                            Неактивен
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                {errors.status && (
                                    <p className="text-sm text-destructive">
                                        {errors.status}
                                    </p>
                                )}
                            </div>

                            <TextField
                                id="stock_quantity"
                                label="Налично количество"
                                type="number"
                                value={formData.stock_quantity}
                                disabled={isSubmitting}
                                error={errors.stock_quantity}
                                onChange={(value) =>
                                    handleChange("stock_quantity", value)
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
                                    {isSubmitting ? "Записване..." : "Запазване"}
                                </span>
                            </Button>
                        </div>
                    </form>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}