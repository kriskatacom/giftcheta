import { useState, useEffect } from "react";
import { Heart, ShoppingCart, User } from "react-feather";
import Link from "next/link";
import { useCartStore } from "@/stores/cart-store";
import IconButtonWithTooltip from "@/components/ui/icon-button-with-tooltip";
import { useFavoritesStore } from "@/stores/use-favorites-store";
import { TbHeartFilled } from "react-icons/tb";

export default function ActionIcons() {
    const [mounted, setMounted] = useState(false);
    const cartItemsCount = useCartStore((state) => state.getItemCount());
    const favoriteItemsCount = useFavoritesStore(
        (state) => state.favorites.length,
    );
    const openCart = useCartStore((state) => state.openCart);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="ml-auto hidden lg:flex items-center gap-2">
            <Link href="/favorites" className="relative">
                <IconButtonWithTooltip
                    tooltip="Показване на Любими"
                    variant="ghost"
                    size="icon-xl"
                    icon={
                        favoriteItemsCount > 0 ? (
                            <TbHeartFilled
                            className="fill-primary stroke-primary stroke-1"
                            size={30}
                            />
                        ) : (
                            <Heart size={30} style={{ strokeWidth: 1 }} />
                        )
                    }
                />
                {mounted && favoriteItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-sm text-primary-foreground flex items-center justify-center px-1">
                        {favoriteItemsCount}
                    </span>
                )}
            </Link>

            <div className="relative">
                <IconButtonWithTooltip
                    tooltip="Показване на количката"
                    variant="ghost"
                    size="icon-xl"
                    onClick={openCart}
                    icon={<ShoppingCart size={30} style={{ strokeWidth: 1 }} />}
                />
                {mounted && cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-sm text-primary-foreground flex items-center justify-center px-1">
                        {cartItemsCount}
                    </span>
                )}
            </div>

            <IconButtonWithTooltip
                tooltip="Влизане в профила"
                variant="ghost"
                size="icon-xl"
                onClick={openCart}
                icon={<User size={30} style={{ strokeWidth: 1 }} />}
            />
        </div>
    );
}