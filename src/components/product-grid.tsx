"use client";

import ProductCard from "@/components/product-card";
import { Product } from "@/lib/types";

type ProductGridProps = {
    className?: string;
    products: Product[];
};

export default function ProductGrid({ className, products }: ProductGridProps) {
    return (
        <div className={className}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                    <ProductCard
                        key={index}
                        product={product}
                        onAddToCart={() => alert(`Added ${product.name}`)}
                    />
                ))}
            </div>
        </div>
    );
}
