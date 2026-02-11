"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import {
    createTagNameSchema,
    TagNameFormInput,
} from "@/app/admin/tags/[id]/create-and-update-form/schema";
import { Tag } from "@/lib/services/tag-service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PrimaryButton from "@/components/ui/primary-button";
import { slugify } from "@/lib/utils";
import { FiLoader, FiSave } from "react-icons/fi";
import { NAVBAR_ICON_SIZES } from "@/lib/constants";

type Params = {
    tag: Tag | null;
};

export default function CreateAndUpdateItemForm({ tag }: Params) {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const form = useForm<TagNameFormInput>({
        resolver: zodResolver(createTagNameSchema),
        defaultValues: {
            name: tag?.name || "",
            slug: tag?.slug || "",
            heading: tag?.heading || "",
        },
        mode: "onChange",
        reValidateMode: "onChange",
        shouldFocusError: true,
    });

    const [openValue, setOpenValue] = useState<string | undefined>();

    useEffect(() => {
        const saved = localStorage.getItem("accordion-tag-open");
        if (saved) setOpenValue(saved);
    }, []);

    useEffect(() => {
        if (openValue !== undefined)
            localStorage.setItem("accordion-tag-open", openValue);
    }, [openValue]);

    const onSubmit = async (data: TagNameFormInput) => {
        setLoading(true);
        try {
            const url = tag?.id ? `/api/tags?id=${tag.id}` : `/api/tags`;
            const method = tag?.id ? "PUT" : "POST";

            const res = await axios({
                url,
                method,
                data: tag?.id ? { id: tag.id, ...data } : data,
            });

            if (res.status === 201 || res.status === 200) {
                toast.success("Промените са запазени!");
                router.push(`/admin/tags/${res.data.tag?.id ?? tag?.id}`);
            } else {
                toast.error(res.data.error || "Възникна грешка");
            }
        } catch (err: any) {
            if (err.response?.status === 400) {
            } else {
                console.error(err);
                toast.error("Грешка при изпращане");
            }
        } finally {
            setLoading(false);
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
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="p-5 space-y-6 border-b rounded-md">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Име</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Свети Валентин"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>URL адрес</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="sveti-valentin"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        variant={"outline"}
                                        onClick={() =>
                                            form.setValue(
                                                "slug",
                                                slugify(form.getValues("name")),
                                            )
                                        }
                                    >
                                        Генериране
                                    </Button>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="heading"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Заглавие</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Подарък за Свети Валентин"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    variant="outline"
                                    size="lg"
                                    disabled={loading}
                                    className="mt-4"
                                >
                                    {loading ? (
                                        <FiLoader
                                            size={NAVBAR_ICON_SIZES.md}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <FiSave size={NAVBAR_ICON_SIZES.md} />
                                    )}
                                    <span className="ml-2">
                                        {loading
                                            ? "Записване..."
                                            : tag?.id
                                              ? "Записване"
                                              : "Създаване"}
                                    </span>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
