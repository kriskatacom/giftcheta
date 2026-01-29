"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiLoader, FiSave } from "react-icons/fi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TextField as CustomTextField } from "@/components/form/text-field";
import { NAVBAR_ICON_SIZES } from "@/lib/constants";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Category } from "@/lib/services/category-service";
import {
    CategoryNameFormInput,
    createCategoryNameSchema
} from "@/app/admin/categories/[id]/name-and-slug-form/schema";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";

// Form errors
type FormErrors = Partial<Record<keyof CategoryNameFormInput, string>>;

type Props = {
    category: Category | null;
};

export default function NameForm({
    category,
}: Props) {
    const router = useRouter();

    const [formData, setFormData] = useState<CategoryNameFormInput>({
        name: category?.name || "",
        slug: category?.slug || "",
        excerpt: category?.excerpt || "",
    });

    const [openValue, setOpenValue] = useState<string | undefined>();
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("accordion-category-name-open");
        if (saved) setOpenValue(saved);
    }, []);

    useEffect(() => {
        if (openValue !== undefined)
            localStorage.setItem("accordion-category-name-open", openValue);
    }, [openValue]);

    const handleChange = (field: keyof CategoryNameFormInput, value: string) => {
        setFormData((prev) => {
            const updated = { ...prev, [field]: value };
            validate(updated);
            return updated;
        });
    };

    const validate = (data?: CategoryNameFormInput): boolean => {
        const parsed = createCategoryNameSchema.safeParse(data || formData);

        if (!parsed.success) {
            const fieldErrors: FormErrors = {};
            parsed.error.issues.forEach((issue) => {
                const key = issue.path[0] as keyof CategoryNameFormInput;
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
            const url = "/api/categories/name-and-slug";
            const method = category?.id ? "PUT" : "POST";

            const res = await axios({
                url,
                method,
                data: category?.id
                    ? { id: category.id, ...formData }
                    : formData,
            });

            if (res.status === 201 || res.status === 200) {
                toast.success("Промените са запазени!");

                if (res.status === 201) {
                    router.push(`/admin/categories/${res.data.category.id}`);
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
                                label="Име на категорията"
                                required
                                value={formData.name}
                                placeholder="Въведете името на категорията"
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
                                    placeholder="Въведете URL адрес на категорията"
                                    disabled={isSubmitting}
                                    error={errors.slug}
                                    onChange={(value) =>
                                        handleChange("slug", value)
                                    }
                                />

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        const newSlug = slugify(formData.name);
                                        const updatedForm = {
                                            ...formData,
                                            slug: newSlug,
                                        };
                                        setFormData(updatedForm);
                                        validate(updatedForm);
                                    }}
                                    disabled={isSubmitting || !formData.name}
                                    title="Генериране на URL адрес"
                                >
                                    Генериране на URL адрес
                                </Button>
                            </div>

                            <Textarea
                                id="excerpt"
                                value={formData.excerpt}
                                placeholder="Кратко описание на категорията"
                                disabled={isSubmitting}
                                onChange={(e) =>
                                    handleChange("excerpt", e.target.value)
                                }
                                className="min-h-40"
                            />
                            {errors.excerpt && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.excerpt}
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
                                        size={NAVBAR_ICON_SIZES.md}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <FiSave size={NAVBAR_ICON_SIZES.md} />
                                )}
                                <span className="ml-2">
                                    {isSubmitting
                                        ? "Записване..."
                                        : category?.id
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