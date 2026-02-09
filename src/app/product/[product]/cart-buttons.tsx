"use client";

import { useState } from "react";
import { FiShoppingCart, FiLoader, FiClock } from "react-icons/fi";
import { toast } from "sonner";
import { Product } from "@/lib/types";
import { useCartStore } from "@/stores/cart-store";
import { showAddToCartToast } from "@/components/addt-to-cart-toast";

type CartButtonsProps = {
    product: Product;
};

export default function AnimatedCartButtons({ product }: CartButtonsProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [isQuickOrdering] = useState(false);
    const {
        addItem,
        tempDescription,
        updateTempDescription,
        tempQuantity,
        updateTempQuantity,
    } = useCartStore((state) => state);

    if (!product.price) return null;

    const hasSale = product.sale_price && product.sale_price < product.price;

    const handleAddToCart = async () => {
        try {
            setIsAdding(true);

            addItem(
                {
                    productId: product.id,
                    name: product.name,
                    slug: product.slug as string,
                    price: hasSale
                        ? product.sale_price!
                        : Number(product.price),
                    image: product.image,
                    description: tempDescription,
                },
                tempQuantity,
            );

            showAddToCartToast({
                name: product.name,
                image: product.image,
            });
        } catch {
            toast.error("Грешка при добавяне в количката.");
        } finally {
            setIsAdding(false);
        }
    };

    const handleQuickOrder = async () => {
        console.log(0);
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
