"use client";

import AppImage from "@/components/AppImage";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Eye, ShoppingCart } from "lucide-react";

type ProductCardProps = {
    image: string;
    title: string;
    price: string | number;
    href?: string;
    badge?: string;
    onAddToCart?: () => void;
};

export default function ProductCard({
    image,
    title,
    price,
    href,
    badge,
    onAddToCart,
}: ProductCardProps) {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm hover:shadow-md transition-shadow">
            {/* Badge */}
            {badge && (
                <span className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 text-xs font-semibold rounded">
                    {badge}
                </span>
            )}

            {/* Image */}
            <div className="relative w-full h-60 bg-gray-100">
                <AppImage
                    src={image}
                    alt={title}
                    fill
                    className="object-contain"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col p-4 flex-1">
                <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
                <p className="my-2 text-lg font-semibold">
                    {formatPrice(price, { locale: "bg-BG" })}
                </p>
                <div className="flex gap-3">
                    {/* Добавяне в количката */}
                    <Button
                        variant="outline"
                        size="icon-lg"
                        onClick={onAddToCart}
                        title="Добавяне в количката"
                    >
                        <ShoppingCart className="size-5" />
                    </Button>

                    {/* Преглед на продукта */}
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
        </div>
    );
}