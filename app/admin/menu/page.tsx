import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import Link from "next/link";
import MenuTable from "@/components/admin/MenuTable";

export default async function MenuAdminPage() {
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

    const { data: menuItems, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("category", { ascending: true })
        .order("name", { ascending: true });

    if (error) {
        return <div className="p-8 text-red-400">Error loading menu: {error.message}</div>;
    }

    return (
        <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#F5F1E6]">Menu Management</h1>
                    <p className="text-[#F5F1E6]/60 mt-2">Add, edit, and organize your restaurant's dishes.</p>
                </div>
                <Link href="/admin/menu/new">
                    <button className="rounded-md bg-[#C9A227] px-4 py-2 text-sm font-semibold text-[#111111] hover:bg-[#F5F1E6] transition-colors">
                        + Add New Dish
                    </button>
                </Link>
            </div>

            <div className="overflow-hidden rounded-lg border border-[#F5F1E6]/10 shadow-sm">
                <MenuTable initialItems={menuItems || []} />
            </div>
        </div>
    );
}