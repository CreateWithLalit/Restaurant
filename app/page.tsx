import Navbar from "@/components/sections/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import MenuSection from "@/components/sections/MenuSection";
import WhyUsSection from "@/components/sections/WhyUsSection";
import BookingForm from "@/components/sections/BookingForm";
import MapSection from "@/components/sections/MapSection";
import Footer from "@/components/sections/Footer";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export default async function Home() {
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

  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*")
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  const { data: settings } = await supabase
    .from("restaurant_settings")
    .select("*")
    .maybeSingle();

  const brandName = settings?.name || "D-Dion";
  const tagline = settings?.tagline || "Authentic Flavors. Modern Experience.";

  return (
    <main>
      <Navbar restaurantName={brandName} />
      <HeroSection
        restaurantName={brandName}
        tagline={tagline}
        backgroundImage="https://images.unsplash.com/photo-1557955776-857434f1c951?w=3000"
      />
      <AboutSection
        aboutText={settings?.about_text || "Welcome to D-Dion..."}
        imageUrl="https://plus.unsplash.com/premium_photo-1687697861036-7a9309490507?w=1000"
        rating="4.8"
      />
      <MenuSection items={menuItems || []} />
      <WhyUsSection />
      <BookingForm />
      <MapSection
        mapsEmbedUrl={settings?.maps_embed_url || "https://www.google.com/maps/place/Delhi/@28.6909744,76.4661453,104753m/data=!3m2!1e3!4b1!4m15!1m8!3m7!1s0x390cfd5b347eb62d:0x37205b715389640!2sDelhi!3b1!8m2!3d28.7040592!4d77.1024902!16zL20vMDlmMDc!3m5!1s0x390d047309fff32f:0xfc5606ed1b5d46c3!8m2!3d28.6814551!4d77.22279!16s%2Fg%2F11c45z_hc2?entry=ttu&g_ep=EgoyMDI2MDMwMS4xIKXMDSoASAFQAw%3D%3D"}
        address={settings?.address || "Shaheed Jeet Singh Marg, Block D, Qutab Institutional Area, New Delhi 110016"}
        phone={settings?.phone || "+91 98765 43210"}
        email={settings?.email || "info@ddion.com"}
      />
      <Footer
        restaurantName={brandName}
        tagline={tagline}
        address={settings?.address || "Shaheed Jeet Singh Marg, Block D, Qutab Institutional Area, New Delhi 110016"}
        phone={settings?.phone || "+91 98765 43210"}
        email={settings?.email || "info@ddion.com"}
        openingHours={settings?.opening_hours || "12:00 PM - 3:00 AM Daily"}
        facebookUrl={settings?.facebook_url || "#"}
        instagramUrl={settings?.instagram_url || "#"}
        tripadvisorUrl={settings?.tripadvisor_url || "#"}
      />
    </main>
  );
}
