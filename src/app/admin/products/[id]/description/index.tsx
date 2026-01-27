"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiLoader, FiSave } from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { NAVBAR_ICON_SIZES } from "@/lib/constants";
import {
    productDescriptionSchema,
    ProductDescriptionInput,
} from "@/app/admin/products/[id]/description/schema";
import RichTextEditor from "@/components/rich-text-editor";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

type Params = {
    product: Product | null;
};

type FormErrors = Partial<Record<keyof ProductDescriptionInput, string>>;

export default function DescriptionForm({ product }: Params) {
    const [formData, setFormData] = useState<ProductDescriptionInput>({
        id: product?.id ?? null,
        short_description: product?.short_description ?? "",
        description: product?.description ?? "",
    });

    const [openValue, setOpenValue] = useState<string | undefined>();

    useEffect(() => {
        const saved = localStorage.getItem("accordion-description-open");
        if (saved) {
            setOpenValue(saved);
        }
    }, []);

    useEffect(() => {
        if (openValue !== undefined) {
            localStorage.setItem("accordion-description-open", openValue);
        }
    }, [openValue]);

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [shortDescription, setShortDescription] = useState<string>(
        (product?.short_description as string) ?? "",
    );

    const [description, setDescription] = useState<string>(
        (product?.description as string) ?? "",
    );

    const validate = (): boolean => {
        const parsed = productDescriptionSchema.safeParse(formData);

        if (!parsed.success) {
            const fieldErrors: FormErrors = {};
            parsed.error.issues.forEach((issue) => {
                const key = issue.path[0] as keyof ProductDescriptionInput;
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
            formData.short_description = shortDescription;
            formData.description = description;
            const res = await axios.post("/api/products/description", formData);

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
            className="w-fit"
        >
            <AccordionItem value="description" className="border rounded-md">
                <AccordionTrigger className="px-5 text-xl cursor-pointer hover:bg-accent border-b">
                    Описание
                </AccordionTrigger>
                <AccordionContent className="p-0">
                    <form onSubmit={handleSubmit}>
                        <div className="p-5 space-y-10 border-b rounded-md">
                            <div className="rounded-md">
                                <h2 className="mb-2">Кратко описание</h2>
                                <div className="text-editor max-w-5xl max-h-200 overflow-auto">
                                    <RichTextEditor
                                        content={shortDescription}
                                        onChange={(value) =>
                                            setShortDescription(value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="rounded-md">
                                <h2 className="mb-2">Описание</h2>
                                <div className="text-editor max-w-5xl max-h-200 overflow-auto">
                                    <RichTextEditor
                                        content={description}
                                        onChange={(value) =>
                                            setDescription(value)
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