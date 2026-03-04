# Fix: Menu Images Not Showing (Supabase Storage + Next.js)

## Problem
Images uploaded from the admin panel were not displaying in the menu section.
The browser console showed:
- `400 Bad Request` on `/_next/image?url=...`
- `"url" parameter is not allowed`

## Root Causes

### 1. Invalid `qualities` key in `next.config.ts`
`qualities` is not a valid Next.js Image configuration option.
Having an unrecognized key caused the Image Optimization API to malfunction and reject all external image URLs.

### 2. Missing `unoptimized: true` flag
Next.js `<Image>` routes all external images through its optimization API (`/_next/image`).
For this to work, the image hostname must exactly match a `remotePatterns` entry.
If there's any mismatch, Next.js returns `"url" parameter is not allowed`.

### 3. Supabase bucket not confirmed public
`getPublicUrl()` in Supabase **only constructs** the URL string — it does NOT check if the bucket allows public access.
If the bucket is private, accessing the public URL returns `400`.

---

## Fix Applied

### File: `next.config.ts`

**Before:**
```ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
    qualities: [75, 80, 90, 100], // ❌ NOT a valid Next.js option
  },
};
```

**After:**
```ts
const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // ✅ Bypasses the optimization API entirely
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" }, // ✅ fixed wildcard
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
    // ✅ Removed invalid `qualities` key
  },
};
```

### Supabase Dashboard
- Go to **Storage → Buckets → menu-images → Edit Bucket**
- Ensure **Public bucket** toggle is **ON**
- This allows images to be accessed without authentication

---

## Key Takeaways for Future Reference

| Issue | Symptom | Fix |
|---|---|---|
| Invalid key in `images` config | `"url" parameter is not allowed` | Remove unsupported keys like `qualities` |
| External image hostname not matched | `400` on `/_next/image` | Add `unoptimized: true` OR correct `remotePatterns` |
| Supabase bucket is private | `400` when fetching the image directly | Make the bucket Public in Supabase Dashboard |
| `**.supabase.co` vs `*.supabase.co` | Hostname not matched | Use `*.supabase.co` for single-subdomain Supabase URLs |

## Notes
- `unoptimized: true` means images are served as-is without resizing/compression by Next.js. Fine for most restaurant/portfolio sites.
- If you want Next.js optimization back in the future, remove `unoptimized: true` and ensure `remotePatterns` has the correct hostname — and that no invalid config keys are present.
