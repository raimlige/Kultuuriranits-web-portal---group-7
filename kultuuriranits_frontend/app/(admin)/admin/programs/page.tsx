import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Program } from "../../../../models/Program";
import { AdminProgramsTable } from "../../../../components/AdminProgramsTable";

const API_URL = process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:5050";

type AdminProgramsResult = {
  isAdmin: boolean;
  programs: Program[];
};

async function checkAdminAndGetPrograms(): Promise<AdminProgramsResult> {
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
        programs: [],
      };
    }

    const currentUser = await meRes.json();

    if (!currentUser.role || currentUser.role.name !== "ADMIN") {
      return {
        isAdmin: false,
        programs: [],
      };
    }

    const res = await fetch(`${API_URL}/program`, {
      headers: { Cookie: cookieString },
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        isAdmin: true,
        programs: [],
      };
    }

    const data = await res.json();

    return {
      isAdmin: true,
      programs: data.content ?? [],
    };
  } catch (error) {
    console.error("Error fetching programs:", error);

    return {
      isAdmin: false,
      programs: [],
    };
  }
}

export default async function AdminProgramsPage() {
  const { isAdmin, programs } = await checkAdminAndGetPrograms();

  if (!isAdmin) {
    redirect("/");
  }

  return <AdminProgramsTable programs={programs} />;
}