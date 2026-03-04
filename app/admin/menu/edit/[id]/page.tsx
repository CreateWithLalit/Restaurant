import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { notFound } from "next/navigation";
import Link from "next/link";
import MenuItemForm from "@/components/admin/MenuItemForm";
import { MenuItem } from "@/lib/types";

interface EditMenuItemPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditMenuItemPage({ params }: EditMenuItemPageProps) {
    const { id } = await params;
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

    const { data: item, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !item) {
        return (
            <div className="p-8">
                <h1 className="text-red-400">Error: Item not found</h1>
                <p className="text-[#F5F1E6]/60">Received ID: "{id}"</p>
                {error && <p className="text-[#F5F1E6]/40">Supabase Error: {error.message}</p>}
                <Link
                    href="/admin/menu"
                    className="mt-4 inline-block rounded-md bg-[#C9A227] px-4 py-2 text-sm text-[#111111] font-semibold"
                >
                    Back to Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#F5F1E6]">Edit Dish</h1>
                <p className="text-[#F5F1E6]/60 mt-2">Update the details for "{item.name}".</p>
            </div>

            <MenuItemForm initialData={item as MenuItem} />
        </div>
    );
}
