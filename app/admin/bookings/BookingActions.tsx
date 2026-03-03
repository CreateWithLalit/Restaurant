"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { sendBookingEmail } from "@/app/admin/settings/actions/send-email"; // Adjust the path if necessary

type BookingActionsProps = {
    bookingId: string;
    currentStatus: string;
    customerEmail: string | null;
    customerName: string;
    bookingDate: string;
    bookingTime: string;
};

export default function BookingActions({
    bookingId,
    currentStatus,
    customerEmail,
    customerName,
    bookingDate,
    bookingTime,
}: BookingActionsProps) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdating(true);

        // 1. Update the database
        const { error } = await supabase
            .from("bookings")
            .update({ status: newStatus })
            .eq("id", bookingId);

        if (error) {
            alert("Failed to update status: " + error.message);
            setIsUpdating(false);
            return;
        }

        // 2. If the user provided an email, send them a notification!
        if (customerEmail) {
            await sendBookingEmail(
                customerEmail,
                customerName,
                newStatus,
                new Date(bookingDate).toLocaleDateString(), // Format the date nicely
                bookingTime
            );
        }

        // 3. Refresh the page to show the new status badge
        router.refresh();
        setIsUpdating(false);
    };

    return (
        <div className="relative inline-block">
            <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isUpdating}
                className="cursor-pointer rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
            </select>
            {isUpdating && (
                <span className="ml-2 text-xs text-muted-foreground animate-pulse">
                    Saving & Sending...
                </span>
            )}
        </div>
    );
}