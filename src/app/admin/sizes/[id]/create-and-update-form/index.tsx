"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiLoader, FiSave } from "react-icons/fi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TextField as CustomTextField } from "@/components/form/text-field";
import { NAVBAR_ICON_SIZES } from "@/lib/constants";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Size } from "@/lib/services/size-service";
import {
    createItemSchema,
    SizeFormInput,
} from "@/app/admin/sizes/[id]/create-and-update-form/schema";

// Form errors
type FormErrors = Partial<Record<keyof SizeFormInput, string>>;

type Params = {
    size: Size | null;
};

export default function CreateAndupdateItemForm({ size }: Params) {
    const router = useRouter();

    const [formData, setFormData] = useState<SizeFormInput>({
        name: size?.name || "",
        width: size?.width || 0,
        height: size?.height || 0,
        depth: size?.depth || 0,
        unit: size?.unit || "cm",
    });

    const [openValue, setOpenValue] = useState<string | undefined>();

    useEffect(() => {
        const saved = localStorage.getItem("accordion-size-open");
        if (saved) setOpenValue(saved);
    }, []);

    useEffect(() => {
        if (openValue !== undefined)
            localStorage.setItem("accordion-size-open", openValue);
    }, [openValue]);

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        field: keyof SizeFormInput,
        value: string | number,
    ) => {
        setFormData((prev) => {
            const updated = { ...prev, [field]: value };
            validate(updated);
            return updated;
        });
    };

    const validate = (data?: SizeFormInput): boolean => {
        const parsed = createItemSchema.safeParse(data || formData);

        if (!parsed.success) {
            const fieldErrors: FormErrors = {};
            parsed.error.issues.forEach((issue) => {
                const key = issue.path[0] as keyof SizeFormInput;
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
            const url = size?.id ? `/api/sizes/${size.id}` : `/api/sizes`;
            const method = size?.id ? "PUT" : "POST";

            const res = await axios({
                url,
                method,
                data: size?.id ? { id: size.id, ...formData } : formData,
            });

            if (res.status === 201 || res.status === 200) {
                toast.success("Промените са запазени!");
                router.push(`/admin/sizes/${res.data.size?.id ?? size?.id}`);
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
                        <div className="p-5 space-y-6 border-b rounded-md">
                            <CustomTextField
                                id="name"
                                label="Име на размера"
                                required
                                value={formData.name}
                                placeholder="Въведете името на размера"
                                disabled={isSubmitting}
                                error={errors.name}
                                onChange={(value) =>
                                    handleChange("name", value)
                                }
                            />

                            <div className="grid grid-cols-3 gap-4">
                                <CustomTextField
                                    id="width"
                                    label="Ширина"
                                    type="number"
                                    required
                                    value={formData.width}
                                    error={errors.width}
                                    onChange={(value) =>
                                        handleChange("width", Number(value))
                                    }
                                />
                                <CustomTextField
                                    id="height"
                                    label="Височина"
                                    type="number"
                                    required
                                    value={formData.height}
                                    error={errors.height}
                                    onChange={(value) =>
                                        handleChange("height", Number(value))
                                    }
                                />
                                <CustomTextField
                                    id="depth"
                                    label="Дълбочина"
                                    type="number"
                                    required
                                    value={formData.depth}
                                    error={errors.depth}
                                    onChange={(value) =>
                                        handleChange("depth", Number(value))
                                    }
                                />
                            </div>

                            <div className="mt-2">
                                <label className="block mb-1 font-medium">
                                    Единица
                                </label>
                                <Select
                                    value={formData.unit}
                                    onValueChange={(
                                        value: SizeFormInput["unit"],
                                    ) => handleChange("unit", value)}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Изберете единица" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cm">cm</SelectItem>
                                        <SelectItem value="inch">
                                            inch
                                        </SelectItem>
                                        <SelectItem value="mm">mm</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.unit && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.unit}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                variant="outline"
                                size="lg"
                                disabled={isSubmitting}
                                className="mt-4"
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
                                        : size?.id
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
