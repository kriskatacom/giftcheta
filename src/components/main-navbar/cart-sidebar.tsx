"use client";

import { useEffect, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import CartItemsList from "@/components/main-navbar/cart-items-list";

export default function CartSidebar() {
    const [mounted, setMounted] = useState(false);
    const cartItemsCount = useCartStore((state) => state.getItemCount());
    const isOpen = useCartStore((state) => state.isOpen);
    const closeCart = useCartStore((state) => state.closeCart);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div>
            <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
                <SheetContent side="right" className="w-11/12 gap-0">
                    <SheetHeader className="">
                        <SheetTitle className="text-lg text-left">
                            Количка{" "}
                            {cartItemsCount && <span>({cartItemsCount})</span>}
                        </SheetTitle>
                    </SheetHeader>

                    <Separator />

                    <CartItemsList />
                </SheetContent>
            </Sheet>
        </div>
    );
}