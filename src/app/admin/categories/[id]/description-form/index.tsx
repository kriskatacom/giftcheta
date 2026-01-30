"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiLoader, FiSave } from "react-icons/fi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NAVBAR_ICON_SIZES } from "@/lib/constants";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Category } from "@/lib/services/category-service";
import { CategoryDescriptionInput, categoryDescriptionSchema } from "@/app/admin/categories/[id]/description-form/schema";
import RichTextEditor from "@/components/rich-text-editor";

// Form errors
type FormErrors = Partial<Record<keyof CategoryDescriptionInput, string>>;

type Props = {
    category: Category;
};

export default function DescriptionForm({
    category,
}: Props) {
    const router = useRouter();

    const [formData, setFormData] = useState<CategoryDescriptionInput>({
        excerpt: category?.excerpt || "",
        content: category?.content || "",
    });

    const [openValue, setOpenValue] = useState<string | undefined>();
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("accordion-category-description-open");
        if (saved) setOpenValue(saved);
    }, []);

    useEffect(() => {
        if (openValue !== undefined)
            localStorage.setItem("accordion-category-description-open", openValue);
    }, [openValue]);

    const handleChange = (field: keyof CategoryDescriptionInput, value: string) => {
        setFormData((prev) => {
            const updated = { ...prev, [field]: value };
            validate(updated);
            return updated;
        });
    };

    const validate = (data?: CategoryDescriptionInput): boolean => {
        const parsed = categoryDescriptionSchema.safeParse(data || formData);

        if (!parsed.success) {
            const fieldErrors: FormErrors = {};
            parsed.error.issues.forEach((issue) => {
                const key = issue.path[0] as keyof CategoryDescriptionInput;
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
            const url = "/api/categories/description";
            const method = "PUT";

            const res = await axios({
                url,
                method,
                data: category?.id
                    ? { id: category.id, ...formData }
                    : formData,
            });

            if (res.status === 200) {
                toast.success("Промените са запазени!");
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
                    Описание
                </AccordionTrigger>
                <AccordionContent className="p-0">
                    <form onSubmit={handleSubmit}>
                        <div className="p-5 space-y-10 border-b rounded-md">

                            <div className="rounded-md space-y-2">
                                <h2>Кратко описание</h2>
                                <div className="text-editor max-w-5xl max-h-200 overflow-auto">
                                    <RichTextEditor
                                        content={formData.excerpt as string}
                                        onChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                excerpt: value,
                                            }))
                                        }
                                    />
                                </div>
                                {errors.excerpt && (
                                    <p className="text-sm text-destructive">
                                        {errors.excerpt}
                                    </p>
                                )}
                            </div>

                            <div className="rounded-md space-y-2">
                                <h2>Основно описание</h2>
                                <div className="text-editor max-w-5xl max-h-200 overflow-auto">
                                    <RichTextEditor
                                        content={formData.content as string}
                                        onChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                content: value,
                                            }))
                                        }
                                    />
                                </div>
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