"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import MenuCard from "../menu-card"

export interface MenuItem {
    id: string
    name: string
    description: string
    price: number
    category: string
    image_url: string
    available: boolean
    featured: boolean
}

interface MenuSectionProps {
    items: MenuItem[]
}

export default function MenuSection({ items }: MenuSectionProps) {
    const sectionRef = useRef<HTMLElement>(null)
    const [activeCategory, setActiveCategory] = useState("All")

    /* Derive unique categories from items */
    const categories = useMemo(() => {
        const cats = Array.from(new Set(items.map((item) => item.category)))
        return ["All", ...cats]
    }, [items])

    /* Filtered items */
    const filteredItems = useMemo(() => {
        if (activeCategory === "All") return items
        return items.filter((item) => item.category === activeCategory)
    }, [items, activeCategory])

    /* Scroll-fade observer */
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
            { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
        )

        elements.forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    }, [])

    return (
        <section ref={sectionRef} id="menu" className="bg-[#111111] py-24">
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
                {/* Section header */}
                <div className="scroll-fade mb-4 text-center">
                    <p className="mb-3 text-xs font-medium tracking-[0.3em] text-[#C9A227] uppercase">
                        Curated Selection
                    </p>
                </div>

                <h2
                    className="scroll-fade text-center font-serif text-4xl font-semibold tracking-wide text-[#F5F1E6] text-balance md:text-5xl"
                    style={{ transitionDelay: "100ms" }}
                >
                    Our Menu
                </h2>

                {/* Decorative divider */}
                <div
                    className="scroll-fade mx-auto mt-5 mb-10 flex items-center justify-center gap-3"
                    style={{ transitionDelay: "150ms" }}
                    aria-hidden="true"
                >
                    <span className="block h-px w-10 bg-[#C9A227]/50" />
                    <span className="block h-1.5 w-1.5 rotate-45 border border-[#C9A227]/60" />
                    <span className="block h-px w-10 bg-[#C9A227]/50" />
                </div>

                {/* Category filter buttons */}
                <div
                    className="scroll-fade mb-12 flex flex-wrap items-center justify-center gap-3"
                    style={{ transitionDelay: "200ms" }}
                    role="tablist"
                    aria-label="Menu category filter"
                >
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat
                        return (
                            <button
                                key={cat}
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => setActiveCategory(cat)}
                                className={`rounded-sm px-5 py-2 text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-300 ${isActive
                                    ? "bg-[#C9A227] text-[#111111] shadow-[0_0_16px_rgba(201,162,39,0.25)]"
                                    : "bg-transparent text-[#C9A227]/80 ring-1 ring-[#C9A227]/30 hover:bg-[#C9A227]/10 hover:ring-[#C9A227]/50"
                                    }`}
                            >
                                {cat}
                            </button>
                        )
                    })}
                </div>

                {/* Card grid */}
                <div
                    className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
                    role="tabpanel"
                >
                    {filteredItems.map((item, index) => (
                        <div
                            key={item.id}
                            className="scroll-fade"
                            style={{ transitionDelay: `${250 + index * 80}ms` }}
                        >
                            <MenuCard
                                id={item.id}
                                name={item.name}
                                description={item.description}
                                price={item.price}
                                category={item.category}
                                image_url={item.image_url}
                                available={item.available}
                            />
                        </div>
                    ))}
                </div>

                {/* Empty state */}
                {filteredItems.length === 0 && (
                    <p className="mt-12 text-center text-sm text-[#F5F1E6]/40">
                        No dishes found in this category.
                    </p>
                )}
            </div>
        </section>
    )
}
