"use client"

import React from "react"
import Image from "next/image"

interface MenuCardProps {
    name: string
    description: string
    price: number
    category: string
    image_url: string
    available: boolean
}

const MenuCard: React.FC<MenuCardProps> = ({
    name,
    description,
    price,
    category,
    image_url,
    available,
}) => {
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
                    unoptimized
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
                <div className="mt-auto pt-2 sm:pt-4 border-t border-accent/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s} className="text-accent text-xs">★</span>
                        ))}
                    </div>
                    <button
                        disabled={!available}
                        className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${available
                            ? "text-accent hover:text-white flex items-center gap-2"
                            : "text-white/20"
                            }`}
                    >
                        {available ? (
                            <>
                                Order Now
                                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                            </>
                        ) : "Unavailable"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MenuCard
