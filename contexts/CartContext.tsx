"use client";

import React, { createContext, useContext, useReducer, useCallback } from "react";

// --- Types ---
export interface CartItem {
    id: string;
    name: string;
    price: number; // in paise
    image_url?: string;
    category?: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
}

type CartAction =
    | { type: "ADD_ITEM"; item: Omit<CartItem, "quantity"> }
    | { type: "REMOVE_ITEM"; id: string }
    | { type: "INCREMENT"; id: string }
    | { type: "DECREMENT"; id: string }
    | { type: "CLEAR_CART" }
    | { type: "TOGGLE_DRAWER" }
    | { type: "OPEN_DRAWER" }
    | { type: "CLOSE_DRAWER" };

interface CartContextValue {
    state: CartState;
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (id: string) => void;
    increment: (id: string) => void;
    decrement: (id: string) => void;
    clearCart: () => void;
    openDrawer: () => void;
    closeDrawer: () => void;
    toggleDrawer: () => void;
    totalItems: number;
    totalPrice: number; // in paise
}

const CartContext = createContext<CartContextValue | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "ADD_ITEM": {
            const existing = state.items.find((i) => i.id === action.item.id);
            if (existing) {
                return {
                    ...state,
                    items: state.items.map((i) =>
                        i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
                    ),
                };
            }
            return { ...state, items: [...state.items, { ...action.item, quantity: 1 }] };
        }
        case "REMOVE_ITEM":
            return { ...state, items: state.items.filter((i) => i.id !== action.id) };
        case "INCREMENT":
            return {
                ...state,
                items: state.items.map((i) =>
                    i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i
                ),
            };
        case "DECREMENT":
            return {
                ...state,
                items: state.items
                    .map((i) => (i.id === action.id ? { ...i, quantity: i.quantity - 1 } : i))
                    .filter((i) => i.quantity > 0),
            };
        case "CLEAR_CART":
            return { ...state, items: [] };
        case "TOGGLE_DRAWER":
            return { ...state, isOpen: !state.isOpen };
        case "OPEN_DRAWER":
            return { ...state, isOpen: true };
        case "CLOSE_DRAWER":
            return { ...state, isOpen: false };
        default:
            return state;
    }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

    const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
        dispatch({ type: "ADD_ITEM", item });
    }, []);
    const removeItem = useCallback((id: string) => dispatch({ type: "REMOVE_ITEM", id }), []);
    const increment = useCallback((id: string) => dispatch({ type: "INCREMENT", id }), []);
    const decrement = useCallback((id: string) => dispatch({ type: "DECREMENT", id }), []);
    const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
    const openDrawer = useCallback(() => dispatch({ type: "OPEN_DRAWER" }), []);
    const closeDrawer = useCallback(() => dispatch({ type: "CLOSE_DRAWER" }), []);
    const toggleDrawer = useCallback(() => dispatch({ type: "TOGGLE_DRAWER" }), []);

    const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0);
    const totalPrice = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                state,
                addItem,
                removeItem,
                increment,
                decrement,
                clearCart,
                openDrawer,
                closeDrawer,
                toggleDrawer,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}
