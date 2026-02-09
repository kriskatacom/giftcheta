"use client";

import { useEffect, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";

type QuantitySelectorProps = {
    initial?: number;
    min?: number;
    max?: number;
    productId: number;
};

export default function QuantitySelector({
    min = 1,
    max = 99,
    productId,
}: QuantitySelectorProps) {
    const { addQuantity, updateTempQuantity, getItemQuantity, tempQuantity } =
        useCartStore((state) => state);

    const updateQuantity = (quantity: number) => {
        addQuantity(productId, quantity);
        updateTempQuantity(quantity);
    };

    useEffect(() => {
        const quantity = getItemQuantity(productId);
        updateTempQuantity(quantity ?? 1);
    }, []);

    return (
        <div className="flex items-center gap-2">
            <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuantity(tempQuantity - 1)}
                disabled={tempQuantity <= min}
            >
                <FiMinus />
            </Button>

            <input
                type="number"
                className="w-16 text-center border rounded-md p-1 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                value={tempQuantity}
                min={min}
                max={max}
                onChange={(e) => updateQuantity(Number(e.target.value))}
            />

            <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuantity(tempQuantity + 1)}
                disabled={tempQuantity >= max}
            >
                <FiPlus />
            </Button>
        </div>
    );
}
