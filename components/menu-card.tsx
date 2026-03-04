"use client"

import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface MenuCardProps {
    id?: string
    name: string
    description: string
    price: number
    category: string
    image_url: string
    available: boolean
}

const MenuCard: React.FC<MenuCardProps> = ({
    id,
    name,
    description,
    price,
    category,
    image_url,
    available,
}) => {
    const router = useRouter()

    function handleOrder() {
        const items = encodeURIComponent(JSON.stringify([{ id: id || "1", name, price, quantity: 1 }]))
        router.push(`/checkout?table=A-01&name=Guest&items=${items}`)
    }
    return (
        <div className="group relative flex flex-col h-full bg-secondary/30 backdrop-blur-sm border border-accent/10 rounded-lg overflow-hidden transition-all duration-500 hover:border-accent/30 hover:shadow-[0_8px_32px_rgba(201,162,39,0.15)] hover:-translate-y-1">
            {/* Availability Badge */}
            {!available && (
                <div className="absolute top-4 right-4 z-10 bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-white/10">
                    Sold Out
                </div>
            )}

            {/* Image Container */}
            <div className="relative aspect-[3/2] w-full overflow-hidden">
                <Image
                    src={image_url || "/placeholder-food.jpg"}
                    alt={name}
                    fill
                    className={`object-cover transition-transform duration-700 group-hover:scale-110 ${!available ? "grayscale opacity-50" : ""}`}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-60" />

                {/* Category Badge on Image */}
                <div className="absolute bottom-4 left-4">
                    <span className="text-[10px] font-semibold tracking-[0.2em] text-accent uppercase bg-primary/80 backdrop-blur-md px-2 py-1 rounded-sm border border-accent/20">
                        {category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-1 sm:gap-4 mb-2 sm:mb-3">
                    <h3 className="font-heading text-base sm:text-lg md:text-xl text-cream group-hover:text-accent transition-colors duration-300 line-clamp-1">
                        {name}
                    </h3>
                    <span className="font-heading text-sm sm:text-base md:text-lg font-medium text-accent">
                        ₹{(price / 100).toFixed(2)}
                    </span>
                </div>

                <p className="text-secondary-foreground/70 text-[10px] sm:text-xs md:text-sm leading-relaxed mb-4 sm:mb-6 line-clamp-2 italic font-body">
                    {description}
                </p>

                {/* Action / Interaction */}
                <div className="mt-auto pt-4 border-t border-accent/5 flex flex-col items-stretch gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <span key={s} className="text-accent text-xs">★</span>
                            ))}
                        </div>
                        <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Verified Chef Choice</span>
                    </div>

                    <button
                        disabled={!available}
                        onClick={handleOrder}
                        className={`group/btn relative w-full py-3 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-500 overflow-hidden
                            ${available
                                ? "bg-accent text-primary shadow-[0_4px_20px_rgba(201,162,39,0.2)] hover:shadow-[0_8px_32px_rgba(201,162,39,0.4)] hover:-translate-y-0.5 active:scale-95"
                                : "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
                            }`}
                    >
                        {/* Shimmer effect */}
                        {available && (
                            <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                        )}

                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {available ? (
                                <>
                                    Add to Order
                                    <svg className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            ) : "Out of Stock"}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MenuCard
