"use client";

import Link from "next/link";
import { Eye, ShoppingCart } from "lucide-react";
import { TbHeartFilled } from "react-icons/tb";
import { Heart } from "react-feather";
import { useState } from "react";
import { toast } from "sonner";
import AppImage from "@/components/AppImage";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { showAddToCartToast } from "@/components/addt-to-cart-toast";
import IconButtonWithTooltip from "@/components/ui/icon-button-with-tooltip";
import { useFavoritesStore } from "@/stores/use-favorites-store";
import { eventBus } from "@/lib/events/event-bus";

type ProductCardProps = {
    product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const isFavorite = useFavoritesStore((state) =>
        state.favorites.includes(product.id),
    );
    const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
    const [isLoading, setIsLoading] = useState(false);

    if (!product.price) return null;

    const hasSale = product.sale_price && product.sale_price < product.price;

    const handleAddToCart = async () => {
        try {
            setIsLoading(true);

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
            setIsLoading(false);
        }
    };

    const handleToogleFavorite = () => {
        toggleFavorite(product.id);

        const newIsFavorite = useFavoritesStore
            .getState()
            .favorites.includes(product.id);

        const message = newIsFavorite
            ? "Продуктът е добавен в секция Любими!"
            : "Продуктът е премахнат в секция Любими!";

        toast.success(message, { position: "top-center" });

        eventBus.emit("toggleFavorite", {
            productId: product.id,
            isFavorite: newIsFavorite,
        });
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

            <div className="flex flex-col justify-between p-5 flex-1 ">
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

                    <div className="flex gap-2">
                        <IconButtonWithTooltip
                            tooltip="Добавяне в количката"
                            size="icon-lg"
                            variant="ghost"
                            onClick={handleAddToCart}
                            icon={
                                <ShoppingCart
                                    size={30}
                                    style={{ strokeWidth: 1 }}
                                />
                            }
                        />
                        <IconButtonWithTooltip
                            tooltip="Преглед на продукта"
                            size="icon-lg"
                            variant="ghost"
                            icon={<Eye size={30} style={{ strokeWidth: 1 }} />}
                        />
                        <IconButtonWithTooltip
                            tooltip={
                                isFavorite
                                    ? "Премахване от любими"
                                    : "Добави в любими"
                            }
                            onClick={handleToogleFavorite}
                            variant="ghost"
                            size="icon-lg"
                            icon={
                                isFavorite ? (
                                    <TbHeartFilled
                                        className="fill-primary stroke-primary stroke-1"
                                        size={30}
                                    />
                                ) : (
                                    <Heart
                                        size={30}
                                        style={{ strokeWidth: 1 }}
                                    />
                                )
                            }
                        />
                    </div>
                </div>
            </div>
        </article>
    );
}
