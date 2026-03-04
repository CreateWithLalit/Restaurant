import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/contexts/CartContext";
import CartButton from "@/components/CartButton";
import CartDrawer from "@/components/CartDrawer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  // ... existing metadata
  title: "D-Dion | Authentic Flavors. Modern Experience.",
  description: "Experience the perfect blend of local ingredients and modern culinary techniques at D-Dion. A luxury dining experience awaits you in New Delhi.",
  keywords: ["restaurant", "luxury dining", "New Delhi", "D-Dion", "modern cuisine", "fine dining"],
  authors: [{ name: "D-Dion Culinary Team" }],
  openGraph: {
    title: "D-Dion | Fine Dining & Modern Flavors",
    description: "Discover a premium culinary journey in the heart of Delhi. Book your table for an unforgettable dining experience.",
    url: "https://restaurant-7uel.vercel.app", // Using the user's provided Vercel URL
    siteName: "D-Dion Restaurant",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "D-Dion Restaurant - Premium Interior",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "D-Dion | Modern Culinary Experience",
    description: "Luxury dining in New Delhi. Book your experience today.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${playfair.variable} ${outfit.variable} font-body antialiased`}>
        <CartProvider>
          <SmoothScroll>
            {children}
          </SmoothScroll>
          <CartButton />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
