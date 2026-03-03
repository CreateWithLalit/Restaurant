"use client"

import { useEffect, useRef } from "react"

interface Feature {
    icon: React.ReactNode
    title: string
    description: string
}

interface WhyUsSectionProps {
    features?: Feature[]
}

const LeafIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8"
        aria-hidden="true"
    >
        <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 1 8-1.5 5.5-4 6-6 6.5" />
        <path d="M10.7 20.7a7 7 0 0 0 2.5-13.6" />
        <path d="M7.3 14.5c2-3 4.7-5 8.7-7.5" />
    </svg>
)

const FlameIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8"
        aria-hidden="true"
    >
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
)

const ClockIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8"
        aria-hidden="true"
    >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
)

const DEFAULT_FEATURES: Feature[] = [
    {
        icon: <LeafIcon />,
        title: "Fresh Ingredients",
        description:
            "We source our produce daily from local farms and artisan suppliers, ensuring every dish bursts with authentic, seasonal flavour.",
    },
    {
        icon: <FlameIcon />,
        title: "Cozy Ambience",
        description:
            "Candlelit tables, soft jazz, and warm interiors create the perfect backdrop for intimate dinners and celebrations.",
    },
    {
        icon: <ClockIcon />,
        title: "Quick Service",
        description:
            "Our kitchen is choreographed to perfection, delivering Michelin-level dishes without the wait, so you can savour every moment.",
    },
]

export default function WhyUsSection({
    features = DEFAULT_FEATURES,
}: WhyUsSectionProps) {
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

    return (
        <section ref={sectionRef} id="why-us" className="bg-[#1C1A18] py-20">
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
                {/* Section heading */}
                <div className="scroll-fade mb-16 text-center">
                    <p className="mb-3 text-xs font-medium tracking-[0.3em] text-[#C9A227] uppercase">
                        Our Difference
                    </p>
                    <h2 className="font-serif text-4xl font-semibold tracking-wide text-[#F5F1E6] text-balance md:text-5xl">
                        Why Choose Us
                    </h2>
                    <div
                        className="mx-auto mt-5 flex items-center justify-center gap-3"
                        aria-hidden="true"
                    >
                        <span className="block h-px w-10 bg-[#C9A227]/50" />
                        <span className="block h-1.5 w-1.5 rotate-45 border border-[#C9A227]/60" />
                        <span className="block h-px w-10 bg-[#C9A227]/50" />
                    </div>
                </div>

                {/* Feature cards */}
                <div className="flex flex-col items-stretch gap-6 md:flex-row md:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className="scroll-fade group flex-1 rounded-lg border border-transparent bg-[#111111] p-8 text-center transition-all duration-500 hover:border-[#C9A227]/50 hover:shadow-[0_0_30px_rgba(201,162,39,0.08)]"
                            style={{ transitionDelay: `${index * 120}ms` }}
                        >
                            {/* Icon */}
                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227] ring-1 ring-[#C9A227]/20 transition-all duration-500 group-hover:bg-[#C9A227]/20 group-hover:ring-[#C9A227]/40">
                                {feature.icon}
                            </div>

                            {/* Title */}
                            <h3 className="mb-3 font-serif text-xl font-semibold tracking-wide text-[#F5F1E6]">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm leading-relaxed text-[#F5F1E6]/60 text-pretty">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
