"use client";

import { useEffect, useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import ImageUpload from "@/components/image-upload";
import { Category } from "@/lib/services/category-service";

type Params = {
    category: Category;
};

export default function ImageForm({ category }: Params) {
    const [openValue, setOpenValue] = useState<string | undefined>();

    useEffect(() => {
        const saved = localStorage.getItem("accordion-category-image-open");
        if (saved) {
            setOpenValue(saved);
        }
    }, []);

    useEffect(() => {
        if (openValue !== undefined) {
            localStorage.setItem("accordion-category-image-open", openValue);
        }
    }, [openValue]);

    return (
        <Accordion
            type="single"
            collapsible
            value={openValue}
            onValueChange={(value) => setOpenValue(value)}
            className="w-full"
        >
            <AccordionItem value="image" className="border rounded-md">
                <AccordionTrigger className="px-5 text-xl cursor-pointer hover:bg-accent border-b">
                    Предно изображение
                </AccordionTrigger>
                <AccordionContent className="p-0 rounded-md border-b">
                    <ImageUpload
                        imageUrl={category.image as string}
                        url={
                            category?.id
                                ? `/api/categories/${category.id}/upload`
                                : ""
                        }
                        isWithBaseName
                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
