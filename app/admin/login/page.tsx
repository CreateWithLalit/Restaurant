"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// 1. Define the validation schema
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Initialize the Supabase browser client
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Middleware will now allow access to /admin/bookings
            router.push("/admin/bookings");
            router.refresh();
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8 rounded-lg border p-8 shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">D-Dion Admin</h1>
                    <p className="mt-2 text-muted-foreground">Sign in to manage your restaurant</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    {error && (
                        <div className="rounded bg-destructive/15 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
                        <input
                            id="email"
                            {...register("email")}
                            type="email"
                            autoComplete="username"
                            className="mt-1 w-full rounded-md border p-2"
                            placeholder="admin@d-dion.com"
                        />
                        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">Password</label>
                        <input
                            id="password"
                            {...register("password")}
                            type="password"
                            autoComplete="current-password"
                            className="mt-1 w-full rounded-md border p-2"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-primary py-2 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                        {loading ? "Authenticating..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}