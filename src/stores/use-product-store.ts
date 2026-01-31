import { create } from "zustand";
import { Product } from "@/lib/types";

type ProductState = {
    products: Product[];
    filteredProducts: Product[];
    priceBounds: { min: number; max: number }; // глобални граници
    priceRange: { min: number; max: number }; // текущо избрани стойности

    setProducts: (products: Product[]) => void;
    setPriceRange: (min: number, max: number) => void;
    resetFilters: () => void;
};

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    filteredProducts: [],
    priceBounds: { min: 0, max: 0 },
    priceRange: { min: 0, max: 0 },

    setProducts: (products) => {
        const prices = products.map((p) => Number(p.price));
        const min = Math.min(...prices);
        const max = Math.max(...prices);

        set({
            products,
            filteredProducts: products,
            priceBounds: { min, max },
            priceRange: { min, max },
        });
    },

    setPriceRange: (min, max) => {
        const { products, priceBounds } = get();
        const safeMin = Math.max(Math.min(min, max), priceBounds.min);
        const safeMax = Math.min(Math.max(min, max), priceBounds.max);

        set({
            priceRange: { min: safeMin, max: safeMax },
            filteredProducts: products.filter(
                (p) => Number(p.price) >= safeMin && Number(p.price) <= safeMax,
            ),
        });
    },

    resetFilters: () => {
        const { products, priceBounds } = get();
        set({
            priceRange: { ...priceBounds },
            filteredProducts: products,
        });
    },
}));