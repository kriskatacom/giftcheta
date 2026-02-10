"use client";

import { useEffect } from "react";
import { Minus, Plus } from "react-feather";
import { useCartStore } from "@/stores/cart-store";
import IconButtonWithTooltip from "@/components/ui/icon-button-with-tooltip";
import { Input } from "@/components/ui/input";

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
            <IconButtonWithTooltip
                tooltip="Намаляване на количеството"
                variant="outline"
                size="icon-lg"
                onClick={() => updateQuantity(tempQuantity - 1)}
                icon={<Minus size={30} style={{ strokeWidth: 1 }} />}
                disabled={tempQuantity <= min}
            />

            <Input
                type="number"
                className="w-16 text-center border rounded-md p-1 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                value={tempQuantity}
                min={min}
                max={max}
                onChange={(e) => updateQuantity(Number(e.target.value))}
            />

            <IconButtonWithTooltip
                tooltip="Увеличаване на количеството"
                variant="outline"
                size="icon-lg"
                onClick={() => updateQuantity(tempQuantity + 1)}
                icon={<Plus size={30} style={{ strokeWidth: 1 }} />}
            />
        </div>
    );
}
