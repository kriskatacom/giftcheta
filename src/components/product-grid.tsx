"use client";

import { Product } from "@/lib/types";
import ProductCard from "@/components/product-card";

type ProductGridProps = {
    filteredProducts: Product[];
    className?: string;
};

export default function ProductGrid({ filteredProducts, className }: ProductGridProps) {
    if (!filteredProducts.length) {
        return (
            <div className="text-center text-gray-500 py-10">
                Няма продукти в този диапазон
            </div>
        );
    }

    return (
        <div className={className}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={() =>
                            alert(`Added ${product.name}`)
                        }
                    />
                ))}
            </div>
        </div>
    );
}
