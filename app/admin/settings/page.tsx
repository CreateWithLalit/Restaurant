import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import SettingsForm from "@/components/admin/SettingsForm";
import { RestaurantSettings } from "@/lib/types";

export default async function SettingsPage() {
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

    // Fetch settings (there should only be one row)
    const { data: settings, error } = await supabase
        .from("restaurant_settings")
        .select("*")
        .maybeSingle();

    if (error) {
        return <div className="p-8 text-red-400">Error loading settings: {error.message}</div>;
    }

    // Default values if no settings exist yet
    const defaultSettings: RestaurantSettings = {
        id: "default",
        name: "D-Dion",
        tagline: "Authentic Flavors. Modern Experience.",
        about_text: "Welcome to D-Dion, a boutique restaurant and pub nestled in the heart of New Delhi. We craft every dish with passion, using only the finest fresh ingredients to deliver an unforgettable dining experience.",
        address: "Shaheed Jeet Singh Marg, Block D, Qutab Institutional Area, New Delhi 110016",
        phone: "+91 98765 43210",
        email: "info@ddion.com",
        opening_hours: "12:00 PM - 3:00 AM Daily",
        maps_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.2!2d77.1867!3d28.5439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDMyJzM4LjAiTiA3N8KwMTEnMTIuMiJF!5e0!3m2!1sen!2sin!4v1234567890",
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#F5F1E6]">Settings</h1>
                <p className="text-[#F5F1E6]/60 mt-2">Manage your restaurant configuration and account settings.</p>
            </div>

            <SettingsForm initialData={settings || defaultSettings} />
        </div>
    );
}
