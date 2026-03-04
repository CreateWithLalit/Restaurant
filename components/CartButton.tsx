"use client";

import { useCart } from "@/contexts/CartContext";

export default function CartButton() {
    const { openDrawer, totalItems, totalPrice } = useCart();

    const gst = Math.round(totalPrice * 0.05);
    const grand = totalPrice + gst;

    return (
        <button
            onClick={openDrawer}
            aria-label={`Open cart, ${totalItems} items`}
            className={`group fixed bottom-6 right-6 z-30 flex items-center gap-3 bg-[#C9A227] text-black rounded-full shadow-[0_8px_32px_rgba(201,162,39,0.4)] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(201,162,39,0.5)] hover:-translate-y-1 active:scale-95 ${totalItems > 0
                    ? "px-5 py-3.5 opacity-100 translate-y-0"
                    : "px-4 py-4 opacity-80 hover:opacity-100"
                }`}
        >
            {/* Cart icon */}
            <div className="relative">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
                {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-[#C9A227] text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center leading-none animate-bounce">
                        {totalItems > 9 ? "9+" : totalItems}
                    </span>
                )}
            </div>

            {/* Label + price — only when cart has items */}
            {totalItems > 0 && (
                <div className="text-left leading-tight">
                    <p className="text-[10px] font-semibold uppercase tracking-widest opacity-70">View Order</p>
                    <p className="text-sm font-extrabold tracking-tight">₹{(grand / 100).toFixed(2)}</p>
                </div>
            )}
        </button>
    );
}
