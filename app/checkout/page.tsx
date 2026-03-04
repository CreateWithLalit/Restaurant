"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

// --- Types ---
interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

// --- UPI App Data ---
const UPI_APPS = [
    {
        id: "gpay",
        name: "Google Pay",
        packageName: "com.google.android.apps.nbu.paisa.user",
        color: "#4285F4",
        gradient: "from-blue-500 to-blue-700",
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
                <path d="M24.5 20.5H38.5C39.3 22.9 39.3 25.1 38.5 27.5H24.5V20.5Z" fill="#4285F4" />
                <path d="M24 43C17.4 43 11.6 39.3 8.5 33.8L14.9 28.8C16.5 32.4 20 35 24 35C26.1 35 28 34.4 29.6 33.3L36 38.3C32.7 41.4 28.6 43 24 43Z" fill="#34A853" />
                <path d="M8.5 33.8C7.2 31.5 6.5 28.8 6.5 26C6.5 23.2 7.2 20.5 8.5 18.2L14.9 23.2C14.3 24.1 14 25 14 26C14 27 14.3 27.9 14.9 28.8L8.5 33.8Z" fill="#FBBC05" />
                <path d="M24 17C26.5 17 28.8 17.9 30.6 19.4L36.4 13.6C33.1 10.6 28.8 9 24 9C20 9 16.5 10.1 13.7 12.2L8.5 18.2C11.6 12.7 17.4 17 24 17Z" fill="#EA4335" />
            </svg>
        ),
    },
    {
        id: "phonepe",
        name: "PhonePe",
        packageName: "com.phonepe.app",
        color: "#6739B7",
        gradient: "from-purple-600 to-purple-800",
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
                <rect width="48" height="48" rx="12" fill="#6739B7" />
                <path d="M24 10C16.3 10 10 16.3 10 24C10 31.7 16.3 38 24 38C31.7 38 38 31.7 38 24C38 16.3 31.7 10 24 10ZM28.4 29.5H25.8V31.5C25.8 32.2 25.2 32.8 24.5 32.8C23.8 32.8 23.2 32.2 23.2 31.5V29.5H20.3C19.3 29.5 18.7 28.4 19.2 27.5L23.5 19.8C23.9 19.1 24.9 19.1 25.3 19.8L29.6 27.5C30.1 28.4 29.4 29.5 28.4 29.5Z" fill="white" />
            </svg>
        ),
    },
    {
        id: "paytm",
        name: "Paytm",
        packageName: "net.one97.paytm",
        color: "#00BAF2",
        gradient: "from-cyan-400 to-blue-500",
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
                <rect width="48" height="48" rx="12" fill="#00BAF2" />
                <path d="M30 16H18C16.9 16 16 16.9 16 18V30C16 31.1 16.9 32 18 32H30C31.1 32 32 31.1 32 30V18C32 16.9 31.1 16 30 16ZM22 28H19V20H22V28ZM25.5 28H22.5V24H25.5V28ZM29 28H26V22H29V28Z" fill="white" />
            </svg>
        ),
    },
];

