import Image from "next/image";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart-store";
import AppImage from "./AppImage";

type ShowAddToCartToastArgs = {
    name: string;
    image?: string;
};

export function showAddToCartToast({ name, image }: ShowAddToCartToastArgs) {
    toast(<AddToCartToast name={name} image={image} />, {
        position: "top-center",
        closeButton: true,
        icon: null,
        className: "bg-white text-foreground border shadow-lg rounded-lg",
    });
}

type AddToCartToastProps = {
    name: string;
    image?: string;
};

export function AddToCartToast({ name, image }: AddToCartToastProps) {
    return (
        <div className="flex flex-col gap-4">
            {/* Product info */}
            <div className="flex items-center gap-3">
                {image && (
                    <div className="relative h-20 w-1/3 overflow-hidden rounded-md border border-gray-800">
                        <AppImage
                            src={image}
                            alt={name}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <div className="flex flex-col w-2/3">
                    <span className="text-base font-medium leading-tight">
                        {name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        Добавен в количката
                    </span>
                </div>
            </div>

            {/* CTA */}
            <button
                onClick={() => {
                    toast.dismiss();
                    useCartStore.getState().openCart();
                }}
                className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
            >
                Виж количката
            </button>
        </div>
    );
}
