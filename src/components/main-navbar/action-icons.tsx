import { useState, useEffect } from "react";
import {
    HiOutlineHeart,
    HiOutlineShoppingCart,
    HiOutlineUser,
} from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";

export default function ActionIcons() {
    const [mounted, setMounted] = useState(false);
    const cartItemsCount = useCartStore((state) => state.getItemCount());
    const openCart = useCartStore((state) => state.openCart);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="ml-auto hidden lg:flex items-center gap-2">
            <Button variant="ghost" size="icon-xl">
                <HiOutlineHeart />
            </Button>

            <Button
                variant="ghost"
                size="icon-xl"
                className="relative"
                onClick={openCart}
            >
                <HiOutlineShoppingCart />
                {mounted && cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-sm text-primary-foreground flex items-center justify-center px-1">
                        {cartItemsCount}
                    </span>
                )}
            </Button>

            <Button variant="ghost" size="icon-xl">
                <HiOutlineUser />
            </Button>
        </div>
    );
}