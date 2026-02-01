"use client";

import { create } from "zustand";
import { Product } from "@/lib/types";

type ProductState = {
    products: Product[];
    filteredProducts: Product[];
    priceBounds: { min: number; max: number };
    priceRange: { min: number; max: number };
    searchQuery: string;

    setProducts: (products: Product[]) => void;
    setPriceRange: (min: number, max: number) => void;
    setSearchQuery: (query: string) => void;
    resetFilters: () => void;

    getActiveFiltersCount: () => number;
    isPriceFiltered: () => boolean;
};

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    filteredProducts: [],
    priceBounds: { min: 0, max: 0 },
    priceRange: { min: 0, max: 0 },
    searchQuery: "",

    setProducts: (products) => {
        const prices = products.map((p) => Number(p.price));
        const min = Math.min(...prices);
        const max = Math.max(...prices);

        set({
            products,
            priceBounds: { min, max },
            priceRange: { min, max },
            filteredProducts: products,
        });
    },

    setPriceRange: (min, max) => {
        const { products, searchQuery, priceBounds } = get();

        const safeMin = Math.max(Math.min(min, max), priceBounds.min);
        const safeMax = Math.min(Math.max(min, max), priceBounds.max);

        set({
            priceRange: { min: safeMin, max: safeMax },
            filteredProducts: products.filter(
                (p) =>
                    Number(p.price) >= safeMin &&
                    Number(p.price) <= safeMax &&
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        });
    },

    setSearchQuery: (query) => {
        const { products, priceRange } = get();

        set({
            searchQuery: query,
            filteredProducts: products.filter(
                (p) =>
                    Number(p.price) >= priceRange.min &&
                    Number(p.price) <= priceRange.max &&
                    p.name.toLowerCase().includes(query.toLowerCase()),
            ),
        });
    },

    resetFilters: () => {
        const { products, priceBounds } = get();
        set({
            priceRange: { ...priceBounds },
            searchQuery: "",
            filteredProducts: products,
        });
    },

    isPriceFiltered: () => {
        const { priceBounds, priceRange } = get();
        return (
            priceRange.min !== priceBounds.min ||
            priceRange.max !== priceBounds.max
        );
    },

    getActiveFiltersCount: () => {
        const { searchQuery } = get();
        let count = 0;

        if (get().isPriceFiltered()) count++;
        if (searchQuery.trim().length > 0) count++;

        return count;
    },
}));
