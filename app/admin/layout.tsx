import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#111111]">
            <Sidebar />
            <main className="lg:pl-64 pt-16 lg:pt-0">
                <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
