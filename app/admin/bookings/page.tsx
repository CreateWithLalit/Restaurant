"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BookingRow from "@/components/admin/BookingRow";

interface Booking {
    id: string;
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    booking_date: string;
    booking_time: string;
    guests: number;
    status: string;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Function to fetch initial bookings
    const fetchBookings = async () => {
        try {
            const { data, error } = await supabase
                .from("bookings")
                .select("*")
                .order("booking_date", { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();

        // ⚡ Set up Supabase Realtime subscription
        const channel = supabase
            .channel('realtime_bookings')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to INSERT, UPDATE, and DELETE
                    schema: 'public',
                    table: 'bookings',
                },
                (payload) => {
                    console.log('Realtime update received:', payload);

                    if (payload.eventType === 'INSERT') {
                        // Play notification sound
                        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
                        audio.play().catch(e => console.log("Audio play failed:", e));

                        setBookings((prev) => [payload.new as Booking, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setBookings((prev) =>
                            prev.map((b) => (b.id === payload.new.id ? (payload.new as Booking) : b))
                        );
                    } else if (payload.eventType === 'DELETE') {
                        setBookings((prev) => prev.filter((b) => b.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (loading) {
        return (
            <div className="p-8 bg-[#111111] min-h-screen text-[#F5F1E6]/40 flex items-center justify-center">
                <p className="animate-pulse tracking-widest uppercase text-xs">Loading reservations...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-[#111111] min-h-screen text-red-500">
                <p>Error loading bookings: {error}</p>
            </div>
        );
    }

    return (
        <div className="p-8 bg-[#111111] min-h-screen">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#F5F1E6] tracking-wide">Booking Management</h1>
                    <p className="text-[#C9A227] text-[10px] font-bold tracking-[0.2em] uppercase mt-2 border-l border-[#C9A227] pl-3 py-1 bg-[#C9A227]/5">
                        Live updates enabled
                    </p>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-[#F5F1E6]/10 bg-secondary/30 backdrop-blur-sm shadow-xl">
                {/* Responsive Header (Desktop only) */}
                <div className="hidden md:grid grid-cols-5 bg-[#1a1a1a] text-[#C9A227] border-b border-[#F5F1E6]/10 py-4 px-4 sticky top-0 z-10">
                    <span className="font-semibold tracking-[0.2em] uppercase text-[10px]">Customer</span>
                    <span className="font-semibold tracking-[0.2em] uppercase text-[10px]">Date & Time</span>
                    <span className="font-semibold tracking-[0.2em] uppercase text-[10px]">Guests</span>
                    <span className="font-semibold tracking-[0.2em] uppercase text-[10px]">Status</span>
                    <span className="font-semibold tracking-[0.2em] uppercase text-[10px] text-right">Actions</span>
                </div>

                <div className="flex flex-col">
                    {bookings && bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <BookingRow key={booking.id} booking={booking} />
                        ))
                    ) : (
                        <div className="p-12 text-center text-[#F5F1E6]/40 flex flex-col items-center gap-3">
                            <span className="text-4xl text-[#C9A227]/20 opacity-50">🍽️</span>
                            <p className="tracking-wide">No reservations found yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}