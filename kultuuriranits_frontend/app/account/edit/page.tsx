import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AccountEditForm from "../../../components/AccountEditForm";
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

export default async function AccountEditPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return <AccountEditForm user={user} />;
}