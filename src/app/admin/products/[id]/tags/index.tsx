"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiLoader, FiSave, FiX } from "react-icons/fi";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Params = {
    product: Product | null;
};

type FormErrors = Partial<Record<"tags", string>>;

export default function TagsForm({ product }: Params) {
    const [formData, setFormData] = useState<ProductTagsInput>({
        id: product?.id ?? null,
        tags: product?.tags ?? [],
    });

    const [tagInput, setTagInput] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [openValue, setOpenValue] = useState<string | undefined>();

    useEffect(() => {
        const saved = localStorage.getItem("accordion-tags-open");
        if (saved) setOpenValue(saved);
    }, []);

    useEffect(() => {
        if (openValue !== undefined) {
            localStorage.setItem("accordion-tags-open", openValue);
        }
    }, [openValue]);

    const addTag = () => {
        const value = tagInput.trim().toLowerCase();
        if (!value) return;
        if (formData.tags?.includes(value)) return;

        setFormData((prev) => ({
            ...prev,
            tags: [...(prev.tags ?? []), value],
        }));

        setTagInput("");
    };

    const removeTag = (tag: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags?.filter((t) => t !== tag),
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
                setFormData(res.data.product);
                toast.success("Промените са запазени!");
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
            onValueChange={setOpenValue}
        >
            <AccordionItem value="tags" className="border rounded-md">
                <AccordionTrigger className="px-5 text-xl cursor-pointer hover:bg-accent border-b">
                    <div className="flex items-center gap-2">
                        <span>Тагове</span>
                        <Badge variant={"outline"}>
                            {formData.tags.length}
                        </Badge>
                    </div>
                </AccordionTrigger>

                <AccordionContent className="rounded-md border-b">
                    <form onSubmit={handleSubmit} className="p-5 space-y-6">
                        <div className="flex gap-2">
                            <Input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" &&
                                    (e.preventDefault(), addTag())
                                }
                                placeholder="Въведете име на таг и натиснете бутона Enter"
                                disabled={isSubmitting}
                            />
                            <Button
                                type="button"
                                variant={"outline"}
                                size={"icon-lg"}
                                onClick={addTag}
                                disabled={!tagInput}
                            >
                                <PlusIcon size={NAVBAR_ICON_SIZES.lg} />
                            </Button>
                        </div>

                        {errors.tags && (
                            <p className="text-sm text-red-500">
                                {errors.tags}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {(formData.tags.length > 0 &&
                                formData.tags?.map((tag) => (
                                    <span
                                        key={tag}
                                        className={cn(
                                            "flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-sm",
                                        )}
                                    >
                                        #{tag}
                                        <Button
                                            type="button"
                                            variant={"outline"}
                                            size={"xs"}
                                            onClick={() => removeTag(tag)}
                                            className="ml-1"
                                        >
                                            <FiX size={NAVBAR_ICON_SIZES.sm} />
                                        </Button>
                                    </span>
                                ))) || (
                                <div className="text-muted-foreground">
                                    Няма добавени тагове
                                </div>
                            )}
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
                                {isSubmitting ? "Записване..." : "Запазване"}
                            </span>
                        </Button>
                    </form>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
