import { redirect } from "next/navigation";

export default function AdminPage() {
    // Automatically send users to the bookings dashboard
    redirect("/admin/bookings");
}
