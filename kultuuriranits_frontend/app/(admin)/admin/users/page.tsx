import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Person } from "../../../../models/Person";
import { AdminUsersTable } from "../../../../components/AdminUsersTable";

const API_URL = process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:5050";

type AdminUsersResult = {
  isAdmin: boolean;
  users: Person[];
};

async function checkAdminAndGetUsers(): Promise<AdminUsersResult> {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const meRes = await fetch(`${API_URL}/me`, {
      headers: { Cookie: cookieString },
      cache: "no-store",
    });

    if (!meRes.ok) {
      return {
        isAdmin: false,
        users: [],
      };
    }

    const currentUser: Person = await meRes.json();

    if (!currentUser.role || currentUser.role.name !== "ADMIN") {
      return {
        isAdmin: false,
        users: [],
      };
    }

    const res = await fetch(`${API_URL}/users`, {
      headers: { Cookie: cookieString },
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        isAdmin: true,
        users: [],
      };
    }

    return {
      isAdmin: true,
      users: await res.json(),
    };
  } catch (error) {
    console.error("Error fetching users:", error);

    return {
      isAdmin: false,
      users: [],
    };
  }
}

export default async function AdminUsersPage() {
  const { isAdmin, users } = await checkAdminAndGetUsers();

  if (!isAdmin) {
    redirect("/");
  }

  return <AdminUsersTable users={users} />;
}