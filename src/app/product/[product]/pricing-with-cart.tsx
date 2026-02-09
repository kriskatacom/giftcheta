"use client";

import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

type PricingProps = {
    product: Product;
};

export default function PricingWithCart({ product }: PricingProps) {
    if (!product.price) return null;

    const hasSale = product.sale_price && product.sale_price < product.price;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <strong>Цена:</strong>

                <div className="flex items-end gap-3">
                    {hasSale ? (
                        <div className="flex items-end gap-2">
                            <div className="relative flex flex-col items-end mt-5">
                                <span className="absolute -top-4 right-0 text-sm line-through text-muted-foreground">
                                    {formatPrice(product.price)}
                                </span>
                                <span className="text-2xl font-bold text-primary">
                                    {formatPrice(product.sale_price!)}
                                </span>
                            </div>
                            /
                            <span className="text-2xl font-bold text-primary">
                                {formatPrice(product.sale_price! * 1.95, {
                                    currency: "BGN",
                                    symbolPosition: "end",
                                })}
                            </span>
                        </div>
                    ) : (
                        <span className="text-2xl font-bold">
                            {formatPrice(product.price)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
