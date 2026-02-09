"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FiShoppingCart, FiBold, FiLoader, FiClock } from "react-icons/fi";
import { NAVBAR_ICON_SIZES } from "@/lib/constants";
import { toast } from "sonner";

type CartButtonsProps = {
    productId: number;
    onAddToCart?: (productId: number) => Promise<void>;
    onQuickOrder?: (productId: number) => Promise<void>;
};

export default function AnimatedCartButtons({
    productId,
    onAddToCart,
    onQuickOrder,
}: CartButtonsProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [isQuickOrdering, setIsQuickOrdering] = useState(false);

    const handleAddToCart = async () => {
        if (!onAddToCart) return;
        try {
            setIsAdding(true);
            await onAddToCart(productId);
            toast.success("Продуктът е добавен в количката!");
        } catch {
            toast.error("Грешка при добавяне в количката.");
        } finally {
            setIsAdding(false);
        }
    };

    const handleQuickOrder = async () => {
        if (!onQuickOrder) return;
        try {
            setIsQuickOrdering(true);
            await onQuickOrder(productId);
            toast.success("Бързата поръчка е направена!");
        } catch {
            toast.error("Грешка при бърза поръчка.");
        } finally {
            setIsQuickOrdering(false);
        }
    };

    const buttonBase =
        "flex-1 flex items-center justify-center gap-2 text-white font-semibold py-4 px-5 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary";

    return (
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {/* Add to Cart */}
            <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`${buttonBase} bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {isAdding ? (
                    <FiLoader className="animate-spin" size={25} />
                ) : (
                    <FiShoppingCart size={25} />
                )}
                <span>Добави в количката</span>
            </button>

            {/* Quick Order */}
            <button
                onClick={handleQuickOrder}
                disabled={isQuickOrdering}
                className={`${buttonBase} bg-black/90`}
            >
                {isQuickOrdering ? (
                    <FiLoader className="animate-spin" size={25} />
                ) : (
                    <FiClock size={25} />
                )}
                <span>Бърза поръчка</span>
            </button>
        </div>
    );
}
