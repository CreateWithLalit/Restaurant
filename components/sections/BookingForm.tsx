"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createBrowserClient } from "@supabase/ssr"

/* ------------------------------------------------------------------ */
/* Validation schema                                                 */
/* ------------------------------------------------------------------ */

const bookingSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    phone: z
        .string()
        .length(10, "Phone number must be exactly 10 digits")
        .regex(/^\d+$/, "Phone must contain only numbers"),
    email: z
        .string()
        .optional()
        .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
            message: "Enter a valid email address",
        }),
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required"),
    guests: z.string().min(1, "Number of guests is required"),
    specialRequests: z.string().optional(),
})

type BookingFormValues = z.infer<typeof bookingSchema>

/* ------------------------------------------------------------------ */
/* Time slots helper                                                 */
/* ------------------------------------------------------------------ */

function generateTimeSlots(): string[] {
    const slots: string[] = []
    for (let h = 12; h <= 23; h++) {
        for (const m of [0, 30]) {
            if (h === 23 && m === 30) continue
            const hour12 = h > 12 ? h - 12 : h
            const ampm = h >= 12 ? "PM" : "AM"
            const minutes = m.toString().padStart(2, "0")
            slots.push(`${hour12}:${minutes} ${ampm}`)
        }
    }
    return slots
}

const TIME_SLOTS = generateTimeSlots()
const GUEST_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"]

/* ------------------------------------------------------------------ */
/* Shared input classes                                              */
/* ------------------------------------------------------------------ */

const inputBase =
    "w-full rounded-md border border-[#F5F1E6]/10 bg-[#111111] px-4 py-3 text-sm text-[#F5F1E6] placeholder-[#F5F1E6]/30 transition-colors duration-200 focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227]/40"

const selectBase =
    "w-full appearance-none rounded-md border border-[#F5F1E6]/10 bg-[#111111] px-4 py-3 text-sm text-[#F5F1E6] transition-colors duration-200 focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227]/40"

/* ------------------------------------------------------------------ */
/* Component                                                         */
/* ------------------------------------------------------------------ */

