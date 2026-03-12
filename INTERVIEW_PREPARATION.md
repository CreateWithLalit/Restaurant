# 🎯 Interview Preparation Guide — D-Dion Restaurant Project

> A comprehensive list of interview questions and detailed answers based on the D-Dion full-stack restaurant management platform.

---

## Table of Contents

1. [Project Overview & Architecture](#1-project-overview--architecture)
2. [Next.js & React](#2-nextjs--react)
3. [TypeScript](#3-typescript)
4. [Supabase & Database](#4-supabase--database)
5. [Authentication & Security](#5-authentication--security)
6. [State Management](#6-state-management)
7. [Form Handling & Validation](#7-form-handling--validation)
8. [Styling & UI/UX](#8-styling--uiux)
9. [Performance Optimization](#9-performance-optimization)
10. [API Design](#10-api-design)
11. [Real-Time Features](#11-real-time-features)
12. [File Storage & Image Handling](#12-file-storage--image-handling)
13. [Deployment & DevOps](#13-deployment--devops)
14. [Code Quality & Best Practices](#14-code-quality--best-practices)
15. [Scenario-Based / Behavioral Questions](#15-scenario-based--behavioral-questions)

---

## 1. Project Overview & Architecture

### Q: Can you give a brief overview of your project?

**A:** D-Dion is a full-stack restaurant management and ordering platform built with **Next.js 16 (React 19)**, **TypeScript**, and **Supabase**. It has two main parts:

1. **Public-facing website** — Customers can browse the menu, make table reservations, add items to a cart, and view restaurant information like location and hours.
2. **Admin dashboard** — Restaurant staff can manage bookings in real time (with live Supabase Realtime subscriptions), perform CRUD operations on menu items (with image uploads), and configure restaurant settings.

Key highlights include real-time booking notifications with audio alerts, email confirmations via Resend API, Zod-based form validation, and a luxury dark-themed responsive UI styled with Tailwind CSS v4.

---

### Q: Why did you choose this tech stack (Next.js + Supabase + TypeScript)?

**A:**
- **Next.js** — I chose Next.js for its hybrid rendering model. The public pages benefit from **server-side rendering (SSR)** for SEO and performance, while the admin dashboard uses **client-side interactivity** for real-time updates. The App Router also gives me built-in API routes, middleware, and file-based routing.
- **Supabase** — It provides a managed PostgreSQL database with built-in **Row-Level Security (RLS)**, **Realtime subscriptions**, **authentication**, and **file storage** — all without building a separate backend. This saved significant development time.
- **TypeScript** — Provides type safety across the entire codebase, catches errors at compile time, improves IDE support with autocomplete, and makes refactoring safer. For example, my `types.ts` file defines shared interfaces for `MenuItem`, `Booking`, and `RestaurantSettings` used across both server and client components.

---

### Q: Can you explain the architecture of your application?

**A:** The app follows a **monolithic full-stack architecture** using Next.js App Router:

```
┌─────────────────────────────────────────────┐
│              Client (Browser)                │
│  ┌─────────────┐  ┌──────────────────────┐  │
│  │ Public Pages │  │  Admin Dashboard     │  │
│  │ (SSR + CSR)  │  │  (CSR + Realtime)    │  │
│  └──────┬───────┘  └──────────┬───────────┘  │
└─────────┼─────────────────────┼──────────────┘
          │                     │
    ┌─────▼─────────────────────▼──────┐
    │     Next.js Server               │
    │  ┌──────────┐  ┌──────────────┐  │
    │  │ Middleware│  │ API Routes   │  │
    │  │ (Auth)   │  │ /api/bookings│  │
    │  └──────────┘  └──────────────┘  │
    └──────────────────┬───────────────┘
                       │
    ┌──────────────────▼───────────────┐
    │         Supabase                 │
    │  ┌──────┐ ┌─────┐ ┌──────────┐  │
    │  │  DB  │ │Auth │ │ Storage  │  │
    │  │(PG)  │ │(JWT)│ │ (Images) │  │
    │  └──────┘ └─────┘ └──────────┘  │
    │  ┌──────────────────────────┐    │
    │  │   Realtime (WebSocket)   │    │
    │  └──────────────────────────┘    │
    └──────────────────────────────────┘
```

- **Public pages** are server-rendered for SEO, then hydrated on the client.
- **Admin pages** are client-side rendered with real-time subscriptions.
- **Middleware** intercepts every request to check authentication for `/admin/*` routes.
- **API routes** handle server-side operations like booking confirmation and email sending.
- **Supabase** acts as the backend-as-a-service for database, auth, storage, and real-time.

---

### Q: How is your project folder structured and why?

**A:** I follow the **Next.js App Router conventions** with feature-based organization:

- `app/` — Routes and pages (file-based routing). Each route has its own `page.tsx`.
- `app/admin/` — All admin panel routes are grouped under this prefix for easy middleware protection.
- `app/api/` — Serverless API routes.
- `components/` — Reusable UI components, split into:
  - `components/admin/` — Admin-specific components (BookingTable, MenuItemForm, etc.)
  - `components/sections/` — Public-facing page sections (HeroSection, MenuSection, etc.)
  - `components/ui/` — Generic reusable components (Button, Input, Modal, LoadingSpinner)
- `contexts/` — React Context providers (CartContext).
- `hooks/` — Custom React hooks for data fetching (useMenuItems, useRestaurantSettings).
- `lib/` — Utility modules (Supabase clients, TypeScript types).
- `supabase/` — Database migration files and SQL setup scripts.

This separation keeps concerns isolated — changing the admin panel doesn't affect public components, and shared logic is centralized in `lib/` and `hooks/`.

---

## 2. Next.js & React

### Q: What is the difference between Server Components and Client Components in Next.js? How did you use them?

**A:** In Next.js App Router:
- **Server Components** (default) — Render on the server, can directly access databases, don't include JavaScript in the client bundle. They cannot use hooks or browser APIs.
- **Client Components** (marked with `"use client"`) — Render on both server and client, can use hooks (`useState`, `useEffect`), event handlers, and browser APIs.

In my project:
- **Server Components:** The main `app/page.tsx` fetches menu items and restaurant settings directly from Supabase on the server, then passes data as props to client components. This means the initial HTML includes all the data — great for SEO and performance.
- **Client Components:** Interactive components like `BookingForm`, `CartDrawer`, `MenuItemForm`, and the entire admin dashboard use `"use client"` because they need state, event handlers, and real-time subscriptions.

Example from `app/page.tsx`:
```tsx
// This is a Server Component (no "use client" directive)
export default async function Home() {
  const supabase = createClient();
  const { data: menuItems } = await supabase.from("menu_items").select("*");
  return <MenuSection items={menuItems} />; // Pass data to client component
}
```

---

### Q: What is Next.js middleware and how did you use it?

**A:** Middleware runs **before every request** on the server edge. In my project, `middleware.ts` handles authentication:

1. It creates a Supabase server client with cookie access.
2. Calls `supabase.auth.getUser()` to validate the session.
3. If the user visits any `/admin/*` route (except `/admin/login`) without a valid session, it redirects to `/admin/login`.
4. If the user is already logged in and visits `/admin/login`, it redirects to `/admin/bookings`.

I use a `matcher` config to exclude static files and images from middleware processing, which improves performance.

---

### Q: What is dynamic import in Next.js and why did you use it?

**A:** Dynamic imports (`next/dynamic`) allow **code splitting** — components are loaded only when needed instead of being included in the initial bundle. I used this for below-the-fold sections on the homepage:

```tsx
const AboutSection = dynamic(() => import("@/components/sections/AboutSection"));
const WhyUsSection = dynamic(() => import("@/components/sections/WhyUsSection"));
const MapSection = dynamic(() => import("@/components/sections/MapSection"));
```

This reduces the initial JavaScript bundle size. The Hero section and Menu section (above the fold) are imported normally since they're immediately visible. The About, WhyUs, and Map sections load lazily as the user scrolls down.

---

### Q: How does file-based routing work in your project?

**A:** Next.js App Router maps the file system to URLs:

| File Path | URL |
|-----------|-----|
| `app/page.tsx` | `/` |
| `app/checkout/page.tsx` | `/checkout` |
| `app/admin/login/page.tsx` | `/admin/login` |
| `app/admin/bookings/page.tsx` | `/admin/bookings` |
| `app/admin/menu/page.tsx` | `/admin/menu` |
| `app/admin/settings/page.tsx` | `/admin/settings` |
| `app/api/bookings/confirm/route.ts` | `POST /api/bookings/confirm` |

Layout nesting is also automatic: `app/admin/layout.tsx` wraps all admin pages with a sidebar navigation, while `app/layout.tsx` wraps the entire app with the cart provider and global styles.

---

### Q: What are React hooks and which ones did you use?

**A:** React hooks are functions that let you use state and other React features in functional components. I used:

| Hook | Usage in Project |
|------|-----------------|
| `useState` | Form inputs, loading states, error messages, modal visibility |
| `useEffect` | Supabase Realtime subscriptions, data fetching on mount, Intersection Observer setup |
| `useReducer` | Cart state management (complex state with multiple action types) |
| `useContext` | Consuming cart state from CartContext |
| `useCallback` | Memoizing event handlers in cart operations to prevent re-renders |
| `useRef` | Audio element for booking notification sound |
| **Custom hooks:** `useMenuItems`, `useRestaurantSettings` | Encapsulate Supabase data fetching with loading/error states |

---

### Q: What is the difference between `useEffect` and `useCallback`?

**A:**
- `useEffect` — Runs **side effects** after render. I used it to set up Supabase Realtime subscriptions when the bookings page mounts, and to clean up the subscription when it unmounts.
- `useCallback` — **Memoizes a function** so it doesn't get recreated on every render. I used it in `CartContext` for functions like `addItem`, `removeItem`, `increment`, and `decrement` to prevent unnecessary re-renders of child components that receive these functions as props.

```tsx
// useEffect — runs side effect
useEffect(() => {
  const channel = supabase.channel("bookings").on("postgres_changes", ...);
  return () => { supabase.removeChannel(channel); }; // cleanup
}, []);

// useCallback — memoizes function
const addItem = useCallback((item: CartItem) => {
  dispatch({ type: "ADD_ITEM", item });
}, []);
```

---

## 3. TypeScript

### Q: How did TypeScript help you in this project?

**A:** TypeScript provided several benefits:

1. **Shared Type Definitions** — My `lib/types.ts` defines `MenuItem`, `Booking`, and `RestaurantSettings` interfaces used across both server and client components, ensuring data consistency.

2. **Compile-time Error Detection** — If I accidentally pass a `string` where a `number` is expected (e.g., price field), TypeScript catches it before runtime.

3. **IDE Autocomplete** — When working with Supabase responses, TypeScript infers the column names and types, preventing typos.

4. **Form Validation Integration** — Zod schemas generate TypeScript types automatically with `z.infer<typeof schema>`, so my form types always match the validation rules.

5. **API Safety** — The API route in `app/api/bookings/confirm/route.ts` has typed request/response handling, ensuring the `bookingId` field exists before processing.

---

### Q: What TypeScript types did you define for this project?

**A:** In `lib/types.ts`:

```typescript
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  available: boolean;
  featured: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  booking_date: string;
  booking_time: string;
  guests: number;
  special_requests: string | null;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}

export interface RestaurantSettings {
  id: string;
  name: string;
  tagline: string;
  about_text: string;
  address: string;
  phone: string;
  email: string;
  opening_hours: string;
  maps_embed_url: string;
  facebook_url: string;
  instagram_url: string;
  tripadvisor_url: string;
}
```

These are used everywhere — from Supabase queries to React component props to API handlers.

---

## 4. Supabase & Database

### Q: Why did you choose Supabase over other databases?

**A:** Supabase was ideal because it provides a **complete backend-as-a-service** in one platform:

1. **PostgreSQL Database** — Production-grade relational database with powerful querying.
2. **Row-Level Security (RLS)** — Database-level access control without extra backend code.
3. **Authentication** — Built-in email/password auth with JWT tokens.
4. **Realtime** — WebSocket-based subscriptions for live data updates (used for booking notifications).
5. **Storage** — File upload bucket for menu item images.
6. **Client Libraries** — First-class JavaScript/TypeScript SDKs for both browser and server.

This meant I didn't need a separate Express/NestJS backend. The Next.js API routes + Supabase combination was sufficient for all server-side operations.

---

### Q: Explain your database schema and the relationships between tables.

**A:** I have 3 tables:

1. **`restaurant_settings`** — Single-row table storing restaurant configuration (name, address, hours, social links). It's essentially a key-value store in row form.

2. **`menu_items`** — Stores all dishes with fields for name, description, price, category, image URL, and boolean flags for `available` and `featured`. Uses UUID primary keys.

3. **`bookings`** — Stores customer reservations with contact info, date/time, guest count, special requests, and a status field (`pending` → `confirmed` or `cancelled`).

There are no foreign key relationships between tables because they represent independent domains. The `restaurant_settings` table is a singleton (one row), `menu_items` is the product catalog, and `bookings` is the reservation ledger.

---

### Q: What is Row-Level Security (RLS) and how did you implement it?

**A:** RLS is a PostgreSQL feature that controls which rows a user can access based on policies. It acts as a **database-level firewall**.

In my project:
- **Public users (anonymous)** can:
  - `SELECT` from `menu_items` (only where `available = true`)
  - `SELECT` from `restaurant_settings`
  - `INSERT` into `bookings` (create new reservations)
- **Authenticated users (admin)** can:
  - Full `SELECT`, `INSERT`, `UPDATE`, `DELETE` on all tables

This means even if someone bypasses the frontend, the database itself enforces access control. For example, a public user cannot directly delete menu items or read all bookings — the database will reject those queries.

```sql
-- Example: Public can only read available menu items
CREATE POLICY "Public can view available menu items"
ON menu_items FOR SELECT
USING (available = true);

-- Admin has full access
CREATE POLICY "Admin full access"
ON menu_items FOR ALL
USING (auth.role() = 'authenticated');
```

---

### Q: How do you handle the two different Supabase clients (browser vs server)?

**A:** I maintain two separate client factories:

1. **Browser Client** (`lib/supabase.ts`) — Uses `createBrowserClient()` from `@supabase/ssr`. This client runs in the browser and uses the anonymous key. It's used in client components for data fetching and real-time subscriptions.

2. **Server Client** (`lib/supabase-server.ts`) — Uses `createServerClient()` from `@supabase/ssr` with cookie access. This runs on the server (in API routes, middleware, and Server Components) and can access the user's authenticated session via cookies.

The server client is created as a factory function that takes cookies as input:
```typescript
export function createClient() {
  const cookieStore = cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookies) => { /* set cookies */ }
    }
  });
}
```

This separation is important because the browser client cannot access HTTP-only cookies, and the server client needs cookies for session management.

---

## 5. Authentication & Security

### Q: How does authentication work in your application?

**A:** The authentication flow:

1. **Login** — Admin enters email/password on `/admin/login`. The form calls `supabase.auth.signInWithPassword()`.
2. **Session Creation** — Supabase returns a JWT token, which the `@supabase/ssr` library automatically stores in secure HTTP-only cookies.
3. **Route Protection** — The `middleware.ts` runs on every request. It calls `supabase.auth.getUser()` to validate the session. If invalid, it redirects to the login page.
4. **API Protection** — The API route at `/api/bookings/confirm` also validates the session server-side before processing requests.
5. **Logout** — Calls `supabase.auth.signOut()`, which clears the session cookies.

Security measures:
- Tokens are stored in HTTP-only, secure cookies (not localStorage — prevents XSS attacks).
- RLS ensures database-level enforcement even if middleware is bypassed.
- The middleware refreshes tokens automatically to prevent session expiration during active use.

---

### Q: What is JWT and how is it used in your project?

**A:** JWT (JSON Web Token) is a compact, self-contained token that securely transmits information between parties. In my project:

- When a user logs in, Supabase generates a JWT containing the user's ID, role, and expiration time.
- This JWT is stored in a secure HTTP-only cookie by the `@supabase/ssr` package.
- On every request, the middleware sends this cookie to Supabase to verify the user's identity.
- The JWT is also sent with every Supabase database query, allowing PostgreSQL RLS policies to check `auth.role()` and grant appropriate access.

I don't manually create or parse JWTs — Supabase handles all token management, including refresh token rotation.

---

### Q: How do you protect admin routes?

**A:** I use a **layered security approach**:

1. **Middleware (First Layer)** — `middleware.ts` intercepts all requests. For any `/admin/*` route (except `/admin/login`), it checks for a valid Supabase session. If absent, it returns a `NextResponse.redirect()` to the login page.

2. **API Route Validation (Second Layer)** — The `/api/bookings/confirm` endpoint independently validates the session using `supabase.auth.getUser()` before processing. This ensures security even if someone calls the API directly.

3. **Database RLS (Third Layer)** — Even if both layers above are somehow bypassed, PostgreSQL RLS policies prevent unauthenticated users from modifying data.

This defense-in-depth approach means no single point of failure compromises the application.

---

## 6. State Management

### Q: How did you manage state in your application?

**A:** I used multiple strategies depending on the scope:

| Strategy | Scope | Use Case |
|----------|-------|----------|
| **React Context + useReducer** | Global (client) | Shopping cart (items, quantities, drawer state) |
| **useState** | Component-local | Form inputs, loading flags, error messages, modal visibility |
| **Server-side fetching** | Server Components | Menu items, restaurant settings (fetched in Server Components) |
| **Supabase Realtime** | Real-time sync | Bookings list (live updates via WebSocket) |
| **URL parameters** | Cross-page | Checkout page reads cart data from URL search params |

---

### Q: Explain the Cart Context implementation in detail.

**A:** The cart uses the **Context API with useReducer** pattern:

**State Shape:**
```typescript
interface CartState {
  items: CartItem[];  // { id, name, price, quantity, image_url }
  isOpen: boolean;    // Drawer open/close
}
```

**Reducer Actions:**
- `ADD_ITEM` — Adds new item or increments quantity if already in cart
- `REMOVE_ITEM` — Removes item completely
- `INCREMENT` / `DECREMENT` — Adjusts quantity (removes if quantity reaches 0)
- `CLEAR_CART` — Empties the cart
- `TOGGLE_DRAWER` — Opens/closes the cart sidebar

**Provider Pattern:**
```tsx
// CartContext.tsx
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = useCallback((item) => dispatch({ type: "ADD_ITEM", item }), []);
  const totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, totalPrice, ... }}>
      {children}
    </CartContext.Provider>
  );
}
```

**Why useReducer over useState?**
- The cart has **complex state transitions** (add can mean insert or increment).
- Multiple actions modify the same state in different ways.
- The reducer centralizes all state logic in one place, making it predictable and testable.
- `useCallback` memoizes dispatch wrapper functions to prevent unnecessary child re-renders.

---

### Q: Why did you use Context API instead of Redux or Zustand?

**A:** For this project, Context API was sufficient because:

1. **Small state scope** — Only the shopping cart needs global state. Most data comes from Supabase (server-side).
2. **Low update frequency** — Cart changes are infrequent (user clicks). There's no high-frequency state updates that would cause performance issues with Context.
3. **No extra dependencies** — Context API is built into React. Adding Redux would mean extra packages, boilerplate (actions, reducers, store configuration), and complexity for a simple use case.
4. **Component tree depth** — The cart state is only consumed by 3-4 components (CartButton, CartDrawer, MenuCard, Checkout), not dozens of deeply nested components.

If the app grew to have more complex state (e.g., user preferences, order history, real-time notifications), I'd consider Zustand for its simplicity or Redux Toolkit for large teams.

---

## 7. Form Handling & Validation

### Q: How did you handle forms and validation?

**A:** I used **React Hook Form** with **Zod** validation:

- **React Hook Form** — Provides performant form state management with minimal re-renders. It uses uncontrolled components by default.
- **Zod** — A TypeScript-first schema validation library. I define the shape and constraints of form data, and Zod validates at runtime.
- **@hookform/resolvers** — Bridges React Hook Form with Zod, so validation errors automatically appear in the form.

**Booking Form Example:**
```typescript
const bookingSchema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  customer_phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  customer_email: z.string().email().optional().or(z.literal("")),
  booking_date: z.string().min(1, "Date is required"),
  booking_time: z.string().min(1, "Time is required"),
  guests: z.number().min(1).max(20),
  special_requests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>; // Auto-generates TypeScript type
```

Benefits:
- Validation rules are defined once and generate both runtime validation and TypeScript types.
- Error messages are declarative and centralized.
- React Hook Form only re-renders the specific field that changes, not the entire form.

---

### Q: What is Zod and why did you prefer it over Yup?

**A:** Zod is a TypeScript-first schema declaration and validation library. I chose it over Yup because:

1. **TypeScript-first** — Zod infers TypeScript types from schemas with `z.infer<>`. No need to maintain separate type definitions.
2. **Smaller bundle** — Zod is lighter than Yup.
3. **Composable** — Zod schemas can be composed, merged, and extended easily.
4. **Modern API** — Method chaining feels natural: `z.string().min(2).max(100)`.
5. **Ecosystem fit** — Works seamlessly with `@hookform/resolvers` and is the recommended validator in the Next.js ecosystem.

---

## 8. Styling & UI/UX

### Q: What styling approach did you use and why?

**A:** I used **Tailwind CSS v4** with a utility-first approach. Reasons:

1. **No CSS file switching** — Styles are inline in JSX, reducing context switching.
2. **Design consistency** — Tailwind's design tokens enforce consistent spacing, colors, and typography.
3. **Responsive design** — Mobile-first breakpoints (`md:`, `lg:`) make responsive layouts trivial.
4. **Small bundle** — Tailwind purges unused CSS, resulting in a tiny production stylesheet.
5. **Custom theme** — I extended the default theme with a luxury restaurant palette:
   - Dark backgrounds (`#111111`, `#1C1A18`)
   - Gold accents (`#C9A227`)
   - Cream text (`#F5F0E6`)
   - Custom fonts (Playfair Display for headings, Outfit for body)

---

### Q: Explain the custom CSS utilities you created.

**A:** I created several custom utilities in `globals.css`:

| Utility | Effect | Purpose |
|---------|--------|---------|
| `.glass-main` | `backdrop-blur-sm` + semi-transparent background | Glassmorphism card effect |
| `.hover-lift` | `translateY(-4px)` on hover | Subtle lift animation for interactive cards |
| `.hover-glow` | Gold box-shadow on hover | Highlight effect for buttons/cards |
| `.scroll-fade` | `opacity: 0 → 1` on scroll into view | Sections fade in as user scrolls |
| `.text-gold-metallic` | Gold gradient text | Luxury heading effect |
| `.bg-gold-metallic` | Gold gradient background | CTA button styling |

The `.scroll-fade` utility works with an **Intersection Observer** that I set up in a `useEffect` — when an element with this class enters the viewport, JavaScript adds a `visible` class that triggers the CSS transition.

---

### Q: How did you make the application responsive?

**A:** I used Tailwind's mobile-first responsive design:

1. **Base styles** target mobile devices.
2. **Breakpoint prefixes** (`sm:`, `md:`, `lg:`, `xl:`) add styles for larger screens.

Examples from the project:
- **Navigation:** Hamburger menu on mobile → full navigation bar on desktop.
- **Menu grid:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` — stacks cards on mobile, 2 columns on tablet, 3 on desktop.
- **Booking table:** Cards layout on mobile → traditional table on desktop (`hidden md:table-cell` for hiding columns).
- **Admin sidebar:** Collapsible on mobile → always visible on desktop.
- **Typography:** Smaller font sizes on mobile with responsive scaling (`text-3xl md:text-5xl lg:text-7xl`).

---

## 9. Performance Optimization

### Q: What performance optimizations did you implement?

**A:**

1. **Dynamic Imports (Code Splitting):**
   Below-the-fold sections (About, WhyUs, Map) are loaded lazily with `next/dynamic`, reducing the initial bundle by ~30%.

2. **Server Components:**
   Menu items and settings are fetched on the server and rendered as HTML. No client-side JavaScript needed for the initial data display.

3. **Image Optimization:**
   Using Next.js `<Image>` component with `loading="lazy"` for below-fold images. Configured remote patterns for Supabase Storage and Unsplash.

4. **Smooth Scrolling with Lenis:**
   Instead of CSS `scroll-behavior: smooth` (which can cause jank), I use the Lenis library for physics-based, 60fps smooth scrolling.

5. **Intersection Observer:**
   Scroll-fade animations use Intersection Observer instead of scroll event listeners, which is more performant (no layout thrashing).

6. **Memoization:**
   `useCallback` for cart dispatch functions prevents unnecessary re-renders in the component tree.

7. **Font Optimization:**
   Google Fonts loaded via Next.js Font module with `font-display: swap` to avoid Flash of Invisible Text (FOIT) — text is shown immediately in a fallback font while custom fonts load, preventing invisible text.

8. **Middleware Matcher:**
   The middleware config excludes static assets (`_next/static`, `_next/image`, `favicon.ico`) from auth checks, reducing processing overhead.

---

### Q: What is code splitting and how did you implement it?

**A:** Code splitting divides the JavaScript bundle into smaller chunks that are loaded on demand. In my project:

- **Automatic:** Next.js automatically code-splits by route. Visiting `/admin/menu` only loads the menu management code, not the booking or settings code.
- **Manual:** I used `next/dynamic` to lazy-load below-the-fold sections:
  ```tsx
  const AboutSection = dynamic(() => import("@/components/sections/AboutSection"));
  ```
  This creates a separate chunk for `AboutSection` that loads only when React renders that component (i.e., when the user scrolls near it).

The result: faster Time to Interactive (TTI) and smaller initial download.

---

## 10. API Design

### Q: Explain the API route you built for booking confirmation.

**A:** The `/api/bookings/confirm` endpoint (POST) handles confirming a customer's reservation:

**Flow:**
1. **Authentication Check** — Creates a server-side Supabase client, calls `getUser()` to verify the admin is logged in. Returns 401 if not.
2. **Input Validation** — Extracts `bookingId` from the request body. Returns 400 if missing.
3. **Fetch Booking** — Queries Supabase for the booking record. Returns 404 if not found.
4. **Update Status** — Sets `status = 'confirmed'` in the database.
5. **Send Email** — If the booking has a `customer_email`, sends a confirmation email via Resend API with booking details (date, time, guests).
6. **Response** — Returns `{ success: true }` or an appropriate error.

**Error Handling:**
```typescript
try {
  // ... business logic
} catch (error) {
  console.error("Booking confirmation error:", error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
```

Each step has specific error codes (400, 401, 404, 500) for proper HTTP semantics.

---

### Q: What is the difference between API routes and Server Actions in Next.js?

**A:** 
- **API Routes** (`app/api/*/route.ts`) — Traditional REST endpoints that handle HTTP requests. They receive `Request` objects and return `Response` objects. I used an API route for booking confirmation because it involves multi-step server operations (auth check → DB update → email sending) and needs fine-grained error handling.

- **Server Actions** (functions with `"use server"`) — Functions that can be called directly from client components without creating an API endpoint. They're invoked like regular function calls, and Next.js handles the network communication.

I could have used Server Actions for simpler operations (like updating a menu item), but API routes give more control over HTTP status codes, headers, and error responses — which is important for the booking confirmation flow.

---

## 11. Real-Time Features

### Q: How did you implement real-time booking updates?

**A:** I used **Supabase Realtime** (built on PostgreSQL's logical replication):

```typescript
useEffect(() => {
  const channel = supabase
    .channel("bookings-changes")
    .on("postgres_changes", {
      event: "*",         // Listen for INSERT, UPDATE, DELETE
      schema: "public",
      table: "bookings",
    }, (payload) => {
      // Handle different events
      if (payload.eventType === "INSERT") {
        setBookings(prev => [payload.new as Booking, ...prev]);
        playNotificationSound();  // Audio alert
      } else if (payload.eventType === "UPDATE") {
        setBookings(prev => prev.map(b =>
          b.id === payload.new.id ? payload.new as Booking : b
        ));
      } else if (payload.eventType === "DELETE") {
        setBookings(prev => prev.filter(b => b.id !== payload.old.id));
      }
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };  // Cleanup
}, []);
```

**How it works:**
1. When the admin opens the bookings page, a WebSocket connection is established to Supabase.
2. Any change to the `bookings` table triggers a real-time event.
3. The callback updates the local state without requiring a page refresh.
4. New bookings trigger an audio notification sound (using `useRef` for the `<audio>` element).
5. The cleanup function in `useEffect`'s return removes the channel when the component unmounts, preventing memory leaks.

---

### Q: What are WebSockets and how are they different from HTTP?

**A:**
- **HTTP** — Request-response protocol. Client sends a request, server responds, connection closes. Stateless. Used for most of my API calls (fetching menu items, submitting bookings).
- **WebSockets** — Persistent, bidirectional connection. After the initial handshake, both client and server can send messages at any time without new requests. Used for my real-time booking updates.

In my project, Supabase Realtime uses WebSockets under the hood. When a customer submits a booking (HTTP POST to Supabase), PostgreSQL triggers a change event, and Supabase pushes it through the WebSocket to all connected admin clients instantly — no polling needed.

---

## 12. File Storage & Image Handling

### Q: How did you implement image upload for menu items?

**A:** I used **Supabase Storage** with a custom `ImageUpload` component:

**Flow:**
1. Admin clicks the upload area or drags an image onto it.
2. The `<input type="file" accept="image/*">` triggers a file selection.
3. The image is uploaded to a Supabase Storage bucket using `supabase.storage.from("menu-images").upload(fileName, file)`.
4. The public URL is retrieved with `supabase.storage.from("menu-images").getPublicUrl(filePath)`.
5. This URL is stored in the `image_url` field of the `menu_items` table.
6. The image is displayed using Next.js `<Image>` component with the Supabase Storage domain in the `remotePatterns` config.

**Considerations:**
- File names include timestamps to prevent collisions.
- The upload shows a loading state during transfer.
- Error handling for failed uploads with user feedback.
- Supported formats: all image types (`image/*`).

---

## 13. Deployment & DevOps

### Q: How is the application deployed?

**A:** The app is deployed on **Vercel** with the following setup:

1. **Git Integration** — Vercel connects to the GitHub repository and auto-deploys on every push to the main branch.
2. **Environment Variables** — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `RESEND_API_KEY` are configured in Vercel's dashboard.
3. **Serverless Functions** — API routes are automatically deployed as serverless functions (e.g., the booking confirmation endpoint).
4. **Edge Middleware** — The authentication middleware runs on Vercel's edge network for low-latency route protection.
5. **Image Optimization** — Next.js Image optimization is handled by Vercel's CDN.

The `NEXT_PUBLIC_` prefix on Supabase variables makes them available in the browser bundle (these are public keys, not secrets).

---

### Q: What is the difference between environment variables with and without the NEXT_PUBLIC_ prefix?

**A:**
- `NEXT_PUBLIC_*` variables are **embedded in the client-side JavaScript bundle** during build time. They're accessible in both server and client code. I use this for `SUPABASE_URL` and `SUPABASE_ANON_KEY` because the browser needs them to connect to Supabase.
- Variables **without** the prefix are **server-only**. They're only accessible in API routes, middleware, and Server Components. I use this for `RESEND_API_KEY` because the email API key should never be exposed to the browser.

---

## 14. Code Quality & Best Practices

### Q: What design patterns did you use in this project?

**A:**

| Pattern | Where | Why |
|---------|-------|-----|
| **Provider Pattern** | `CartProvider` wrapping the app | Share cart state across the component tree |
| **Custom Hook Pattern** | `useMenuItems`, `useRestaurantSettings` | Encapsulate and reuse data fetching logic |
| **Factory Pattern** | `createClient()` in `supabase-server.ts` | Create configured Supabase instances |
| **Reducer Pattern** | `cartReducer` in `CartContext` | Predictable state transitions for complex state |
| **Observer Pattern** | Intersection Observer for scroll animations | Decouple scroll detection from animation logic |
| **Middleware Pattern** | `middleware.ts` for auth | Intercept requests before they reach routes |
| **Component Composition** | Sections → Page, Sidebar → AdminLayout | Build complex UIs from simple, focused components |
| **Separation of Concerns** | `lib/`, `hooks/`, `components/`, `contexts/` | Each directory has a single responsibility |

---

### Q: How do you handle errors in your application?

**A:** Error handling at multiple levels:

1. **Form Validation Errors** — Zod schemas catch invalid input and display field-level error messages using React Hook Form's `formState.errors`.

2. **API Errors** — The booking confirmation API uses try-catch with specific HTTP status codes (400, 401, 404, 500) and descriptive error messages.

3. **Supabase Query Errors** — After every Supabase query, I check the `error` property:
   ```typescript
   const { data, error } = await supabase.from("bookings").select("*");
   if (error) {
     console.error("Failed to fetch bookings:", error);
     setError("Failed to load bookings");
   }
   ```

4. **Loading States** — Every data-fetching component shows a loading spinner (`LoadingSpinner` component) while data is being fetched, preventing blank screens.

5. **User Feedback** — Success and error messages are displayed using toast-like notifications (state-driven visibility in components).

---

### Q: How would you improve this project if given more time?

**A:** Several improvements I'd make:

1. **Testing** — Add unit tests (Jest/Vitest) for hooks and utility functions, integration tests for API routes, and E2E tests (Playwright/Cypress) for critical flows.

2. **Server Actions** — Migrate simple CRUD operations from client-side Supabase calls to Next.js Server Actions for better security.

3. **Error Boundaries** — Add React Error Boundaries to gracefully handle runtime errors without crashing the entire app.

4. **Pagination** — Add pagination or infinite scroll for menu items and bookings as the data grows.

5. **Role-Based Access** — Add multiple admin roles (manager, staff) with different permissions.

6. **Order System** — Complete the checkout flow with payment integration (Stripe/Razorpay).

7. **PWA Support** — Add service workers for offline menu browsing and push notifications.

8. **Analytics** — Add Vercel Analytics or PostHog for user behavior tracking.

9. **Caching** — Implement ISR (Incremental Static Regeneration) for the public menu page to reduce database queries.

10. **Accessibility** — Full WCAG 2.1 AA compliance audit and fixes.

---

## 15. Scenario-Based / Behavioral Questions

### Q: Describe a challenging problem you faced and how you solved it.

**A:** One challenge was **scroll performance**. Initially, I used CSS `scroll-behavior: smooth` combined with scroll event listeners for fade-in animations. This caused **jank on mobile devices** because scroll event listeners fire at a very high rate, causing layout thrashing.

**Solution:**
1. Replaced CSS smooth scroll with the **Lenis library**, which uses `requestAnimationFrame` for physics-based, 60fps smooth scrolling.
2. Replaced scroll event listeners with **Intersection Observer API** — it only fires when elements enter/exit the viewport, not on every pixel of scroll.
3. Used CSS `will-change: transform, opacity` on animated elements to hint the browser to use GPU acceleration.

The result was buttery-smooth scrolling even on low-end mobile devices.

---

### Q: How did you handle real-time booking notifications?

**A:** When a customer submits a booking, the admin should be notified immediately without refreshing the page.

**Implementation:**
1. Set up a Supabase Realtime subscription on the `bookings` table in the admin bookings page.
2. When a new booking is inserted, the callback adds it to the local state array.
3. An `<audio>` element (referenced with `useRef`) plays a notification sound.
4. The new booking appears at the top of the table with a "pending" status badge.
5. The admin can click "Confirm" to trigger the API route, which updates the status and sends an email.

**Cleanup:** The `useEffect` return function removes the Realtime channel to prevent memory leaks when the admin navigates away.

---

### Q: How would you handle scaling this application for a restaurant chain with 50 locations?

**A:** I'd make several architectural changes:

1. **Multi-tenancy** — Add a `restaurant_id` column to all tables and filter queries by location. Each restaurant gets its own settings, menu, and bookings.

2. **Role-Based Access** — Implement roles (super-admin, restaurant-manager, staff) with Supabase RLS policies scoped to specific restaurants.

3. **Caching Layer** — Use Redis or Vercel Edge Cache for frequently accessed data like menus and settings.

4. **CDN for Images** — Use a dedicated CDN (Cloudflare Images, ImageKit) instead of Supabase Storage for faster global delivery.

5. **Database** — Consider Supabase's connection pooling (PgBouncer) and read replicas for handling increased query load.

6. **Microservices** — Extract the email notification service into a separate queue-based system (using Supabase Edge Functions or AWS Lambda + SQS) to prevent email failures from blocking booking confirmations.

7. **Monitoring** — Add Sentry for error tracking, DataDog for performance monitoring, and structured logging.

---

### Q: Walk me through what happens when a customer makes a booking.

**A:** End-to-end flow:

1. **Customer fills form** — The `BookingForm` component uses React Hook Form with Zod validation. As the user types, validation runs in real-time.

2. **Form submission** — On submit, the validated data is sent to Supabase via `supabase.from("bookings").insert(formData)`.

3. **Database insert** — PostgreSQL inserts the row with `status: 'pending'` and `created_at: now()`. RLS policy allows public inserts.

4. **Real-time event** — Supabase Realtime detects the INSERT and pushes it via WebSocket to all connected admin clients.

5. **Admin notification** — The admin's bookings page receives the event, adds the new booking to state, and plays a notification sound.

6. **Admin confirms** — The admin clicks "Confirm", which sends a POST request to `/api/bookings/confirm` with the booking ID.

7. **API processing** — The API route:
   - Validates the admin's session
   - Updates `status = 'confirmed'` in the database
   - Sends a confirmation email via Resend to the customer

8. **Real-time update** — The status change triggers another Realtime event, updating the booking's status badge from "pending" to "confirmed" on all admin screens.

9. **Customer receives email** — The customer gets an email with their booking details (date, time, guests, restaurant name).

---

### Q: What would you do differently if you started this project from scratch?

**A:**
1. **Set up testing from day one** — Write tests alongside features, not as an afterthought.
2. **Use Server Actions** — For simple CRUD operations, Server Actions would reduce the amount of client-side Supabase logic and improve security.
3. **Implement error boundaries** — Wrap critical sections with React Error Boundaries from the start.
4. **Add CI/CD pipeline** — Set up GitHub Actions for linting, type checking, and testing on every PR.
5. **Use a monorepo tool** — If the project grows, tools like Turborepo would help manage shared types and utilities.
6. **Database migrations tool** — Use Supabase CLI for version-controlled migrations instead of manual SQL files.
7. **Internationalization (i18n)** — Plan for multi-language support from the beginning with `next-intl`.

---

## 💡 Quick-Fire Questions

### Q: What is the Virtual DOM?
**A:** A lightweight JavaScript representation of the real DOM. React updates the Virtual DOM first, diffs it with the previous version, and only applies the minimal changes to the real DOM. This is more efficient than manipulating the real DOM directly.

### Q: What is the difference between `useMemo` and `useCallback`?
**A:** `useMemo` memoizes a **computed value**, `useCallback` memoizes a **function**. Both prevent unnecessary recalculations/recreations on re-renders. In my project, I use `useCallback` for cart dispatch wrappers.

### Q: What is a closure in JavaScript?
**A:** A function that retains access to variables from its outer scope even after the outer function has returned. In my project, the `cartReducer` callback in `useReducer` is a closure — it has access to the `state` variable from the outer component scope.

### Q: What is the difference between `==` and `===`?
**A:** `==` performs type coercion before comparison (`"5" == 5` is `true`), while `===` checks both value and type without coercion (`"5" === 5` is `false`). I always use `===` in TypeScript for strict equality.

### Q: What is CORS?
**A:** Cross-Origin Resource Sharing — a security mechanism that controls which domains can access your API. Supabase handles CORS configuration for its APIs. My Next.js API routes run on the same domain, so CORS isn't an issue for internal calls.

### Q: What is the difference between SQL and NoSQL?
**A:** SQL databases (like PostgreSQL/Supabase in my project) are relational with structured schemas, ACID transactions, and SQL queries. NoSQL databases (MongoDB, DynamoDB) are schema-flexible, horizontally scalable, and use document/key-value models. I chose PostgreSQL because restaurant data (menus, bookings) is inherently relational and benefits from structured schemas and RLS.

---

> 📌 **Tip:** Practice explaining these concepts out loud, using the project as concrete examples. Interviewers value candidates who can connect theory to real-world implementation.
