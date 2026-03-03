"use client"

import { useCallback } from "react"

interface HeroSectionProps {
    restaurantName: string
    tagline: string
    backgroundImage?: string
}

export default function HeroSection({
    restaurantName,
    tagline,
    backgroundImage,
}: HeroSectionProps) {
    const handleBookClick = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault()
            const el = document.getElementById("booking")
            if (el) {
                el.scrollIntoView({ behavior: "smooth" })
            }
        },
        []
    )

    return (
        <section
            id="home"
            className="relative flex h-screen min-h-[600px] items-center justify-center overflow-hidden"
        >
            {/* Background — image or gradient fallback */}
            {backgroundImage ? (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                    aria-hidden="true"
                />
            ) : (
                <div
                    className="absolute inset-0 bg-gradient-to-b from-[#111111] via-[#1a1812] to-[#111111]"
                    aria-hidden="true"
                />
            )}

            {/* Dark overlay */}
            <div
                className="absolute inset-0 bg-[#111111]/10"
                aria-hidden="true"
            />

            {/* Decorative vignette edges */}
            <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,#111111_100%)] opacity-70"
                aria-hidden="true"
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center px-6 text-center">
                {/* Small label */}
                <span
                    className="mb-4 text-xs font-medium tracking-[0.3em] text-[#C9A227] uppercase opacity-0 animate-hero-fade-in md:text-sm"
                >
                    Welcome to
                </span>

                {/* Decorative line above name */}
                <div
                    className="mb-6 flex items-center gap-3 opacity-0 animate-hero-fade-in-delay"
                    aria-hidden="true"
                >
                    <span className="block h-px w-10 bg-[#C9A227]/50 md:w-16" />
                    <span className="block h-1.5 w-1.5 rotate-45 border border-[#C9A227]/60" />
                    <span className="block h-px w-10 bg-[#C9A227]/50 md:w-16" />
                </div>

                {/* Restaurant name */}
                <h1
                    className="font-serif text-5xl font-bold leading-tight tracking-wide text-[#F5F1E6] opacity-0 animate-hero-fade-in-delay text-balance sm:text-6xl md:text-7xl lg:text-8xl"
                >
                    {restaurantName}
                </h1>

                {/* Decorative line below name */}
                <div
                    className="mt-6 flex items-center gap-3 opacity-0 animate-hero-fade-in-delay-2"
                    aria-hidden="true"
                >
                    <span className="block h-px w-10 bg-[#C9A227]/50 md:w-16" />
                    <span className="block h-1.5 w-1.5 rotate-45 border border-[#C9A227]/60" />
                    <span className="block h-px w-10 bg-[#C9A227]/50 md:w-16" />
                </div>

                {/* Tagline */}
                <p
                    className="mt-6 max-w-md text-base font-light italic leading-relaxed text-[#C9A227] opacity-0 animate-hero-fade-in-delay-2 text-pretty md:max-w-lg md:text-lg lg:text-xl"
                >
                    {tagline}
                </p>

                {/* CTA Button */}
                <a
                    href="#booking"
                    onClick={handleBookClick}
                    className="mt-10 inline-block rounded-sm border border-[#C9A227] bg-[#C9A227] px-8 py-3.5 text-sm font-semibold tracking-[0.2em] text-[#111111] uppercase opacity-0 animate-hero-fade-in-delay-3 transition-all duration-300 hover:bg-transparent hover:text-[#C9A227] hover:shadow-[0_0_20px_rgba(201,162,39,0.2)] md:px-10 md:py-4 md:text-base"
                >
                    Book a Table
                </a>
            </div>

            {/* Scroll indicator */}
            <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-hero-fade-in-delay-3"
                aria-hidden="true"
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-medium tracking-[0.3em] text-[#F5F1E6]/40 uppercase">
                        Scroll
                    </span>
                    <div className="h-8 w-px animate-pulse bg-gradient-to-b from-[#C9A227]/60 to-transparent" />
                </div>
            </div>
        </section>
    )
}
