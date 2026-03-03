"use client"

import { useEffect, useRef } from "react"

interface MapSectionProps {
    mapsEmbedUrl: string
    address: string
    phone: string
    email: string
}

export default function MapSection({
    mapsEmbedUrl,
    address,
    phone,
    email,
}: MapSectionProps) {
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
            { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
        )

        elements.forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    }, [])

    const contactDetails = [
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                >
                    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
            ),
            label: "Address",
            value: address,
            href: `https://maps.google.com/?q=${encodeURIComponent(address)}`,
        },
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
            ),
            label: "Phone",
            value: phone,
            href: `tel:${phone.replace(/\s/g, "")}`,
        },
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
            ),
            label: "Email",
            value: email,
            href: `mailto:${email}`,
        },
    ]

    return (
        <section ref={sectionRef} id="contact" className="bg-[#111111] py-16">
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
                {/* Section heading */}
                <div className="scroll-fade mb-12 text-center">
                    <p className="mb-3 text-xs font-medium tracking-[0.3em] text-[#C9A227] uppercase">
                        Visit Us
                    </p>
                    <h2 className="font-serif text-4xl font-semibold tracking-wide text-[#F5F1E6] text-balance md:text-5xl">
                        Find Us
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

                {/* Map embed */}
                <div className="scroll-fade overflow-hidden rounded-lg border border-[#C9A227]/20">
                    <iframe
                        src={mapsEmbedUrl}
                        title="Restaurant location on Google Maps"
                        className="h-[350px] w-full border-0 grayscale-[30%] md:h-[420px]"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>

                {/* Contact details */}
                <div
                    className="scroll-fade mt-10 flex flex-col items-center justify-center gap-6 md:flex-row md:gap-12"
                    style={{ transitionDelay: "150ms" }}
                >
                    {contactDetails.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            target={item.label === "Address" ? "_blank" : undefined}
                            rel={item.label === "Address" ? "noopener noreferrer" : undefined}
                            className="group flex items-center gap-3 transition-colors duration-300"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227] ring-1 ring-[#C9A227]/20 transition-all duration-300 group-hover:bg-[#C9A227]/20 group-hover:ring-[#C9A227]/40">
                                {item.icon}
                            </span>
                            <span className="flex flex-col">
                                <span className="text-[10px] font-medium tracking-[0.2em] text-[#C9A227]/60 uppercase">
                                    {item.label}
                                </span>
                                <span className="text-sm text-[#F5F1E6]/80 transition-colors duration-300 group-hover:text-[#C9A227]">
                                    {item.value}
                                </span>
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}
