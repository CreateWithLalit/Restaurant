"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

interface AboutSectionProps {
    aboutText: string
    imageUrl?: string
    rating?: string
}

export default function AboutSection({
    aboutText,
    imageUrl,
    rating = "4.8",
}: AboutSectionProps) {
    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const section = sectionRef.current
        if (!section) return

        const elements = section.querySelectorAll(".scroll-fade")

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible")
                    }
                })
            },
            { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
        )

        elements.forEach((el) => observer.observe(el))

        return () => observer.disconnect()
    }, [])

    const stats = [
        { value: `${rating}\u2605`, label: "Rating" },
        { value: "5+", label: "Years" },
        { value: "1000+", label: "Guests" },
    ]

    return (
        <section
            ref={sectionRef}
            id="about"
            className="bg-[#1C1A18] py-24"
        >
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 lg:flex-row lg:items-start lg:gap-16 lg:px-8">
                {/* Left — Image */}
                <div className="scroll-fade w-full flex-shrink-0 lg:w-[45%]">
                    <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-lg border-2 border-[#C9A227]/40 lg:mx-0">
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt="Inside the La Maison restaurant"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 45vw"
                            />
                        ) : (
                            <div
                                className="h-full w-full bg-gradient-to-br from-[#1C1A18] via-[#252218] to-[#1C1A18]"
                                aria-hidden="true"
                            />
                        )}

                        {/* Corner accents */}
                        <span
                            className="absolute top-3 left-3 h-6 w-6 border-t-2 border-l-2 border-[#C9A227]/60"
                            aria-hidden="true"
                        />
                        <span
                            className="absolute right-3 bottom-3 h-6 w-6 border-r-2 border-b-2 border-[#C9A227]/60"
                            aria-hidden="true"
                        />
                    </div>
                </div>

                {/* Right — Text content */}
                <div className="w-full lg:w-[55%] lg:pt-4">
                    {/* Gold label */}
                    <p className="scroll-fade mb-3 text-xs font-medium tracking-[0.3em] text-[#C9A227] uppercase">
                        Our Story
                    </p>

                    {/* Heading */}
                    <h2
                        className="scroll-fade font-serif text-4xl font-semibold tracking-wide text-[#F5F1E6] text-balance md:text-5xl"
                        style={{ transitionDelay: "100ms" }}
                    >
                        About Us
                    </h2>

                    {/* Decorative divider */}
                    <div
                        className="scroll-fade mt-5 mb-6 flex items-center gap-3"
                        style={{ transitionDelay: "150ms" }}
                        aria-hidden="true"
                    >
                        <span className="block h-px w-10 bg-[#C9A227]/50" />
                        <span className="block h-1.5 w-1.5 rotate-45 border border-[#C9A227]/60" />
                        <span className="block h-px w-10 bg-[#C9A227]/50" />
                    </div>

                    {/* About text */}
                    <p
                        className="scroll-fade max-w-lg text-base leading-relaxed text-[#F5F1E6]/75 text-pretty md:text-lg"
                        style={{ transitionDelay: "200ms" }}
                    >
                        {aboutText}
                    </p>

                    {/* Stat badges */}
                    <div
                        className="scroll-fade mt-8 flex flex-wrap gap-4"
                        style={{ transitionDelay: "300ms" }}
                    >
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="flex items-center gap-2.5 rounded-sm bg-[#C9A227]/10 px-5 py-3 ring-1 ring-[#C9A227]/25 transition-colors duration-300 hover:bg-[#C9A227]/20"
                            >
                                <span className="text-lg font-semibold text-[#C9A227]">
                                    {stat.value}
                                </span>
                                <span className="text-sm font-medium text-[#F5F1E6]/60">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
