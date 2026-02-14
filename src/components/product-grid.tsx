"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/product-card";
import LoadingSpinner from "@/components/loading/loading-spinner";
import { type Product } from "@/models";

type ProductGridProps = {
    filteredProducts: Product[];
    notFoundMessage?: string;
    className?: string;
};

export default function ProductGrid({
    filteredProducts,
    notFoundMessage = "Няма продукти в този диапазон",
    className,
}: ProductGridProps) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timeout);
    }, [filteredProducts]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!filteredProducts.length) {
        return (
            <div className="text-center text-gray-500 py-10">
                {notFoundMessage}
            </div>
        );
    }

    return (
        <div className={className}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
