"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
    favorites: number[];
    toggleFavorite: (id: number) => void;
    isFavorite: (id: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: [],

            toggleFavorite: (id: number) =>
                set((state) => {
                    const exists = state.favorites.includes(id);
                    return {
                        favorites: exists
                            ? state.favorites.filter((fav) => fav !== id)
                            : [...state.favorites, id],
                    };
                }),

            isFavorite: (id: number) => get().favorites.includes(id),
        }),
        {
            name: "favorites-storage", // ключ в localStorage
            // по подразбиране persist използва JSON.numberify / JSON.parse
            // и вече не трябва serialize / deserialize
        },
    ),
);
