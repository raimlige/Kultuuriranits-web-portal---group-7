import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Person } from "../../../../../models/Person";
import UserEditForm from "../../../../../components/UserEditForm";
import { Organization } from "@/models/Organization";

const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

async function getOrganizations(): Promise<Organization[]> {
    const res = await fetch(`${API_URL}/organization`, {
        cache: "no-store"
    });

    return res.ok ? await res.json() : [];
}

async function checkAdminAndGetSingleUser(id: string): Promise<Person | null> {
    try {
        const cookieStore = await cookies();
        const cookieString = cookieStore.toString();

        const meRes = await fetch(`${API_URL}/me`, {
            headers: { Cookie: cookieString },
            cache: "no-store",
        });

        if (!meRes.ok) return null;
        const currentUser: Person = await meRes.json();

        if (!currentUser.role || currentUser.role.name !== "ADMIN") {
            return null;
        }

        const res = await fetch(`${API_URL}/users/${id}`, {
            headers: { Cookie: cookieString },
            cache: "no-store"
        });

        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminUserIdPage({ params }: PageProps) {
    const { id } = await params;
    const user = await checkAdminAndGetSingleUser(id);

    if (!user) {
        redirect("/admin/users");
    }
    const organizations = await getOrganizations();

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <UserEditForm user={user} organizations={organizations} />
        </div>
    );
}