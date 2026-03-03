"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RestaurantSettings } from "@/lib/types";

const settingsSchema = z.object({
    name: z.string().min(1, "Restaurant name is required"),
    tagline: z.string().optional(),
    about_text: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    opening_hours: z.string().optional(),
    maps_embed_url: z.string().optional(),
    facebook_url: z.string().optional(),
    instagram_url: z.string().optional(),
    tripadvisor_url: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
    initialData: RestaurantSettings;
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { register, handleSubmit, formState: { errors } } = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            name: initialData.name,
            tagline: initialData.tagline || "",
            about_text: initialData.about_text || "",
            address: initialData.address || "",
            phone: initialData.phone || "",
            email: initialData.email || "",
            opening_hours: initialData.opening_hours || "",
            maps_embed_url: initialData.maps_embed_url || "",
            facebook_url: initialData.facebook_url || "",
            instagram_url: initialData.instagram_url || "",
            tripadvisor_url: initialData.tripadvisor_url || "",
        },
    });

    const onSubmit = async (data: SettingsFormValues) => {
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from("restaurant_settings")
                .update(data)
                .eq("id", initialData.id);

            if (error) throw error;

            setMessage({ type: "success", text: "Settings updated successfully!" });
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "Failed to update settings" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {message && (
                <div className={`rounded-lg p-4 text-sm font-medium ${message.type === "success"
                    ? "bg-green-400/10 text-green-400 border border-green-400/20"
                    : "bg-red-400/10 text-red-400 border border-red-400/20"
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Branding & Info */}
                <div className="space-y-6 rounded-lg border border-[#F5F1E6]/10 bg-[#1C1A18] p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-[#C9A227]">General Info</h2>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="resName" className="block text-sm font-medium text-[#F5F1E6]/60 mb-1">Restaurant Name</label>
                            <input
                                id="resName"
                                {...register("name")}
                                className="w-full rounded-md border border-[#F5F1E6]/10 bg-[#111111] p-3 text-[#F5F1E6] focus:border-[#C9A227] focus:outline-none"
                                autoComplete="organization"
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="resTagline" className="block text-sm font-medium text-[#F5F1E6]/60 mb-1">Tagline</label>
                            <input
                                id="resTagline"
                                {...register("tagline")}
                                className="w-full rounded-md border border-[#F5F1E6]/10 bg-[#111111] p-3 text-[#F5F1E6] focus:border-[#C9A227] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="resAbout" className="block text-sm font-medium text-[#F5F1E6]/60 mb-1">About Text</label>
                            <textarea
                                id="resAbout"
                                {...register("about_text")}
                                rows={4}
                                className="w-full rounded-md border border-[#F5F1E6]/10 bg-[#111111] p-3 text-[#F5F1E6] focus:border-[#C9A227] focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact & Location */}
                <div className="space-y-6 rounded-lg border border-[#F5F1E6]/10 bg-[#1C1A18] p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-[#C9A227]">Location & Contact</h2>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="resAddress" className="block text-sm font-medium text-[#F5F1E6]/60 mb-1">Address</label>
                            <input
                                id="resAddress"
                                {...register("address")}
                                className="w-full rounded-md border border-[#F5F1E6]/10 bg-[#111111] p-3 text-[#F5F1E6] focus:border-[#C9A227] focus:outline-none"
                                autoComplete="street-address"
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label htmlFor="resPhone" className="block text-sm font-medium text-[#F5F1E6]/60 mb-1">Phone</label>
                                <input
                                    id="resPhone"
                                    {...register("phone")}
                                    className="w-full rounded-md border border-[#F5F1E6]/10 bg-[#111111] p-3 text-[#F5F1E6] focus:border-[#C9A227] focus:outline-none"
                                    autoComplete="tel"
                                />
                            </div>
                            <div>
                                <label htmlFor="resEmail" className="block text-sm font-medium text-[#F5F1E6]/60 mb-1">Email</label>
                                <input
                                    id="resEmail"
                                    {...register("email")}
                                    className="w-full rounded-md border border-[#F5F1E6]/10 bg-[#111111] p-3 text-[#F5F1E6] focus:border-[#C9A227] focus:outline-none"
                                    autoComplete="email"
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="resHours" className="block text-sm font-medium text-[#F5F1E6]/60 mb-1">Opening Hours</label>
                            <textarea
                                id="resHours"
                                {...register("opening_hours")}
                                rows={2}
                                className="w-full rounded-md border border-[#F5F1E6]/10 bg-[#111111] p-3 text-[#F5F1E6] focus:border-[#C9A227] focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="space-y-6 rounded-lg border border-[#F5F1E6]/10 bg-[#1C1A18] p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-[#C9A227]">Social Media</h2>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="resFB" className="block text-sm font-medium text-[#F5F1E6]/60 mb-1">Facebook URL</label>
                            <input
                                id="resFB"
                                {...register("facebook_url")}
                                className="w-full rounded-md border border-[#F5F1E6]/10 bg-[#111111] p-3 text-[#F5F1E6] focus:border-[#C9A227] focus:outline-none"
                                autoComplete="url"
                            />
                        </div>
                        <div>
                            <label htmlFor="resInsta" className="block text-sm font-medium text-[#F5F1E6]/60 mb-1">Instagram URL</label>
                            <input
                                id="resInsta"
                                {...register("instagram_url")}
                                className="w-full rounded-md border border-[#F5F1E6]/10 bg-[#111111] p-3 text-[#F5F1E6] focus:border-[#C9A227] focus:outline-none"
                                autoComplete="url"
                            />
                        </div>
                        <div>
                            <label htmlFor="resTrip" className="block text-sm font-medium text-[#F5F1E6]/60 mb-1">TripAdvisor URL</label>
                            <input
                                id="resTrip"
                                {...register("tripadvisor_url")}
                                className="w-full rounded-md border border-[#F5F1E6]/10 bg-[#111111] p-3 text-[#F5F1E6] focus:border-[#C9A227] focus:outline-none"
                                autoComplete="url"
                            />
                        </div>
                    </div>
                </div>

                {/* Technical Settings */}
                <div className="space-y-6 rounded-lg border border-[#F5F1E6]/10 bg-[#1C1A18] p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-[#C9A227]">Technical Settings</h2>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="resMaps" className="block text-sm font-medium text-[#F5F1E6]/60 mb-1">Google Maps Embed URL</label>
                            <input
                                id="resMaps"
                                {...register("maps_embed_url")}
                                className="w-full rounded-md border border-[#F5F1E6]/10 bg-[#111111] p-3 text-[#F5F1E6] focus:border-[#C9A227] focus:outline-none"
                                placeholder="https://www.google.com/maps/embed?..."
                                autoComplete="url"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-[#C9A227] px-10 py-3 font-semibold text-[#111111] hover:bg-[#F5F1E6] transition-all duration-300 disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save All Changes"}
                </button>
            </div>
        </form>
    );
}
