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
import { Color } from "@/lib/services/color-service";
import {
    ColorFormInput,
    createColorSchema,
} from "@/app/admin/colors/[id]/name-form/schema";
import { ColorPicker } from "@/components/color-picker";

type Params = {
    color: Color | null;
};

// Form errors
type FormErrors = Partial<Record<keyof ColorFormInput, string>>;

export default function CreateAndUpdateForm({ color }: Params) {
    const router = useRouter();

    const [formData, setFormData] = useState<ColorFormInput>({
        name: color?.name || "",
        code: color?.code || "",
    });

    const [openValue, setOpenValue] = useState<string | undefined>();

    useEffect(() => {
        const saved = localStorage.getItem("accordion-color-open");
        if (saved) setOpenValue(saved);
    }, []);

    useEffect(() => {
        if (openValue !== undefined)
            localStorage.setItem("accordion-color-open", openValue);
    }, [openValue]);

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        field: keyof ColorFormInput,
        value: string | number,
    ) => {
        setFormData((prev) => {
            const updated = { ...prev, [field]: value };
            validate(updated);
            return updated;
        });
    };

    const validate = (data?: ColorFormInput): boolean => {
        const parsed = createColorSchema.safeParse(data || formData);

        if (!parsed.success) {
            const fieldErrors: FormErrors = {};
            parsed.error.issues.forEach((issue) => {
                const key = issue.path[0] as keyof ColorFormInput;
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
            const url = color?.id ? `/api/colors` : `/api/colors`;
            const method = color?.id ? "PUT" : "POST";

            const res = await axios({
                url,
                method,
                data: color?.id ? { id: color.id, ...formData } : formData,
            });

            if (res.status === 201 || res.status === 200) {
                toast.success("Промените са запазени!");
                router.push(`/admin/colors/${res.data.color?.id ?? color?.id}`);
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
                                label="Име на цвета"
                                required
                                value={formData.name}
                                placeholder="Въведете името на цвета"
                                disabled={isSubmitting}
                                error={errors.name}
                                onChange={(value) =>
                                    handleChange("name", value)
                                }
                            />
                            <div className="grid grid-cols-2 gap-5">
                                <CustomTextField
                                    id="code"
                                    label="HEX код"
                                    required
                                    value={formData.code}
                                    placeholder="#FFFFFF"
                                    disabled={isSubmitting}
                                    error={errors.code}
                                    onChange={(value) =>
                                        handleChange(
                                            "code",
                                            value.toUpperCase(),
                                        )
                                    }
                                />
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium">
                                        Избор на цвят
                                    </label>
                                    <ColorPicker
                                        value={formData.code}
                                        onChange={(newColor) =>
                                            handleChange("code", newColor)
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
                                        : color?.id
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
