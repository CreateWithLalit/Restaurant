"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

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

interface BookingRowProps {
    booking: Booking;
}

export default function BookingRow({ booking: initialBooking }: BookingRowProps) {
    const [booking, setBooking] = useState(initialBooking);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    const updateStatus = async (newStatus: "confirmed" | "cancelled") => {
        setIsLoading(true);
        try {
            const { error } = await supabase
                .from("bookings")
                .update({ status: newStatus })
                .eq("id", booking.id);

            if (error) throw error;

            setBooking({ ...booking, status: newStatus });
        } catch (error) {
            console.error("Error updating booking status:", error);
            alert("Failed to update booking status. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const confirmBooking = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/bookings/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId: booking.id }),
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error || "Failed to confirm booking");

            setBooking({ ...booking, status: "confirmed" });
        } catch (error: any) {
            console.error("Error confirming booking:", error);
            alert(error.message || "Failed to confirm booking. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this booking permanently?")) return;

        setIsLoading(true);
        try {
            const { error } = await supabase
                .from("bookings")
                .delete()
                .eq("id", booking.id);

            if (error) throw error;

            setIsDeleted(true);
        } catch (error) {
            console.error("Error deleting booking:", error);
            alert("Failed to delete booking. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isDeleted) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 p-5 md:p-4 border-b border-[#F5F1E6]/10 hover:bg-[#F5F1E6]/5 transition-colors">
            {/* Customer Column */}
            <div className="flex flex-col">
                <span className="md:hidden text-[10px] font-bold tracking-[0.2em] uppercase text-[#C9A227] mb-1.5 opacity-60">Customer</span>
                <p className="font-medium text-[#F5F1E6] truncate">{booking.customer_name}</p>
                <div className="flex flex-col gap-0.5 mt-1 overflow-hidden">
                    <p className="text-xs text-[#F5F1E6]/40 truncate">{booking.customer_phone}</p>
                    {booking.customer_email && (
                        <p className="text-xs text-[#F5F1E6]/40 truncate">{booking.customer_email}</p>
                    )}
                </div>
            </div>

            {/* Date & Time Column */}
            <div className="flex flex-col">
                <span className="md:hidden text-[10px] font-bold tracking-[0.2em] uppercase text-[#C9A227] mb-1.5 opacity-60">Date & Time</span>
                <p className="text-[#F5F1E6] text-sm md:text-base font-medium">{new Date(booking.booking_date).toLocaleDateString()}</p>
                <p className="text-xs text-[#F5F1E6]/40 lowercase tracking-wider">{booking.booking_time}</p>
            </div>

            {/* Guests Column */}
            <div className="flex flex-col md:items-start text-[#F5F1E6]">
                <span className="md:hidden text-[10px] font-bold tracking-[0.2em] uppercase text-[#C9A227] mb-1.5 opacity-60">Guests</span>
                <p className="font-medium tracking-wide">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
            </div>

            {/* Status Column */}
            <div className="flex flex-col md:items-start">
                <span className="md:hidden text-[10px] font-bold tracking-[0.2em] uppercase text-[#C9A227] mb-2 opacity-60">Status</span>
                <span className={`inline-flex items-center rounded-sm px-2.5 py-1 text-[9px] font-black tracking-[0.2em] uppercase border w-fit
                    ${booking.status === 'confirmed'
                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                        : booking.status === 'cancelled'
                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                            : 'bg-[#C9A227]/10 text-[#C9A227] border-[#C9A227]/20'}`}>
                    {booking.status}
                </span>
            </div>

            {/* Actions Column */}
            <div className="flex flex-col md:items-end gap-3 mt-3 md:mt-0">
                <span className="md:hidden text-[10px] font-bold tracking-[0.2em] uppercase text-[#C9A227] mb-1 opacity-60">Quick Actions</span>
                <div className="flex gap-4 md:gap-5">
                    {booking.status !== 'confirmed' && (
                        <button
                            onClick={confirmBooking}
                            disabled={isLoading}
                            className="text-[10px] font-black tracking-[0.3em] uppercase text-green-500 hover:text-green-400 disabled:opacity-50 transition-all active:scale-95 border border-green-500/20 px-4 py-2.5 md:p-0 md:border-0 rounded-sm bg-green-500/5 md:bg-transparent"
                        >
                            {isLoading ? '...' : 'Confirm'}
                        </button>
                    )}
                    {booking.status !== 'cancelled' && (
                        <button
                            onClick={() => updateStatus('cancelled')}
                            disabled={isLoading}
                            className="text-[10px] font-black tracking-[0.3em] uppercase text-red-500 hover:text-red-400 disabled:opacity-50 transition-all active:scale-95 border border-red-500/20 px-4 py-2.5 md:p-0 md:border-0 rounded-sm bg-red-500/5 md:bg-transparent"
                        >
                            {isLoading ? '...' : 'Cancel'}
                        </button>
                    )}
                    <button
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500 hover:text-red-500 disabled:opacity-50 transition-all active:scale-95 border border-gray-500/20 px-4 py-2.5 md:p-0 md:border-0 rounded-sm hover:bg-red-500/5 md:hover:bg-transparent"
                    >
                        {isLoading ? '...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}
