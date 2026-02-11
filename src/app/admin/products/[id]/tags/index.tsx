"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiLoader, FiSave } from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { NAVBAR_ICON_SIZES } from "@/lib/constants";
import {
    ProductTagsInput,
    productTagsSchema,
} from "@/app/admin/products/[id]/tags/schema";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Tag } from "@/lib/services/tag-service";

type Params = {
    product: Product;
    tags: Tag[];
};

type FormErrors = Partial<Record<"tags", string>>;

export default function TagsForm({ product, tags }: Params) {
    const [formData, setFormData] = useState<ProductTagsInput>({
        id: product?.id ?? null,
        tag_ids: product?.tag_ids ?? [],
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openValue, setOpenValue] = useState<string | undefined>();

    useEffect(() => {
        const saved = localStorage.getItem("accordion-product-tags-open");
        if (saved) setOpenValue(saved);
    }, []);

    useEffect(() => {
        if (openValue !== undefined) {
            localStorage.setItem("accordion-product-tags-open", openValue);
        }
    }, [openValue]);

    const toggleTag = (tagId: number) => {
        setFormData((prev) => ({
            ...prev,
            tag_ids: prev.tag_ids.includes(tagId)
                ? prev.tag_ids.filter((id) => id !== tagId)
                : [...prev.tag_ids, tagId],
        }));
    };

    const validate = (): boolean => {
        const parsed = productTagsSchema.safeParse(formData);

        if (!parsed.success) {
            setErrors({ tags: parsed.error.issues[0]?.message });
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
            const res = await axios.put("/api/products/tags", formData);

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

    const copyTag = async (
        e: React.MouseEvent<HTMLButtonElement>,
        name: string,
    ) => {
        e.preventDefault();
        e.stopPropagation();

        await navigator.clipboard.writeText(name);
        toast.success(`Тагът ${name} е копиран!`);
    };

    return (
        <Accordion
            type="single"
            collapsible
            value={openValue}
            onValueChange={setOpenValue}
            className="w-full"
        >
            <AccordionItem value="product-tags" className="border rounded-md">
                <AccordionTrigger className="px-5 text-xl cursor-pointer hover:bg-accent border-b">
                    <div className="flex items-center gap-2">
                        <span>Тагове</span>
                        {formData.tag_ids.length > 0 && (
                            <span>({formData.tag_ids.length})</span>
                        )}
                    </div>
                </AccordionTrigger>

                <AccordionContent className="rounded-md border-b">
                    <form onSubmit={handleSubmit} className="p-5 space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                            {tags.map((tag) => (
                                <label
                                    key={tag.id}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <Checkbox
                                        checked={formData.tag_ids.includes(
                                            tag.id,
                                        )}
                                        onCheckedChange={() =>
                                            toggleTag(tag.id)
                                        }
                                    />
                                    <div className="relative flex items-center gap-2 group">
                                        <button
                                            onClick={(e) =>
                                                copyTag(e, tag.name)
                                            }
                                            title="Копиране на кода"
                                            className="relative py-2 px-4 rounded-full shrink-0 transition-transform transform group-hover:scale-110 cursor-pointer"
                                        >
                                            {tag.name}
                                        </button>
                                    </div>
                                </label>
                            ))}
                            {tags.length === 0 && (
                                <div className="text-muted-foreground">
                                    Няма намерени тагове
                                </div>
                            )}
                        </div>

                        {errors.tags && (
                            <p className="text-sm text-red-500">
                                {errors.tags}
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