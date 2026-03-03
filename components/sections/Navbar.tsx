"use client"

import { useState, useEffect, useCallback } from "react"

interface NavLink {
    label: string
    href: string
}

const NAV_LINKS: NavLink[] = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Menu", href: "#menu" },
    { label: "Why Us", href: "#why-us" },
    { label: "Book Table", href: "#booking" },
    { label: "Contact", href: "#contact" },
]

interface NavbarProps {
    restaurantName: string
}

export default function Navbar({ restaurantName }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        handleScroll()
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMobileOpen(false)
            }
        }
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [mobileOpen])

    const handleLinkClick = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
            e.preventDefault()
            setMobileOpen(false)
            const targetId = href.replace("#", "")
            const el = document.getElementById(targetId)
            if (el) {
                el.scrollIntoView({ behavior: "smooth" })
            }
        },
        []
    )

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? "bg-[#111111]/90 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.4)]"
                : "bg-[#111111]"
                }`}
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                {/* Logo / Restaurant Name */}
                <a
                    href="#home"
                    onClick={(e) => handleLinkClick(e, "#home")}
                    className="font-serif text-2xl tracking-wide text-[#C9A227] transition-opacity hover:opacity-80 lg:text-3xl"
                >
                    {restaurantName}
                </a>

                {/* Desktop Nav Links */}
                <ul className="hidden items-center gap-1 lg:flex" role="list">
                    {NAV_LINKS.map((link) => (
                        <li key={link.href}>
                            {link.label === "Book Table" ? (
                                <a
                                    href={link.href}
                                    onClick={(e) => handleLinkClick(e, link.href)}
                                    className="ml-2 inline-block rounded-sm border border-[#C9A227] bg-[#C9A227] px-5 py-2 text-sm font-medium tracking-wider text-[#111111] uppercase transition-all duration-300 hover:bg-transparent hover:text-[#C9A227]"
                                >
                                    {link.label}
                                </a>
                            ) : (
                                <a
                                    href={link.href}
                                    onClick={(e) => handleLinkClick(e, link.href)}
                                    className="group relative px-4 py-2 text-sm font-medium tracking-wider text-[#F5F1E6] uppercase transition-colors duration-300 hover:text-[#C9A227]"
                                >
                                    {link.label}
                                    <span className="absolute bottom-0 left-4 right-4 h-px origin-left scale-x-0 bg-[#C9A227] transition-transform duration-300 ease-out group-hover:scale-x-100" />
                                </a>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Mobile Hamburger Button */}
                <button
                    type="button"
                    className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
                    onClick={() => setMobileOpen((prev) => !prev)}
                    aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={mobileOpen}
                >
                    <span
                        className={`block h-0.5 w-6 rounded-full bg-[#C9A227] transition-all duration-300 ${mobileOpen ? "translate-y-2 rotate-45" : ""
                            }`}
                    />
                    <span
                        className={`block h-0.5 w-6 rounded-full bg-[#C9A227] transition-all duration-300 ${mobileOpen ? "scale-x-0 opacity-0" : ""
                            }`}
                    />
                    <span
                        className={`block h-0.5 w-6 rounded-full bg-[#C9A227] transition-all duration-300 ${mobileOpen ? "-translate-y-2 -rotate-45" : ""
                            }`}
                    />
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out lg:hidden ${mobileOpen ? "max-h-[calc(100vh-72px)] opacity-100" : "max-h-0 opacity-0"
                    }`}
                inert={!mobileOpen}
            >
                <div className="border-t border-[#C9A227]/20 bg-[#111111]/95 backdrop-blur-lg">
                    <ul className="flex flex-col items-center gap-2 px-6 py-8" role="list">
                        {NAV_LINKS.map((link, index) => (
                            <li
                                key={link.href}
                                className="w-full text-center"
                                style={{
                                    transitionDelay: mobileOpen ? `${index * 60}ms` : "0ms",
                                }}
                            >
                                {link.label === "Book Table" ? (
                                    <a
                                        href={link.href}
                                        onClick={(e) => handleLinkClick(e, link.href)}
                                        className={`mt-2 inline-block rounded-sm border border-[#C9A227] bg-[#C9A227] px-8 py-3 text-sm font-medium tracking-wider text-[#111111] uppercase transition-all duration-300 hover:bg-transparent hover:text-[#C9A227] ${mobileOpen
                                            ? "translate-y-0 opacity-100"
                                            : "translate-y-2 opacity-0"
                                            }`}
                                    >
                                        {link.label}
                                    </a>
                                ) : (
                                    <a
                                        href={link.href}
                                        onClick={(e) => handleLinkClick(e, link.href)}
                                        className={`group relative inline-block py-3 text-base font-medium tracking-wider text-[#F5F1E6] uppercase transition-all duration-300 hover:text-[#C9A227] ${mobileOpen
                                            ? "translate-y-0 opacity-100"
                                            : "translate-y-2 opacity-0"
                                            }`}
                                    >
                                        {link.label}
                                        <span className="absolute bottom-2 left-0 right-0 mx-auto h-px w-0 bg-[#C9A227] transition-all duration-300 ease-out group-hover:w-full" />
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    )
}
