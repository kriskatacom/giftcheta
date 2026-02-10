"use client";

import { useState } from "react";
import { Heart } from "react-feather";
import { FiShoppingCart, FiLoader, FiClock } from "react-icons/fi";
import { toast } from "sonner";
import { Product } from "@/lib/types";
import { useCartStore } from "@/stores/cart-store";
import { showAddToCartToast } from "@/components/addt-to-cart-toast";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import IconButtonWithTooltip from "@/components/ui/icon-button-with-tooltip";
import FavoriteButton from "./favorite-button";
import PrimaryButton from "@/components/ui/primary-button";
import { getFullUrl } from "@/lib/utils";

type CartButtonsProps = {
    product: Product;
};

export default function AnimatedCartButtons({ product }: CartButtonsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isQuickOrdering] = useState(false);
    const {
        addItem,
        tempDescription,
        updateTempDescription,
        tempQuantity,
        items,
        updateTempQuantity,
    } = useCartStore((state) => state);

    if (!product.price) return null;

    const hasSale = product.sale_price && product.sale_price < product.price;

    const handleAddToCart = async () => {
        try {
            setIsLoading(true);

            addItem(
                {
                    productId: product.id,
                    name: product.name,
                    slug: product.slug as string,
                    price: hasSale
                        ? product.sale_price!
                        : Number(product.price),
                    image: `${product.image}`,
                    link: getFullUrl(`/product/${product.slug}`),
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
            setIsLoading(false);
        }
    };

    const handleQuickOrder = async () => {
        console.log(0);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {/* Favorite Product */}
            <FavoriteButton productId={product.id} />

            {/* Add to Cart */}
            <PrimaryButton
                onClick={handleAddToCart}
                disabled={isLoading}
                title={`Добавяне на "${product.name}" в количката`}
                className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Добавяне в количката
            </PrimaryButton>

            {/* Quick Order */}
            <PrimaryButton
                onClick={handleQuickOrder}
                disabled={isQuickOrdering}
                title="Направете бърна поръчка на продукта"
                className="bg-black/90 hover:bg-black/80 focus:ring-black/90"
            >
                Бърза поръчка
            </PrimaryButton>
        </div>
    );
}