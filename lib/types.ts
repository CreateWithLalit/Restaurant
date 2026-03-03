// lib/types.ts

/**
 * Represents a booking made by a customer.
 */
export type Booking = {
    id: string;
    customer_name: string;
    customer_phone: string;
    customer_email?: string;            // optional email address
    booking_date: string;                // ISO format (YYYY-MM-DD)
    booking_time: string;                // 24-hour format (HH:MM)
    guests: number;
    special_requests?: string;           // optional notes
    status: "pending" | "confirmed" | "cancelled";
    created_at: string;                  // ISO datetime
};

/**
 * Represents an item on the restaurant menu.
 */
export type MenuItem = {
    id: string;
    name: string;
    description?: string;
    price: number;                       // in the smallest currency unit (e.g., cents)
    category: string;                     // e.g., "appetizer", "main", "dessert"
    image_url?: string;
    available: boolean;                   // whether the item can be ordered today
    featured: boolean;                    // whether to highlight it on the menu
    created_at: string;                   // ISO datetime
};

/**
 * Global settings for the restaurant.
 */
export type RestaurantSettings = {
    id: string;
    name: string;                          // restaurant name
    tagline?: string;
    about_text?: string;
    address?: string;
    phone?: string;
    email?: string;
    opening_hours?: string;                 // free‑form text, e.g., "Mon-Fri 9am–10pm"
    maps_embed_url?: string;                 // embed URL for Google Maps
    facebook_url?: string;
    instagram_url?: string;
    tripadvisor_url?: string;
};

/**
 * Data submitted via the booking form.
 * (Does not include server‑generated fields like id or created_at.)
 */
export type BookingFormData = {
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    booking_date: string;                   // ISO format (YYYY-MM-DD)
    booking_time: string;                   // HH:MM
    guests: number;
    special_requests?: string;
};