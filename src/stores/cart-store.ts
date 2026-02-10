import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
    productId: number;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    image?: string;
    description?: string;
};

type CartState = {
    items: CartItem[];
    tempDescription: string;
    tempQuantity: number;

    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;

    addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    addDescription: (productId: number, description: string) => void;
    addQuantity: (productId: number, quantity: number) => void;
    updateTempDescription: (description: string) => void;
    updateTempQuantity: (quantity: number) => void;
    clearCart: () => void;

    getTotal: () => number;
    getItemCount: () => number;
    getItemDescription: (productId: number) => string | null;
    getItemQuantity: (productId: number) => number | null;
};

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            tempDescription: "",
            tempQuantity: 1,
            isOpen: false,

            // Sidebar control
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            // Add / remove / update items
            addItem: (item, quantity = 1) => {
                const existing = get().items.find(
                    (i) => i.productId === item.productId,
                );

                if (existing) {
                    set({
                        items: get().items.map((i) =>
                            i.productId === item.productId
                                ? { ...i, quantity: i.quantity + quantity }
                                : i,
                        ),
                    });
                } else {
                    set({
                        items: [...get().items, { ...item, quantity }],
                    });
                }
            },

            removeItem: (productId) => {
                set({
                    items: get().items.filter((i) => i.productId !== productId),
                });
                if (get().items.length === 0) {
                    get().closeCart();
                }
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }
                set({
                    items: get().items.map((i) =>
                        i.productId === productId ? { ...i, quantity } : i,
                    ),
                    tempQuantity: quantity,
                });
            },

            // Add or update description for a specific product
            addDescription: (productId, description) => {
                const exists = get().items.some(
                    (i) => i.productId === productId,
                );
                if (!exists) return;
                set({
                    items: get().items.map((i) =>
                        i.productId === productId ? { ...i, description } : i,
                    ),
                });
            },

            addQuantity: (productId, quantity) => {
                const exists = get().items.some(
                    (i) => i.productId === productId,
                );
                if (!exists) return;
                set({
                    items: get().items.map((i) =>
                        i.productId === productId ? { ...i, quantity } : i,
                    ),
                });
            },

            updateTempDescription: (description) =>
                set({ tempDescription: description }),

            updateTempQuantity: (quantity) => set({ tempQuantity: quantity }),

            // Clear cart
            clearCart: () => {
                set({ items: [] });
                get().closeCart();
            },

            // Totals
            getTotal: () =>
                get().items.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0,
                ),

            getItemCount: () =>
                get().items.reduce((acc, item) => acc + item.quantity, 0),

            getItemDescription: (productId) => {
                const item = get().items.find((x) => x.productId === productId);
                return item?.description ?? null;
            },
            getItemQuantity: (productId) => {
                const item = get().items.find((x) => x.productId === productId);
                return item?.quantity ?? null;
            },
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
