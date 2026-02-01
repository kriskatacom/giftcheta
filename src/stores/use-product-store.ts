"use client";

import { create } from "zustand";
import { Product } from "@/lib/types";
import { Color } from "@/lib/services/color-service";

type ProductState = {
    products: Product[];
    filteredProducts: Product[];
    colors: Color[];
    selectedColors: Color[];
    priceBounds: { min: number; max: number };
    priceRange: { min: number; max: number };
    searchQuery: string;

    setProducts: (products: Product[]) => void;
    setColors: (colors: Color[]) => void;
    setSelectedColors: (colors: Color[]) => void;
    setPriceRange: (min: number, max: number) => void;
    setSearchQuery: (query: string) => void;
    resetFilters: () => void;

    getActiveFiltersCount: () => number;
    isPriceFiltered: () => boolean;
};

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    filteredProducts: [],
    colors: [],
    selectedColors: [],
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

    setColors: (colors) => {
        set({ colors });
    },

    setSelectedColors: (selectedColors) => {
        const { products, searchQuery, priceRange } = get();

        const filtered = products.filter((p) => {
            const matchesPrice =
                Number(p.price) >= priceRange.min &&
                Number(p.price) <= priceRange.max;

            const matchesSearch = p.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            const matchesColor =
                selectedColors.length === 0 ||
                p.colors?.some((c) =>
                    selectedColors.some((sc) => sc.id === c.id),
                );

            return matchesPrice && matchesSearch && matchesColor;
        });

        set({ selectedColors, filteredProducts: filtered });
    },

    setPriceRange: (min, max) => {
        const { products, searchQuery, selectedColors, priceBounds } = get();

        const safeMin = Math.max(Math.min(min, max), priceBounds.min);
        const safeMax = Math.min(Math.max(min, max), priceBounds.max);

        const filtered = products.filter((p) => {
            const matchesPrice =
                Number(p.price) >= safeMin && Number(p.price) <= safeMax;
            const matchesSearch = p.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesColor =
                selectedColors.length === 0 ||
                p.colors?.some((c) =>
                    selectedColors.some((sc) => sc.id === c.id),
                );

            return matchesPrice && matchesSearch && matchesColor;
        });

        set({
            priceRange: { min: safeMin, max: safeMax },
            filteredProducts: filtered,
        });
    },

    setSearchQuery: (query) => {
        const { products, priceRange, selectedColors } = get();

        const filtered = products.filter((p) => {
            const matchesPrice =
                Number(p.price) >= priceRange.min &&
                Number(p.price) <= priceRange.max;

            const matchesSearch = p.name
                .toLowerCase()
                .includes(query.toLowerCase());

            const matchesColor =
                selectedColors.length === 0 ||
                p.colors?.some((c) =>
                    selectedColors.some((sc) => sc.id === c.id),
                );

            return matchesPrice && matchesSearch && matchesColor;
        });

        set({
            searchQuery: query,
            filteredProducts: filtered,
        });
    },

    resetFilters: () => {
        const { products, priceBounds } = get();
        set({
            priceRange: { ...priceBounds },
            searchQuery: "",
            filteredProducts: products,
            selectedColors: [],
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
        const { searchQuery, selectedColors } = get();
        let count = 0;
        if (get().isPriceFiltered()) count++;
        if (searchQuery.trim().length > 0) count++;
        if (selectedColors.length > 0) count++;
        return count;
    },
}));