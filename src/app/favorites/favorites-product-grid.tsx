"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import ProductGrid from "@/components/product-grid";
import { getProductsByIds } from "@/app/favorites/actions/actions";
import { useFavoritesStore } from "@/stores/use-favorites-store";
import { eventBus } from "@/lib/events/event-bus";

export default function FavoriteProductGrid() {
    const [products, setProducts] = useState<Product[]>([]);
    const favoriteIds = useFavoritesStore((state) => state.favorites);

    const fetchProducts = async (favoriteIds: number[]) => {
        const products = await getProductsByIds(favoriteIds);
        setProducts(products);
    };

    useEffect(() => {
        fetchProducts(favoriteIds);
    }, [favoriteIds]);

    useEffect(() => {
        const handler = ({
            productId,
            isFavorite,
        }: {
            productId: number;
            isFavorite: boolean;
        }) => {
            const currentFavorites = useFavoritesStore.getState().favorites;
            const updatedFavorites = isFavorite
                ? currentFavorites
                : currentFavorites.filter((id) => id !== productId);
            fetchProducts(updatedFavorites);
        };

        eventBus.on("toggleFavorite", handler);

        return () => {
            eventBus.off("toggleFavorite", handler);
        };
    }, []);

    return (
        <ProductGrid
            filteredProducts={products}
            notFoundMessage="Към настоящия момент нямате добавени продукти в секцията с Любими."
        />
    );
}
