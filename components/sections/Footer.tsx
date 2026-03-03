import Link from "next/link";

interface FooterProps {
    restaurantName: string
    tagline: string
    address: string
    phone: string
    email: string
    openingHours: string
    facebookUrl?: string
    instagramUrl?: string
    tripadvisorUrl?: string
}

export default function Footer({
    restaurantName,
    tagline,
    address,
    phone,
    email,
    openingHours,
    facebookUrl = "#",
    instagramUrl = "#",
    tripadvisorUrl = "#",
}: FooterProps) {
    const currentYear = new Date().getFullYear()

    const socialLinks = [
        { label: "Facebook", href: facebookUrl },
        { label: "Instagram", href: instagramUrl },
        { label: "TripAdvisor", href: tripadvisorUrl },
    ]

    return (
        <footer className="border-t border-[#C9A227]/20 bg-[#111111]">
            <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
                <div className="flex flex-col gap-10 md:flex-row md:gap-8">
                    {/* Brand column */}
                    <div className="flex-1">
                        <h3 className="font-serif text-2xl tracking-wide text-[#C9A227]">
                            {restaurantName}
                        </h3>
                        <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#F5F1E6]/50 text-pretty">
                            {tagline}
                        </p>
                        {/* Decorative divider — mobile only */}
                        <div className="mt-6 flex items-center gap-3 md:hidden" aria-hidden="true">
                            <span className="block h-px w-8 bg-[#C9A227]/30" />
                            <span className="block h-1 w-1 rotate-45 bg-[#C9A227]/40" />
                            <span className="block h-px w-8 bg-[#C9A227]/30" />
                        </div>
                    </div>

                    {/* Contact column */}
                    <div className="flex-1">
                        <h4 className="mb-4 text-xs font-semibold tracking-[0.25em] text-[#C9A227] uppercase">
                            Contact
                        </h4>
                        <ul className="flex flex-col gap-3 text-sm text-[#F5F1E6]/60" role="list">
                            <li className="flex items-start gap-2.5">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A227]/60"
                                    aria-hidden="true"
                                >
                                    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span>{address}</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4 shrink-0 text-[#C9A227]/60"
                                    aria-hidden="true"
                                >
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                <a
                                    href={`tel:${phone.replace(/\s/g, "")}`}
                                    className="transition-colors duration-300 hover:text-[#C9A227]"
                                >
                                    {phone}
                                </a>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4 shrink-0 text-[#C9A227]/60"
                                    aria-hidden="true"
                                >
                                    <rect width="20" height="16" x="2" y="4" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                <a
                                    href={`mailto:${email}`}
                                    className="transition-colors duration-300 hover:text-[#C9A227]"
                                >
                                    {email}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Hours & Socials column */}
                    <div className="flex-1">
                        <h4 className="mb-4 text-xs font-semibold tracking-[0.25em] text-[#C9A227] uppercase">
                            Hours & Socials
                        </h4>
                        <p className="whitespace-pre-line text-sm leading-relaxed text-[#F5F1E6]/60">
                            {openingHours}
                        </p>

                        {/* Social links */}
                        <div className="mt-5 flex items-center gap-4">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Visit us on ${link.label}`}
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C9A227]/10 text-xs font-semibold text-[#C9A227] ring-1 ring-[#C9A227]/20 transition-all duration-300 hover:bg-[#C9A227] hover:text-[#111111] hover:ring-[#C9A227]"
                                >
                                    {link.label === "Facebook" && (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                                            <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
                                        </svg>
                                    )}
                                    {link.label === "Instagram" && (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                        </svg>
                                    )}
                                    {link.label === "TripAdvisor" && (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm4 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                                        </svg>
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>


            {/* Bottom bar */}
            <div className="border-t border-[#C9A227]/10 bg-[#0D0D0D]">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-5 md:flex-row lg:px-8">
                    <p className="text-xs tracking-wider text-[#F5F1E6]/30">
                        {`\u00A9 ${currentYear} ${restaurantName}. All rights reserved.`}
                    </p>
                    <Link
                        href="/admin"
                        className="text-[10px] font-medium tracking-widest text-[#F5F1E6]/20 uppercase transition-colors duration-300 hover:text-[#C9A227]"
                    >
                        Admin Login
                    </Link>
                </div>
            </div>
        </footer>
    )
}