export default function BookingForm() {
    const sectionRef = useRef<HTMLElement>(null)
    const [submitted, setSubmitted] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    // Initialize Supabase client
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    /* Scroll-fade observer */
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
            { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
        )

        elements.forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    }, [])

    /* Today's date for min attribute (YYYY-MM-DD) */
    const today = new Date().toISOString().split("T")[0]

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            fullName: "",
            phone: "",
            email: "",
            date: "",
            time: "",
            guests: "",
            specialRequests: "",
        },
    })

    async function onSubmit(data: BookingFormValues) {
        setSubmitError(null)
        setSubmitted(false)

        // Clean up data to match the database schema
        // Convert "10+" to the integer 10
        const guestCount = parseInt(data.guests.replace('+', ''), 10)

        // Note: specialRequests is not currently in the DB schema, so it is omitted from the insert payload
        const { error } = await supabase.from("bookings").insert([
            {
                customer_name: data.fullName,
                customer_phone: data.phone,
                customer_email: data.email || null,
                booking_date: data.date,
                booking_time: data.time, // Postgres automatically handles "6:30 PM" formatting
                guests: guestCount,
            },
        ])

        if (error) {
            setSubmitError(error.message)
        } else {
            setSubmitted(true)
            reset()
        }
    }

    return (
        <section
            ref={sectionRef}
            id="booking"
            className="bg-[#1C1A18] py-24"
        >
            <div className="mx-auto max-w-[600px] px-6">
                {/* ---------- Header ---------- */}
                <div className="scroll-fade mb-10 text-center">
                    <p className="mb-3 text-xs font-medium tracking-[0.3em] text-[#C9A227] uppercase">
                        Reserve Your Spot
                    </p>

                    <h2 className="font-serif text-4xl font-semibold tracking-wide text-[#F5F1E6] text-balance md:text-5xl">
                        Book a Table
                    </h2>

                    {/* Decorative divider */}
                    <div
                        className="mx-auto mt-5 flex items-center justify-center gap-3"
                        aria-hidden="true"
                    >
                        <span className="block h-px w-10 bg-[#C9A227]/50" />
                        <span className="block h-1.5 w-1.5 rotate-45 border border-[#C9A227]/60" />
                        <span className="block h-px w-10 bg-[#C9A227]/50" />
                    </div>
                </div>

                {/* ---------- Success message ---------- */}
                {submitted && (
                    <div className="mb-8 rounded-md border border-green-500/30 bg-green-500/10 px-5 py-4 text-center text-sm font-medium text-green-400">
                        Booking received! We will confirm shortly.
                    </div>
                )}

                {/* ---------- Error message ---------- */}
                {submitError && (
                    <div className="mb-8 rounded-md border border-red-500/30 bg-red-500/10 px-5 py-4 text-center text-sm font-medium text-red-400">
                        Failed to secure booking: {submitError}
                    </div>
                )}

                {/* ---------- Form card ---------- */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="scroll-fade rounded-xl border border-[#F5F1E6]/5 bg-[#1C1A18] p-6 shadow-xl shadow-black/20 ring-1 ring-[#C9A227]/10 sm:p-8"
                    style={{ transitionDelay: "150ms" }}
                >
                    {/* Two-column grid */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {/* Full Name */}
                        <div>
                            <label
                                htmlFor="fullName"
                                className="mb-1.5 block text-xs font-medium tracking-wider text-[#F5F1E6]/60 uppercase"
                            >
                                Full Name <span className="text-[#C9A227]">*</span>
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                autoComplete="name"
                                placeholder="John Doe"
                                className={inputBase}
                                {...register("fullName")}
                            />
                            {errors.fullName && (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.fullName.message}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label
                                htmlFor="phone"
                                className="mb-1.5 block text-xs font-medium tracking-wider text-[#F5F1E6]/60 uppercase"
                            >
                                Phone Number <span className="text-[#C9A227]">*</span>
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                autoComplete="tel"
                                placeholder="1234567890"
                                className={inputBase}
                                {...register("phone")}
                                maxLength={10}
                            />
                            {errors.phone && (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-xs font-medium tracking-wider text-[#F5F1E6]/60 uppercase"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="john@example.com"
                                className={inputBase}
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Date */}
                        <div>
                            <label
                                htmlFor="date"
                                className="mb-1.5 block text-xs font-medium tracking-wider text-[#F5F1E6]/60 uppercase"
                            >
                                Date <span className="text-[#C9A227]">*</span>
                            </label>
                            <input
                                id="date"
                                type="date"
                                min={today}
                                className={`${inputBase} [color-scheme:dark]`}
                                {...register("date")}
                            />
                            {errors.date && (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.date.message}
                                </p>
                            )}
                        </div>

                        {/* Time */}
                        <div>
                            <label
                                htmlFor="time"
                                className="mb-1.5 block text-xs font-medium tracking-wider text-[#F5F1E6]/60 uppercase"
                            >
                                Time <span className="text-[#C9A227]">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    id="time"
                                    className={selectBase}
                                    {...register("time")}
                                >
                                    <option value="" disabled>
                                        Select time
                                    </option>
                                    {TIME_SLOTS.map((slot) => (
                                        <option key={slot} value={slot}>
                                            {slot}
                                        </option>
                                    ))}
                                </select>
                                <ChevronIcon />
                            </div>
                            {errors.time && (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.time.message}
                                </p>
                            )}
                        </div>

                        {/* Number of guests */}
                        <div>
                            <label
                                htmlFor="guests"
                                className="mb-1.5 block text-xs font-medium tracking-wider text-[#F5F1E6]/60 uppercase"
                            >
                                Guests <span className="text-[#C9A227]">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    id="guests"
                                    className={selectBase}
                                    {...register("guests")}
                                >
                                    <option value="" disabled>
                                        How many?
                                    </option>
                                    {GUEST_OPTIONS.map((n) => (
                                        <option key={n} value={n}>
                                            {n} {n === "1" ? "Guest" : "Guests"}
                                        </option>
                                    ))}
                                </select>
                                <ChevronIcon />
                            </div>
                            {errors.guests && (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.guests.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Special Requests — full width */}
                    <div className="mt-5">
                        <label
                            htmlFor="specialRequests"
                            className="mb-1.5 block text-xs font-medium tracking-wider text-[#F5F1E6]/60 uppercase"
                        >
                            Special Requests
                        </label>
                        <textarea
                            id="specialRequests"
                            rows={3}
                            placeholder="Allergies, celebrations, seating preference..."
                            className={`${inputBase} resize-none`}
                            {...register("specialRequests")}
                        />
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-8 w-full cursor-pointer rounded-md bg-[#C9A227] px-6 py-3.5 text-sm font-semibold tracking-wider text-[#111111] uppercase transition-all duration-300 hover:bg-[#F5F1E6] hover:shadow-lg hover:shadow-[#C9A227]/20 focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:ring-offset-2 focus:ring-offset-[#1C1A18] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? "Submitting..." : "Book My Table"}
                    </button>
                </form>
            </div>
        </section>
    )
}

/* ------------------------------------------------------------------ */
/* Tiny chevron SVG for selects                                      */
/* ------------------------------------------------------------------ */

function ChevronIcon() {
    return (
        <svg
            className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-[#F5F1E6]/40"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
            />
        </svg>
    )
}