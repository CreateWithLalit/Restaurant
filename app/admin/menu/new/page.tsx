import MenuItemForm from "@/components/admin/MenuItemForm";

export default function AddMenuItemPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#F5F1E6]">Add New Dish</h1>
                <p className="text-[#F5F1E6]/60 mt-2">Create a new entry for your restaurant menu.</p>
            </div>

            <MenuItemForm />
        </div>
    );
}
