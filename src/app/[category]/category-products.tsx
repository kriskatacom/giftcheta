"use client";

import { useEffect } from "react";
import { Product } from "@/lib/types";
import { useProductStore } from "@/stores/use-product-store";
import ProductGrid from "@/components/product-grid";

type Props = {
    products: Product[];
};

export default function ProductsClient({ products }: Props) {
    const setProducts = useProductStore((s) => s.setProducts);
    const filteredProducts = useProductStore(
        (state) => state.filteredProducts
    );

    useEffect(() => {
        setProducts(products);
    }, [products, setProducts]);

    return <ProductGrid filteredProducts={filteredProducts} className="mt-5" />;
}
