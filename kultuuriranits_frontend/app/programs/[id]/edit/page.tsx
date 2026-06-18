import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Program } from "@/models/Program";
import { ProgramEditForm } from "@/components/ProgramEditForm";
import { Category } from "@/models/Category";

const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

async function getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_URL}/category`, {
        cache: "no-store"
    });

    return res.ok ? await res.json() : [];
}

async function getProgramData(id: string): Promise<Program | null> {
    try {
        const cookieStore = await cookies();
        const cookieString = cookieStore.toString();
        
        const meRes = await fetch(`${API_URL}/me`, {
            headers: { Cookie: cookieString },
            cache: "no-store",
        });
        if (!meRes.ok) return null;
        const currentUser = await meRes.json();
        if (!currentUser.role || currentUser.role.name !== "CULTURAL_INSTITUTION") return null;

        const res = await fetch(`${API_URL}/program/${id}`, { cache: "no-store" });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error("Error loading program:", error);
        return null;
    }
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProgramPage({ params }: PageProps) {
    const { id } = await params;
    const program = await getProgramData(id);
    const categories = await getCategories();

    if (!program) {
        redirect("/cultural_institution");
    }

    return (
        <div>
            {/* <h1>Muuda programmi (ID: {program.id})</h1> */}
            <ProgramEditForm program={program} categories={categories} />
        </div>
    );
}