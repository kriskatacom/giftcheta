"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiLoader, FiSave } from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TextField as CustomTextField } from "@/components/form/text-field";
import { Product } from "@/lib/types";
import { NAVBAR_ICON_SIZES } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import {
    ProductBaseInput,
    productNameSlugSchema,
} from "@/app/admin/products/[id]/name-and-slug-form/schema";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";

type Params = {
    product: Product | null;
};

type FormErrors = Partial<Record<keyof ProductBaseInput, string>>;

export default function NameAndSlugForm({ product }: Params) {
    const router = useRouter();
    const [formData, setFormData] = useState<ProductBaseInput>({
        id: product?.id ?? null,
        name: product?.name ?? "",
        slug: product?.slug ?? "",
    });

    const [openValue, setOpenValue] = useState<string | undefined>();

    useEffect(() => {
        const saved = localStorage.getItem("accordion-open");
        if (saved) {
            setOpenValue(saved);
        }
    }, []);

    useEffect(() => {
        if (openValue !== undefined) {
            localStorage.setItem("accordion-open", openValue);
        }
    }, [openValue]);

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: keyof ProductBaseInput, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validate = (): boolean => {
        const parsed = productNameSlugSchema.safeParse(formData);

        if (!parsed.success) {
            const fieldErrors: FormErrors = {};
            parsed.error.issues.forEach((issue) => {
                const key = issue.path[0] as keyof ProductBaseInput;
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
            const res = await axios.post(
                "/api/products/name-and-slug",
                formData,
            );

            if (res.data.success) {
                toast.success("Промените са запазени!");
                if (res.data.product?.id) {
                    router.push(`/admin/products/${res.data.product.id}`);
                }
            } else {
                toast.error(res.data.message || "Възникна грешка");
            }
        } catch (err: any) {
            if (err.response?.status === 400) {
                const zodErrors = err.response.data?.errors ?? [];
                const formattedErrors: Record<string, string> = {};
                zodErrors.forEach((e: any) => {
                    if (e.path?.[0]) formattedErrors[e.path[0]] = e.message;
                });
                toast.error("Грешка при изпращане");
                setErrors(formattedErrors);
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
            <AccordionItem value="general" className="border rounded-md">
                <AccordionTrigger className="px-5 text-xl cursor-pointer hover:bg-accent border-b">
                    Основна информация
                </AccordionTrigger>
                <AccordionContent className="p-0">
                    <form onSubmit={handleSubmit}>
                        <div className="p-5 space-y-10 border-b rounded-md">
                            <CustomTextField
                                id="name"
                                label="Име на продукта"
                                required
                                value={formData.name}
                                placeholder="Въведете името на продукта"
                                disabled={isSubmitting}
                                error={errors.name}
                                onChange={(value) =>
                                    handleChange("name", value)
                                }
                            />

                            <div className="space-y-2">
                                <CustomTextField
                                    id="slug"
                                    label="URL адрес"
                                    value={formData.slug}
                                    placeholder="Въведете URL адрес на продукта"
                                    disabled={isSubmitting}
                                    error={errors.slug}
                                    onChange={(value) =>
                                        handleChange("slug", value)
                                    }
                                />

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            slug: slugify(prev.name),
                                        }))
                                    }
                                    disabled={isSubmitting || !formData.name}
                                    title="Генериране на URL адрес"
                                >
                                    Генериране на URL адрес
                                </Button>
                            </div>

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
                                        : product?.id
                                          ? "Записване"
                                          : "Създаване"}
                                </span>
                            </Button>
                        </div>
                    </form>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
