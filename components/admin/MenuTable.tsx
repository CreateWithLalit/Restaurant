"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { MenuItem } from "@/lib/types";
import { useRouter } from "next/navigation";

interface MenuTableProps {
    initialItems: MenuItem[];
}

export default function MenuTable({ initialItems }: MenuTableProps) {
    const [items, setItems] = useState<MenuItem[]>(initialItems);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        setIsDeleting(id);
        try {
            const { error } = await supabase
                .from("menu_items")
                .delete()
                .eq("id", id);

            if (error) throw error;

            // Remove from local state
            setItems(items.filter(item => item.id !== id));
            router.refresh();
        } catch (err: any) {
            alert(`Failed to delete item: ${err.message}`);
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#F5F1E6] min-w-[600px]">
                <thead className="bg-[#111111] text-[#F5F1E6]/60">
                    <tr>
                        <th className="p-4 font-medium">Dish Name</th>
                        <th className="p-4 font-medium">Category</th>
                        <th className="p-4 font-medium">Price</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F1E6]/10 bg-[#1C1A18]">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <tr key={item.id} className="hover:bg-[#F5F1E6]/5">
                                <td className="p-4">
                                    <p className="font-medium text-[#C9A227]">{item.name}</p>
                                    {item.description && (
                                        <p className="text-xs text-[#F5F1E6]/60 line-clamp-1 mt-1">{item.description}</p>
                                    )}
                                </td>
                                <td className="p-4">
                                    <span className="inline-block rounded-full bg-[#F5F1E6]/10 px-2 py-1 text-xs">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="p-4">
                                    ₹{(item.price / 100).toFixed(2)}
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        {item.available ? (
                                            <span className="text-xs text-green-400 border border-green-400/30 bg-green-400/10 px-2 py-0.5 rounded-full">Available</span>
                                        ) : (
                                            <span className="text-xs text-red-400 border border-red-400/30 bg-red-400/10 px-2 py-0.5 rounded-full">Sold Out</span>
                                        )}
                                        {item.featured && (
                                            <span className="text-xs text-[#C9A227] border border-[#C9A227]/30 bg-[#C9A227]/10 px-2 py-0.5 rounded-full">Featured</span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => router.push(`/admin/menu/edit/${item.id}`)}
                                        className="text-sm font-medium text-[#F5F1E6]/60 hover:text-[#C9A227] mr-4 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id, item.name)}
                                        disabled={isDeleting === item.id}
                                        className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                                    >
                                        {isDeleting === item.id ? "..." : "Delete"}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="p-12 text-center text-[#F5F1E6]/60">
                                <p className="mb-4">Your menu is currently empty.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
