"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/stores/cart-store";

type CustomProductTextareaProps = {
    placeholder?: string;
    maxLength?: number;
    productId: number;
    onChange?: (value: string) => void;
};

export default function CustomProductTextarea({
    placeholder = "Персонализиран продукт",
    maxLength = 200,
    productId,
}: CustomProductTextareaProps) {
    const { addDescription, updateTempDescription, getItemDescription, tempDescription } = useCartStore(
        (state) => state,
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value.slice(0, maxLength);
        addDescription(productId, val);
        updateTempDescription(val);
    };

    useEffect(() => {
        const description = getItemDescription(productId);
        updateTempDescription(description ?? "");
    }, []);

    return (
        <div className="flex flex-col w-full gap-1">
            <Textarea
                placeholder={placeholder}
                value={tempDescription}
                onChange={handleChange}
                className="resize-none border rounded-md p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150 min-h-40"
                rows={10}
            />
            <div className="text-xs text-muted-foreground text-right">
                {tempDescription.length}/{maxLength} символа
            </div>
        </div>
    );
}
