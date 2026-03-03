"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingEmail(
    email: string,
    name: string,
    status: string,
    date: string,
    time: string
) {
    // If the customer didn't provide an email, or the status is set back to pending, do nothing.
    if (!email || status === "pending") {
        return { success: true };
    }

    const subject =
        status === "confirmed"
            ? "Your Table is Confirmed! - D-Dion"
            : "Booking Update - D-Dion";

    let htmlContent = "";

    if (status === "confirmed") {
        htmlContent = `
      <div style="font-family: sans-serif; color: #111;">
        <h2>Hi ${name},</h2>
        <p>Great news! Your booking on <strong>${date}</strong> at <strong>${time}</strong> is <strong style="color: green;">confirmed</strong>.</p>
        <p>We look forward to hosting you at D-Dion.</p>
      </div>
    `;
    } else if (status === "cancelled") {
        htmlContent = `
      <div style="font-family: sans-serif; color: #111;">
        <h2>Hi ${name},</h2>
        <p>Unfortunately, we are unable to accommodate your booking request for ${date} at ${time} and it has been <strong style="color: red;">cancelled</strong>.</p>
        <p>We apologize for the inconvenience and hope to serve you another time.</p>
      </div>
    `;
    }

    try {
        const data = await resend.emails.send({
            // ⚠️ IMPORTANT NOTE FOR TESTING:
            // Until you verify a real domain (like d-dion.com) in Resend, you MUST use this exact 'from' address:
            from: "D-Dion Reservations <onboarding@resend.dev>",

            // And you can ONLY send emails 'to' the email address you used to sign up for Resend!
            to: email,
            subject: subject,
            html: htmlContent,
        });

        return { success: true, data };
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, error };
    }
}