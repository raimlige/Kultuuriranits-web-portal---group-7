import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const cookieString = cookieStore.toString();

        const res = await fetch(`${API_URL}/me`, {
            headers: { Cookie: cookieString },
            cache: "no-store",
        });

        if (res.ok) return await res.json();
        return null;
    } catch {
        return null;
    }
}

function getRoleLabel(roleName?: string) {
    switch (roleName) {
        case "TEACHER":
            return "Õpetaja";
        case "CULTURAL_INSTITUTION":
            return "Kultuuriasutus";
        case "ADMIN":
            return "Admin";
        default:
            return "TEACHER";
    }
}

export default async function AccountPage() {
    const user = await getCurrentUser();

    /*     if (!user) {
            redirect("/login");
        } */

    const fullName = user.name ?? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

    return (
        <main className="max-w-3xl mx-auto px-6 py-12">

            <h1 className="text-center text-5xl font-bold mb-12">Minu konto</h1>

            {/* Profiilikaart */}
            <div className="border border-gray-200 rounded-2xl bg-gray-50 py-16 px-6 flex flex-col items-center text-center mb-8">

                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-6">
                    <User className="w-16 h-16 text-gray-400" />
                </div>

                <h2 className="text-2xl font-bold mb-1">{fullName || "Kasutaja"}</h2>

                {user.organization?.name && (
                    <p className="text-gray-500">{user.organization.name}</p>
                )}

                {user.role?.name && (
                    <p className="text-gray-500 mb-4">{getRoleLabel(user.role.name)}</p>
                )}

                <div className="text-gray-500 text-sm space-y-1">
                    {user.organization?.address && <p>{user.organization.address}</p>}
                    {user.organization?.city && <p>{user.organization.city}</p>}
                    {user.phone && <p>{user.phone}</p>}
                    {user.email && <p>{user.email}</p>}
                </div>

            </div>

            {/* Nupud */}
            <div className="flex gap-4">
                <Link
                    href="/account/edit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                    Muuda kontaktandmeid
                </Link>
                <Link
                    href="/account/password"
                    className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                    Muuda parool
                </Link>
            </div>

        </main>
    );
}