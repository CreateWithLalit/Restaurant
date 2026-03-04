"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "../../lib/supabase";
import { MenuItem } from "../../lib/types";
import ImageUpload from "./ImageUpload";

// 1. Define the validation schema for a dish
const menuItemSchema = z.object({
    name: z.string().min(2, "Dish name is required"),
    category: z.string().min(2, "Category is required"),
    description: z.string().optional(),
    // We use coerce.number so the text input automatically becomes a math number
    price: z.coerce.number().min(0.01, "Price must be greater than 0"),
    available: z.boolean().default(true),
    featured: z.boolean().default(false),
});

type MenuItemFormValues = z.infer<typeof menuItemSchema>;

const inputBase =
    "w-full rounded-md border border-[#F5F1E6]/10 bg-[#111111] px-4 py-3 text-sm text-[#F5F1E6] placeholder-[#F5F1E6]/30 transition-colors duration-200 focus:border-[#C9A227] focus:outline-none focus:ring-1 focus:ring-[#C9A227]/40";

export default function MenuItemForm({ initialData }: { initialData?: MenuItem }) {
    const router = useRouter();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<MenuItemFormValues>({
        resolver: zodResolver(menuItemSchema) as any,
        defaultValues: {
            name: initialData?.name || "",
            category: initialData?.category || "",
            description: initialData?.description || "",
            price: initialData ? initialData.price / 100 : 0,
            available: initialData?.available ?? true,
            featured: initialData?.featured ?? false,
        },
    });

    const onSubmit: SubmitHandler<MenuItemFormValues> = async (data) => {
        setSubmitError(null);

        try {
            let image_url = null;

            // 1. Upload image if selected
            if (selectedFile) {
                const fileExt = selectedFile.name.split(".").pop();
                const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `menu/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from("menu-images")
                    .upload(filePath, selectedFile);

                if (uploadError) throw uploadError;

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from("menu-images")
                    .getPublicUrl(filePath);

                image_url = publicUrl;
            }

            // 2. Save dish to database
            const priceInCents = Math.round(data.price * 100);
            const itemData = {
                name: data.name,
                category: data.category,
                description: data.description || null,
                price: priceInCents,
                available: data.available,
                featured: data.featured,
                image_url: image_url || initialData?.image_url || null,
            };

            const { error } = initialData?.id
                ? await supabase.from("menu_items").update(itemData).eq("id", initialData.id)
                : await supabase.from("menu_items").insert([itemData]);

            if (error) throw error;

            router.push("/admin/menu");
            router.refresh();
        } catch (error: any) {
            setSubmitError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-xl border border-[#F5F1E6]/10 bg-[#1C1A18] p-6 shadow-xl">
            {submitError && (
                <div className="rounded border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                    {submitError}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {/* Name */}
                <div>
                    <label htmlFor="itemName" className="mb-1.5 block text-xs font-medium tracking-wider text-[#F5F1E6]/60 uppercase">
                        Dish Name *
                    </label>
                    <input id="itemName" {...register("name")} placeholder="Truffle Pasta" className={inputBase} autoComplete="off" />
                    {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                </div>

                {/* Category */}
                <div>
                    <label htmlFor="itemCategory" className="mb-1.5 block text-xs font-medium tracking-wider text-[#F5F1E6]/60 uppercase">
                        Category *
                    </label>
                    <input id="itemCategory" {...register("category")} placeholder="Mains, Starters, Drinks..." className={inputBase} autoComplete="off" />
                    {errors.category && <p className="mt-1 text-xs text-red-400">{errors.category.message}</p>}
                </div>

                {/* Price */}
                <div>
                    <label htmlFor="itemPrice" className="mb-1.5 block text-xs font-medium tracking-wider text-[#F5F1E6]/60 uppercase">
                        Price (₹) *
                    </label>
                    <input id="itemPrice" {...register("price")} type="number" step="0.01" placeholder="450.00" className={inputBase} />
                    {errors.price && <p className="mt-1 text-xs text-red-400">{errors.price.message}</p>}
                </div>
            </div>

            {/* Image Upload */}
            <ImageUpload onImageSelect={setSelectedFile} />

            {/* Description */}
            <div>
                <label htmlFor="itemDescription" className="mb-1.5 block text-xs font-medium tracking-wider text-[#F5F1E6]/60 uppercase">
                    Description
                </label>
                <textarea
                    id="itemDescription"
                    {...register("description")}
                    rows={3}
                    placeholder="A delicious description of the ingredients..."
                    className={`${inputBase} resize-none`}
                />
            </div>

            {/* Toggles */}
            <div className="flex gap-8 border-t border-[#F5F1E6]/10 pt-6">
                <label htmlFor="itemAvailable" className="flex items-center gap-3 cursor-pointer">
                    <input id="itemAvailable" type="checkbox" {...register("available")} className="h-4 w-4 accent-[#C9A227]" />
                    <span className="text-sm font-medium text-[#F5F1E6]">Currently Available</span>
                </label>

                <label htmlFor="itemFeatured" className="flex items-center gap-3 cursor-pointer">
                    <input id="itemFeatured" type="checkbox" {...register("featured")} className="h-4 w-4 accent-[#C9A227]" />
                    <span className="text-sm font-medium text-[#F5F1E6]">Featured Dish (Star)</span>
                </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 border-t border-[#F5F1E6]/10 pt-6">
                <button
                    type="button"
                    onClick={() => router.push("/admin/menu")}
                    className="rounded-md px-4 py-2 text-sm font-medium text-[#F5F1E6]/60 hover:text-[#F5F1E6] transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-[#C9A227] px-6 py-2 text-sm font-semibold text-[#111111] transition-all hover:bg-[#F5F1E6] disabled:opacity-50"
                >
                    {isSubmitting ? "Saving..." : initialData?.id ? "Update Dish" : "Save Dish"}
                </button>
            </div>
        </form>
    );
}