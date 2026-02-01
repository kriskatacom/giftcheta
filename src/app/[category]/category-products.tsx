"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/lib/types";
import { useProductStore } from "@/stores/use-product-store";
import ProductGrid from "@/components/product-grid";
import { Color } from "@/lib/services/color-service";

type Props = {
    products: Product[];
    colors: Color[];
};

export default function ProductsClient({ products, colors }: Props) {
    const searchParams = useSearchParams();
    const initialized = useRef(false);

    const {
        setProducts,
        setPriceRange,
        setSearchQuery,
        filteredProducts,
    } = useProductStore();
    const setColors = useProductStore((s) => s.setColors);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        setProducts(products);
        setColors(colors);

        const min = searchParams.get("min");
        const max = searchParams.get("max");
        if (min || max) {
            setPriceRange(
                min ? Number(min) : 0,
                max ? Number(max) : Number.MAX_SAFE_INTEGER
            );
        }

        const search = searchParams.get("search");
        if (search) {
            setSearchQuery(search);
        }
    }, [products, searchParams, setProducts, setPriceRange, setSearchQuery]);

    return (
        <ProductGrid
            filteredProducts={filteredProducts}
            className="my-5"
        />
    );
}
