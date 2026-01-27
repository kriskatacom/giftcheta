"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FiLoader, FiSave } from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/form/text-field";
import { Product } from "@/lib/types";
import { NAVBAR_ICON_SIZES } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import { ProductBaseInput, productNameSlugSchema } from "./schema";

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

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: keyof ProductBaseInput, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    /* =========================
     VALIDATION с safeParse
  ========================= */
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

    /* =========================
     SUBMIT
  ========================= */
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

                if (res.status === 201) {
                    router.push(`/admin/products/${res.data.productId}`);
                } else {
                    router.push("/admin/products");
                }
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

    /* =========================
     RENDER
  ========================= */
    return (
        <form onSubmit={handleSubmit} className="m-5 border rounded-md">
            <h3 className="p-5 text-xl font-semibold leading-none mb-0">
                Основна информация
            </h3>

            <hr />

            <div className="p-5 space-y-10">
                {/* Име на продукта */}
                <TextField
                    id="name"
                    label="Име на продукта"
                    required
                    value={formData.name}
                    placeholder="Въведете името на продукта"
                    disabled={isSubmitting}
                    error={errors.name}
                    onChange={(value) => handleChange("name", value)}
                />

                {/* URL адрес + бутон за генериране */}
                <div className="space-y-2">
                    <TextField
                        id="slug"
                        label="URL адрес"
                        value={formData.slug}
                        placeholder="Въведете URL адрес на продукта"
                        disabled={isSubmitting}
                        error={errors.slug}
                        onChange={(value) => handleChange("slug", value)}
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

                {/* Submit бутон */}
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
    );
}
