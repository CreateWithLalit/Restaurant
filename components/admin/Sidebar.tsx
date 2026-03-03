"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

const navItems = [
    {
        name: "Bookings",
        href: "/admin/bookings",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
        ),
    },
    {
        name: "Menu Items",
        href: "/admin/menu",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>
        ),
    },
    {
        name: "Settings",
        href: "/admin/settings",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
        ),
    },
];

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
        router.refresh();
    };

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed left-4 top-4 z-50 rounded-lg bg-[#C9A227] p-2 text-[#111111] lg:hidden"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                )}
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-[#F5F1E6]/10 bg-[#111111] px-4 py-8 transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                }`}>
                <div className="mb-10 px-2">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                        <span className="font-serif text-2xl font-bold tracking-tighter text-[#C9A227]">
                            D-Dion
                        </span>
                        <span className="rounded-full bg-[#C9A227]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#C9A227]">
                            Admin
                        </span>
                    </Link>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-[#C9A227] text-[#111111]"
                                    : "text-[#F5F1E6]/60 hover:bg-[#F5F1E6]/5 hover:text-[#F5F1E6]"
                                    }`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        );
                    })}

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-400/10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        Logout
                    </button>
                </nav>

                <div className="absolute bottom-8 left-0 w-full px-4">
                    <Link
                        href="/"
                        className="flex w-full items-center gap-3 rounded-lg border border-[#F5F1E6]/10 px-3 py-3 text-sm font-medium text-[#F5F1E6]/60 transition-all duration-200 hover:bg-[#F5F1E6]/5 hover:text-[#F5F1E6]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                        Back to Site
                    </Link>
                </div>
            </aside>
        </>
    );
}
