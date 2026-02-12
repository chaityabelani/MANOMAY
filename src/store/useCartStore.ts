import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    productId: string;
    shopId: string;
    shopName: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    isVeg: boolean;
}

interface CartState {
    items: CartItem[];
    tableNumber: string | null;
    parkId: string | null;

    // Actions
    setTableSession: (tableNumber: string, parkId: string) => void;
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;

    // Computed
    getTotalItems: () => number;
    getTotalPrice: () => number;
    getItemsByShop: () => Map<string, CartItem[]>;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            tableNumber: null,
            parkId: null,

            setTableSession: (tableNumber, parkId) =>
                set({ tableNumber, parkId }),

            addToCart: (newItem) =>
                set((state) => {
                    const existingIndex = state.items.findIndex(
                        (item) => item.productId === newItem.productId
                    );

                    if (existingIndex >= 0) {
                        // Item exists, increase quantity
                        const updatedItems = [...state.items];
                        updatedItems[existingIndex].quantity += 1;
                        return { items: updatedItems };
                    } else {
                        // New item
                        return {
                            items: [...state.items, { ...newItem, quantity: 1 }],
                        };
                    }
                }),

            removeFromCart: (productId) =>
                set((state) => ({
                    items: state.items.filter((item) => item.productId !== productId),
                })),

            updateQuantity: (productId, quantity) =>
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            items: state.items.filter((item) => item.productId !== productId),
                        };
                    }

                    return {
                        items: state.items.map((item) =>
                            item.productId === productId
                                ? { ...item, quantity }
                                : item
                        ),
                    };
                }),

            clearCart: () => set({ items: [], tableNumber: null, parkId: null }),

            getTotalItems: () => {
                return get().items.reduce((sum, item) => sum + item.quantity, 0);
            },

            getTotalPrice: () => {
                return get().items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                );
            },

            getItemsByShop: () => {
                const itemsByShop = new Map<string, CartItem[]>();
                get().items.forEach((item) => {
                    const shopItems = itemsByShop.get(item.shopId) || [];
                    shopItems.push(item);
                    itemsByShop.set(item.shopId, shopItems);
                });
                return itemsByShop;
            },
        }),
        {
            name: 'manomay-cart',
        }
    )
);
