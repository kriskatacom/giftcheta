"use client";

import AppImage from "@/components/AppImage";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Eye, ShoppingCart } from "lucide-react";
import Link from "next/link";

type ProductCardProps = {
    product: Product;
    onAddToCart?: () => void;
};

export default function ProductCard({
    product,
    onAddToCart,
}: ProductCardProps) {
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
                    <Link href={`/product/${product.slug}`} className="hover:text-primary duration-300">
                        <h3 className="text-lg font-semibold line-clamp-2">
                            {product.name}
                        </h3>
                    </Link>
                )}

                {product.price && (
                    <p className="my-2 text-lg font-semibold">
                        {formatPrice(product.price, { locale: "bg-BG" })}
                    </p>
                )}

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        size="icon-lg"
                        onClick={onAddToCart}
                        title="Добавяне в количката"
                    >
                        <ShoppingCart className="size-5" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon-lg"
                        onClick={onAddToCart}
                        title="Преглед на продукта"
                    >
                        <Eye className="size-5" />
                    </Button>
                </div>
            </div>
        </article>
    );
}