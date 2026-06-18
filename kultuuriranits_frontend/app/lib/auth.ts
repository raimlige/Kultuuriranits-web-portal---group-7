import { cookies } from "next/headers";

export type DatabaseRole = "TEACHER" | "CULTURAL_INSTITUTION" | "ADMIN";

export type CurrentUser = {
  id: number;
  role?: {
    id: number;
    name: DatabaseRole;
  };
  organization?: {
    id: number;
    name: string;
  };
  firstName?: string;
  lastName?: string;
  email?: string;
} | null;

const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

export async function getCurrentUser(): Promise<CurrentUser> {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${API_URL}/me`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch {
    return null;
  }
}