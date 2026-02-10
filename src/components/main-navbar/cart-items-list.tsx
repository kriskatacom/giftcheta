"use client";

import Image from "next/image";
import Link from "next/link";
import { HiMinus, HiPlus, HiTrash } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartItemsList() {
    const { removeItem, updateQuantity, closeCart, items } = useCartStore(
        (state) => state,
    );
    const total = useCartStore((state) => state.getTotal());

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                Количката е празна 🛒
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 p-2 overflow-auto">
            {items.map((item) => (
                <div key={item.productId} className="flex gap-2">
                    {item.image && (
                        <Link href={`/product/${item.slug}`} onClick={closeCart}>
                            <div className="relative w-25 h-25 rounded-md overflow-hidden border">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </Link>
                    )}

                    <div className="flex-1">
                        <div className="flex justify-between">
                            <div>
                                <h4 className="text-sm font-medium">
                                    {item.name}
                                </h4>
                                <div className="text-sm">
                                    {formatPrice(item.price)}
                                </div>
                            </div>
                            <button
                                onClick={() => removeItem(item.productId)}
                                className="text-muted-foreground hover:text-destructive"
                            >
                                <HiTrash />
                            </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Button
                                    size="icon-sm"
                                    variant="outline"
                                    onClick={() =>
                                        updateQuantity(
                                            item.productId,
                                            item.quantity - 1,
                                        )
                                    }
                                >
                                    <HiMinus />
                                </Button>
                                <span className="w-5 text-center text-sm">
                                    {item.quantity}
                                </span>
                                <Button
                                    size="icon-sm"
                                    variant="outline"
                                    onClick={() =>
                                        updateQuantity(
                                            item.productId,
                                            item.quantity + 1,
                                        )
                                    }
                                >
                                    <HiPlus />
                                </Button>
                            </div>

                            <div className="text-sm font-semibold">
                                {formatPrice(item.price * item.quantity)}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <Separator />

            <div className="flex justify-between text-base font-semibold py-5">
                <span>Общо</span>
                <span>{formatPrice(total)}</span>
            </div>

            <div className="flex items-center gap-2">
                <Link className="flex-1" href={"/order/delivery"}>
                    <Button className="w-full" size={"lg"} onClick={closeCart}>
                        Поръчката
                    </Button>
                </Link>
                <Button variant={"outline"} size={"lg"} onClick={closeCart}>
                    Отказ
                </Button>
            </div>
        </div>
    );
}
