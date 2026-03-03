import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { bookingId } = await request.json();

        if (!bookingId) {
            return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
        }

        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                },
            }
        );

        // 1. Verify User is Authenticated (Admin)
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Fetch Booking Details
        const { data: booking, error: fetchError } = await supabase
            .from("bookings")
            .select("*")
            .eq("id", bookingId)
            .single();

        if (fetchError || !booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        // 3. Update Status in Database
        const { error: updateError } = await supabase
            .from("bookings")
            .update({ status: "confirmed" })
            .eq("id", bookingId);

        if (updateError) {
            throw updateError;
        }

        // 4. Send Confirmation Email if Email exists
        console.log("Attempting to send email to:", booking.customer_email);
        if (booking.customer_email) {
            try {
                const emailResponse = await resend.emails.send({
                    from: `D-DION Restaurant <onboarding@resend.dev>`, // Default Resend test sender
                    to: booking.customer_email,
                    subject: "Your Reservation is Confirmed! 🍽️",
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                            <h2 style="color: #C9A227; text-align: center;">Reservation Confirmed</h2>
                            <p>Dear <strong>${booking.customer_name}</strong>,</p>
                            <p>We are delighted to inform you that your reservation at <strong>D-DION Restaurant</strong> has been successfully confirmed.</p>
                            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <p style="margin: 5px 0;"><strong>Date:</strong> ${booking.booking_date}</p>
                                <p style="margin: 5px 0;"><strong>Time:</strong> ${booking.booking_time}</p>
                                <p style="margin: 5px 0;"><strong>Guests:</strong> ${booking.guests}</p>
                            </div>
                            <p>We look forward to serving you an exceptional meal. If you need to make any changes, please give us a call.</p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                            <p style="text-align: center; color: #888; font-size: 12px;">D-DION Restaurant | Your Finest Culinary Destination</p>
                        </div>
                    `,
                });
                console.log("Resend API Response:", emailResponse);
            } catch (emailError) {
                console.error("Failed to send email error:", emailError);
            }
        } else {
            console.log("No customer email found for this booking.");
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Confirmation error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
