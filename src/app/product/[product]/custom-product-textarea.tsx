"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

type CustomProductTextareaProps = {
    placeholder?: string;
    maxLength?: number;
    onChange?: (value: string) => void;
    value?: string;
};

export default function CustomProductTextarea({
    placeholder = "Персонализиран продукт",
    maxLength = 200,
    onChange,
    value = "",
}: CustomProductTextareaProps) {
    const [text, setText] = useState(value);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value.slice(0, maxLength);
        setText(val);
        onChange?.(val);
    };

    return (
        <div className="flex flex-col w-full gap-1">
            <Textarea
                placeholder={placeholder}
                value={text}
                onChange={handleChange}
                className="resize-none border rounded-md p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150 min-h-40"
                rows={10}
            />
            <div className="text-xs text-muted-foreground text-right">
                {text.length}/{maxLength} символа
            </div>
        </div>
    );
}
