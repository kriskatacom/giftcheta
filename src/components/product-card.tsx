"use client";

import Link from "next/link";
import { Eye, ShoppingCart } from "lucide-react";
import AppImage from "@/components/AppImage";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useState } from "react";
import { showAddToCartToast } from "./addt-to-cart-toast";
import { toast } from "sonner";

type ProductCardProps = {
    product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const [isAdding, setIsAdding] = useState(false);

    if (!product.price) return null;

    const hasSale = product.sale_price && product.sale_price < product.price;

    const handleAddToCart = async () => {
        try {
            setIsAdding(true);

            addItem({
                productId: product.id,
                name: product.name,
                slug: product.slug as string,
                price: hasSale ? product.sale_price! : Number(product.price),
                image: product.image,
            });

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

    return (
        <article className="group relative flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm hover:shadow-md transition-shadow">
            {product.image && (
                <Link
                    href={`/product/${product.slug}`}
                    className="relative w-full h-60 bg-gray-100"
                >
                    <AppImage
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </Link>
            )}

            <div className="flex flex-col p-4 flex-1">
                {product.name && (
                    <Link
                        href={`/product/${product.slug}`}
                        className="hover:text-primary duration-300"
                    >
                        <h3 className="text-lg font-semibold line-clamp-2">
                            {product.name}
                        </h3>
                    </Link>
                )}

                <div className="flex justify-between items-center mt-5">
                    {product.price && (
                        <p className="my-2 text-lg font-semibold">
                            {formatPrice(product.price, { locale: "bg-BG" })}
                        </p>
                    )}

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            size="icon-lg"
                            onClick={handleAddToCart}
                            title="Добавяне в количката"
                        >
                            <ShoppingCart className="size-5" />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon-lg"
                            title="Преглед на продукта"
                        >
                            <Eye className="size-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </article>
    );
}