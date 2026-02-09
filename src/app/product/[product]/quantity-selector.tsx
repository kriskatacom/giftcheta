"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FiMinus, FiPlus } from "react-icons/fi";

type QuantitySelectorProps = {
    initial?: number;
    min?: number;
    max?: number;
    onChange?: (value: number) => void;
};

export default function QuantitySelector({
    initial = 1,
    min = 1,
    max = 99,
    onChange,
}: QuantitySelectorProps) {
    const [quantity, setQuantity] = useState(initial);

    const updateQuantity = (newQuantity: number) => {
        const clamped = Math.min(Math.max(newQuantity, min), max);
        setQuantity(clamped);
        onChange?.(clamped);
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuantity(quantity - 1)}
                disabled={quantity <= min}
            >
                <FiMinus />
            </Button>

            <input
                type="number"
                className="w-16 text-center border rounded-md p-1 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                value={quantity}
                min={min}
                max={max}
                onChange={(e) => updateQuantity(Number(e.target.value))}
            />

            <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuantity(quantity + 1)}
                disabled={quantity >= max}
            >
                <FiPlus />
            </Button>
        </div>
    );
}
