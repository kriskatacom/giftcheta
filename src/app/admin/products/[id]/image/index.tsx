"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import ImageUpload from "@/components/image-upload";

type Params = {
    product: Product;
};

export default function ImageForm({ product }: Params) {
    const [openValue, setOpenValue] = useState<string | undefined>();

    useEffect(() => {
        const saved = localStorage.getItem("accordion-image-open");
        if (saved) {
            setOpenValue(saved);
        }
    }, []);

    useEffect(() => {
        if (openValue !== undefined) {
            localStorage.setItem("accordion-image-open", openValue);
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
                        imageUrl={product.image as string}
                        url={
                            product?.id
                                ? `/api/products/${product.id}/upload`
                                : ""
                        }
                        isWithBaseName
                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
