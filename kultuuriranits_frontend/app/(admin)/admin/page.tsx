import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboard } from "../../../components/AdminDashboard";
import type { Program } from "../../../models/Program";
import type { Person } from "../../../models/Person";
import type { Feedback } from "../../../models/Feedback";

const API_URL = process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:5050";

type ProgramResponse = {
  content?: Program[];
};

type AdminDashboardData = {
  isAdmin: boolean;
  users: Person[];
  programs: Program[];
  feedbacks: Feedback[];
};

async function getAdminDashboardData(): Promise<AdminDashboardData> {
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
        programs: [],
        feedbacks: [],
      };
    }

    const currentUser: Person = await meRes.json();

    if (!currentUser.role || currentUser.role.name !== "ADMIN") {
      return {
        isAdmin: false,
        users: [],
        programs: [],
        feedbacks: [],
      };
    }

    const [usersRes, programsRes, feedbacksRes] = await Promise.all([
      fetch(`${API_URL}/users`, {
        headers: { Cookie: cookieString },
        cache: "no-store",
      }),
      fetch(`${API_URL}/program?page=0&size=500&sort=id,desc`, {
        headers: { Cookie: cookieString },
        cache: "no-store",
      }),
      fetch(`${API_URL}/feedback`, {
        headers: { Cookie: cookieString },
        cache: "no-store",
      }),
    ]);

    const users: Person[] = usersRes.ok ? await usersRes.json() : [];

    const programsData: ProgramResponse = programsRes.ok
      ? await programsRes.json()
      : {};

    const programs = programsData.content ?? [];

    const feedbacks: Feedback[] = feedbacksRes.ok
      ? await feedbacksRes.json()
      : [];

    return {
      isAdmin: true,
      users,
      programs,
      feedbacks,
    };
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);

    return {
      isAdmin: false,
      users: [],
      programs: [],
      feedbacks: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const { isAdmin, users, programs, feedbacks } =
    await getAdminDashboardData();

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <AdminDashboard
      users={users}
      programs={programs}
      feedbacks={feedbacks}
    />
  );
}