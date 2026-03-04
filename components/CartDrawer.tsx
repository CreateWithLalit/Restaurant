"use client";

import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CartDrawer() {
    const { state, closeDrawer, removeItem, increment, decrement, totalPrice, totalItems } = useCart();
    const router = useRouter();

    const gst = Math.round(totalPrice * 0.05);
    const grandTotal = totalPrice + gst;

    function handleCheckout() {
        closeDrawer();
        const items = encodeURIComponent(
            JSON.stringify(
                state.items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity }))
            )
        );
        router.push(`/checkout?items=${items}`);
    }

    return (
        <>
            {/* Backdrop */}
            {state.isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={closeDrawer}
                    aria-hidden="true"
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#111] border-l border-white/10 z-50 flex flex-col shadow-2xl transition-transform duration-500 ease-in-out ${state.isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                role="dialog"
                aria-label="Shopping Cart"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                    <div>
                        <h2 className="text-white font-bold text-lg tracking-tight">Your Order</h2>
                        <p className="text-white/40 text-xs mt-0.5">
                            {totalItems} {totalItems === 1 ? "item" : "items"} in cart
                        </p>
                    </div>
                    <button
                        onClick={closeDrawer}
                        className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
                        aria-label="Close cart"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                    {state.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-16">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <p className="text-white/40 text-sm font-medium">Your cart is empty</p>
                            <p className="text-white/20 text-xs mt-1">Add dishes from the menu to get started</p>
                            <button onClick={closeDrawer} className="mt-6 text-[#C9A227] text-sm font-semibold hover:underline">
                                Browse Menu →
                            </button>
                        </div>
                    ) : (
                        state.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 bg-white/5 rounded-xl p-3 border border-white/5 group"
                            >
                                {/* Image */}
                                {item.image_url && (
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.image_url}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                                    <p className="text-[#C9A227] text-xs mt-0.5">₹{(item.price / 100).toFixed(2)} each</p>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() => decrement(item.id)}
                                            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors text-sm font-bold"
                                            aria-label="Decrease quantity"
                                        >
                                            −
                                        </button>
                                        <span className="text-white text-sm font-bold w-5 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => increment(item.id)}
                                            className="w-6 h-6 rounded-full bg-white/10 hover:bg-[#C9A227]/30 flex items-center justify-center text-white hover:text-[#C9A227] transition-colors text-sm font-bold"
                                            aria-label="Increase quantity"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Subtotal + Remove */}
                                <div className="flex flex-col items-end gap-2">
                                    <p className="text-white font-semibold text-sm">
                                        ₹{((item.price * item.quantity) / 100).toFixed(2)}
                                    </p>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-white/20 hover:text-red-400 transition-colors"
                                        aria-label={`Remove ${item.name}`}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {state.items.length > 0 && (
                    <div className="px-6 py-5 border-t border-white/10 bg-[#0d0b08]/80">
                        {/* Pricing Summary */}
                        <div className="space-y-1.5 mb-4 text-sm">
                            <div className="flex justify-between text-white/50">
                                <span>Subtotal</span>
                                <span>₹{(totalPrice / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-white/50">
                                <span>GST (5%)</span>
                                <span>₹{(gst / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-white/10">
                                <span>Grand Total</span>
                                <span className="text-[#C9A227]">₹{(grandTotal / 100).toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="group/btn relative w-full py-4 rounded-full bg-[#C9A227] text-black font-bold tracking-wide text-sm overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,162,39,0.4)] hover:-translate-y-0.5 active:scale-95"
                        >
                            <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Proceed to Checkout
                                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
