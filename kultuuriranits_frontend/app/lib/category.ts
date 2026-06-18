const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

export async function getCategories() {
    const res = await fetch(`${API_URL}/category`, {
        cache: "no-store"
    });

    return res.ok ? await res.json() : [];
}