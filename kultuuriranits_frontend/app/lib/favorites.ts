import { cookies } from "next/headers";
import { Favorites } from "../../models/Favorites";

const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

export async function getUserFavorites(): Promise<Favorites[]> {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${API_URL}/favorites`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch {
    return [];
  }
}