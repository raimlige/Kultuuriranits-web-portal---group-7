const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

export default async function getProgram(programId: string) {
 
    const res = await fetch(`${API_URL}/program/${programId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    } else {
        return await res.json();
    }
}

export async function getPrograms() {
 
    const res = await fetch(`${API_URL}/program`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    } else {
        return await res.json();
    }
}

export async function getPopularPrograms() {
    try {
        const res = await fetch(`${API_URL}/program`, {
            cache: "no-store"
        });

        if (!res.ok) {
            return [];
        }
        
        return await res.json();
    } catch (error) {
        console.error("Viga andmebaasist programmide pärimisel:", error);
        return [];
    }
}