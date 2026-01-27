"use client";

import { useEffect, useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import AdditionalImages from "@/components/additional-images";

type Params = {
    images: string[];
    productId: number;
};

export default function ImagesForm({ images, productId }: Params) {
    const [openValue, setOpenValue] = useState<string | undefined>();

    useEffect(() => {
        const saved = localStorage.getItem("accordion-images-open");
        if (saved) {
            setOpenValue(saved);
        }
    }, []);

    useEffect(() => {
        if (openValue !== undefined) {
            localStorage.setItem("accordion-images-open", openValue);
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
            <AccordionItem value="images" className="border rounded-md">
                <AccordionTrigger className="px-5 text-xl cursor-pointer hover:bg-accent border-b">
                    Допълнителни изображения
                </AccordionTrigger>
                <AccordionContent className="p-0 rounded-md border-b">
                    <AdditionalImages
                        imageUrls={images}
                        url={`/api/products/${productId}/multiple-upload`}
                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}