// --- Sub-Components ---
function OrderSummary({ items, tableNumber, customerName }: { items: OrderItem[], tableNumber: string, customerName: string }) {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const gst = Math.round(total * 0.05);
    const grandTotal = total + gst;

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-fit">
            <h3 className="text-[#C9A227] font-semibold text-sm tracking-widest uppercase mb-4">
                Order Summary
            </h3>

            <div className="flex gap-4 mb-5">
                <div className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-center">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Table</p>
                    <p className="text-white font-bold text-lg">{tableNumber}</p>
                </div>
                <div className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-center">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Guest</p>
                    <p className="text-white font-bold text-lg truncate">{customerName}</p>
                </div>
            </div>

            <div className="space-y-3 mb-5">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="bg-[#C9A227]/20 text-[#C9A227] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                ×{item.quantity}
                            </span>
                            <span className="text-white/80 text-sm">{item.name}</span>
                        </div>
                        <span className="text-white/70 text-sm font-medium">
                            ₹{((item.price * item.quantity) / 100).toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-white/50">
                    <span>Subtotal</span>
                    <span>₹{(total / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-white/50">
                    <span>GST (5%)</span>
                    <span>₹{(gst / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white mt-2 pt-2 border-t border-white/10">
                    <span>Total Payable</span>
                    <span className="text-[#C9A227]">₹{(grandTotal / 100).toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}

function ProcessingOverlay({ visible }: { visible: boolean }) {
    if (!visible) return null;
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0b08]/90 backdrop-blur-md">
            <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-[#C9A227]/20 animate-ping" />
                <div className="absolute inset-2 rounded-full border-2 border-[#C9A227]/40 animate-ping [animation-delay:0.3s]" />
                <div className="absolute inset-4 rounded-full bg-[#C9A227]/20 animate-pulse flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
            <h2 className="text-white text-xl font-semibold tracking-wide mb-2">Processing Payment...</h2>
            <p className="text-white/40 text-sm">Please do not close this window</p>
            <div className="mt-6 flex gap-1">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-[#C9A227] animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>
        </div>
    );
}

// --- Main Page ---
function PaymentPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // State for Customer Info
    const [guestName, setGuestName] = useState(searchParams.get("name") || "");
    const [tableNumber, setTableNumber] = useState(searchParams.get("table") || "");
    const [infoError, setInfoError] = useState("");

    const [upiId, setUpiId] = useState("");
    const [upiError, setUpiError] = useState("");
    const [selectedApp, setSelectedApp] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Parse data from query params (or use sample data)
    const rawItems = searchParams.get("items");

    const orderItems: OrderItem[] = rawItems
        ? JSON.parse(decodeURIComponent(rawItems))
        : [
            { id: "1", name: "Butter Chicken", price: 34900, quantity: 2 },
            { id: "2", name: "Garlic Naan", price: 8900, quantity: 3 },
            { id: "3", name: "Mango Lassi", price: 12900, quantity: 2 },
        ];

    const grandTotal = orderItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const gst = Math.round(grandTotal * 0.05);
    const amountInPaise = grandTotal + gst;
    const amountInRupees = (amountInPaise / 100).toFixed(2);

    function validateCustomerInfo() {
        if (!guestName.trim() || !tableNumber.trim()) {
            setInfoError("Guest Name and Table Number are mandatory.");
            return false;
        }
        setInfoError("");
        return true;
    }

    function buildUpiUrl(upiApp: typeof UPI_APPS[0]) {
        const params = new URLSearchParams({
            pa: "restaurant@upi", // Merchant UPI ID — replace with real one
            pn: "D-Dion Restaurant",
            am: amountInRupees,
            cu: "INR",
            tn: `Order by ${guestName} - Table ${tableNumber}`,
        });
        return `upi://pay?${params.toString()}`;
    }

    function handleAppPay(app: typeof UPI_APPS[0]) {
        if (!validateCustomerInfo()) return;

        setSelectedApp(app.id);
        setIsProcessing(true);
        const upiUrl = buildUpiUrl(app);
        window.location.href = upiUrl;

        // Fallback after 3s (desktop or unsupported)
        setTimeout(() => {
            setIsProcessing(false);
            setSelectedApp(null);
        }, 3000);
    }

    function validateUpiId(id: string) {
        return /^[\w.\-]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/.test(id);
    }

    function handleManualPay() {
        if (!validateCustomerInfo()) return;

        if (!validateUpiId(upiId)) {
            setUpiError("Please enter a valid UPI ID (e.g., name@bank)");
            return;
        }
        setUpiError("");
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setPaymentSuccess(true);
        }, 3000);
    }

    if (paymentSuccess) {
        return (
            <div className="min-h-screen bg-[#0d0b08] flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <svg className="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-white text-3xl font-bold mb-2">Payment Successful!</h2>
                    <p className="text-white/50 mb-8">Your order has been confirmed, {guestName}. Bon appétit! 🍽️</p>
                    <Link
                        href="/"
                        className="bg-[#C9A227] text-black font-bold px-8 py-3 rounded-full hover:bg-[#e8b92c] transition-colors duration-300 inline-block"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d0b08] relative overflow-hidden">
            <ProcessingOverlay visible={isProcessing} />

            {/* Decorative blobs */}
            <div className="absolute top-[-10rem] left-[-10rem] w-[30rem] h-[30rem] bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10rem] right-[-10rem] w-[30rem] h-[30rem] bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 sm:px-6">

                {/* Header */}
                <div className="mb-10">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-white/40 hover:text-[#C9A227] transition-colors text-sm mb-6 group">
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Menu
                    </button>
                    <p className="text-[#C9A227] text-xs tracking-[0.3em] uppercase mb-1">Secure Checkout</p>
                    <h1 className="text-white text-3xl sm:text-4xl font-bold tracking-tight">Complete Your Order</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Left: Payment Panel */}
                    <div className="lg:col-span-3 space-y-5">

                        {/* Customer Info Section (NEW) */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                            <h3 className="text-white font-semibold mb-1">Customer Details</h3>
                            <p className="text-white/40 text-sm mb-5">Please provide your name and table number</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/40 text-[10px] uppercase tracking-widest mb-1.5 block ml-1">Guest Name *</label>
                                    <input
                                        type="text"
                                        value={guestName}
                                        onChange={(e) => {
                                            setGuestName(e.target.value);
                                            if (e.target.value.trim() && tableNumber.trim()) setInfoError("");
                                        }}
                                        placeholder="Enter your name"
                                        className={`w-full bg-white/5 border ${infoError && !guestName.trim() ? "border-red-500/50" : "border-white/10"} rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#C9A227]/50 transition-all`}
                                    />
                                </div>
                                <div>
                                    <label className="text-white/40 text-[10px] uppercase tracking-widest mb-1.5 block ml-1">Table Number *</label>
                                    <input
                                        type="text"
                                        value={tableNumber}
                                        onChange={(e) => {
                                            setTableNumber(e.target.value);
                                            if (e.target.value.trim() && guestName.trim()) setInfoError("");
                                        }}
                                        placeholder="e.g. A-01"
                                        className={`w-full bg-white/5 border ${infoError && !tableNumber.trim() ? "border-red-500/50" : "border-white/10"} rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#C9A227]/50 transition-all`}
                                    />
                                </div>
                            </div>

                            {infoError && (
                                <p className="text-red-400/80 text-xs mt-3 flex items-center gap-1 ml-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    {infoError}
                                </p>
                            )}
                        </div>

                        {/* Amount Banner */}
                        <div className="bg-gradient-to-r from-[#C9A227]/20 to-[#C9A227]/5 border border-[#C9A227]/30 rounded-2xl p-6 flex items-center justify-between">
                            <div>
                                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Amount Due</p>
                                <p className="text-[#C9A227] text-4xl font-bold tracking-tight">₹{amountInRupees}</p>
                            </div>
                            <div className="bg-[#C9A227]/10 rounded-full p-4">
                                <svg className="w-8 h-8 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* UPI Apps */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                            <h3 className="text-white font-semibold mb-1">Pay with UPI App</h3>
                            <p className="text-white/40 text-sm mb-5">Tap to open your preferred UPI app</p>

                            <div className="grid grid-cols-3 gap-3">
                                {UPI_APPS.map((app) => (
                                    <button
                                        key={app.id}
                                        onClick={() => handleAppPay(app)}
                                        disabled={isProcessing}
                                        className={`group relative flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                      ${selectedApp === app.id
                                                ? "border-[#C9A227]/60 bg-[#C9A227]/10 shadow-[0_0_20px_rgba(201,162,39,0.2)]"
                                                : "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10"
                                            }`}
                                    >
                                        <div className="transition-transform duration-300 group-hover:scale-110">
                                            {app.icon}
                                        </div>
                                        <span className="text-white/70 text-xs font-medium group-hover:text-white transition-colors">{app.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Manual UPI */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                            <h3 className="text-white font-semibold mb-1">Pay with UPI ID</h3>
                            <p className="text-white/40 text-sm mb-5">Enter your UPI ID to pay directly</p>

                            <div className="relative mb-3">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <span className="text-white/30 text-sm">@</span>
                                </div>
                                <input
                                    type="text"
                                    value={upiId}
                                    onChange={(e) => {
                                        setUpiId(e.target.value);
                                        setUpiError("");
                                    }}
                                    placeholder="yourname@bankname"
                                    className={`w-full bg-white/5 border ${upiError ? "border-red-500/50" : "border-white/10"} rounded-xl pl-8 pr-4 py-3.5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#C9A227]/50 focus:ring-1 focus:ring-[#C9A227]/20 transition-all duration-200`}
                                />
                            </div>

                            {upiError && (
                                <p className="text-red-400/80 text-xs mb-3 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    {upiError}
                                </p>
                            )}

                            <button
                                onClick={handleManualPay}
                                disabled={!upiId || isProcessing}
                                className="w-full bg-[#C9A227] hover:bg-[#e8b92c] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(201,162,39,0.4)] active:scale-[0.98] text-sm tracking-wide"
                            >
                                Verify & Pay ₹{amountInRupees}
                            </button>

                            <p className="text-white/20 text-xs text-center mt-4 flex items-center justify-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                256-bit SSL encrypted · Powered by UPI
                            </p>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-2">
                        <OrderSummary
                            items={orderItems}
                            tableNumber={tableNumber || "---"}
                            customerName={guestName || "---"}
                        />

                        {/* Trust badges */}
                        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                            {[
                                { icon: "🔒", label: "Secure" },
                                { icon: "⚡", label: "Instant" },
                                { icon: "✅", label: "Verified" },
                            ].map((badge) => (
                                <div key={badge.label} className="bg-white/5 border border-white/5 rounded-xl py-3">
                                    <div className="text-lg mb-1">{badge.icon}</div>
                                    <div className="text-white/40 text-[10px] uppercase tracking-widest">{badge.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0d0b08] flex items-center justify-center">
                <div className="text-[#C9A227] animate-pulse text-lg">Loading checkout...</div>
            </div>
        }>
            <PaymentPageContent />
        </Suspense>
    );
}
