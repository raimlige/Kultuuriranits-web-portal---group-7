import { Feedback } from "../../../models/Feedback";
import { RemoveFeedback } from "../../../components/RemoveFeedback";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

async function getFeedback(): Promise<Feedback[]> {
    try {
        const cookieStore = await cookies();
        const cookieString = cookieStore.toString();
        const res = await fetch(`${API_URL}/feedback`, {
            headers: {
                Cookie: cookieString
            }, cache: "no-store"
        });
        return res.ok ? await res.json() : [];
    } catch (error) {
        console.error("Viga tagasiside pärimisel backendist:", error);
        return [];
    }
}

async function getCurrentUser(): Promise<{ id: number } | null> {
    try {
        const cookieStore = await cookies();
        const cookieString = cookieStore.toString();
        const res = await fetch(`${API_URL}/me`, {
            headers: { Cookie: cookieString },
            cache: "no-store",
        });
        if (res.ok) return await res.json();
        return null;
    } catch (error) {
        return null;
    }
}


export default async function getFeedbackPage() {
    const [currentUser, feedback] = await Promise.all([
        getCurrentUser(),
        getFeedback()
    ]);

    if (!currentUser) {
        redirect("/login");
    }


    return (
        <div style={{ padding: "40px" }}>
            <h1>Minu Tagasiside</h1>
            {feedback.length === 0 ? (<p>Tagasisidet veel pole.</p>) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {feedback.map((fb) => (
                        <li key={fb.id} style={{ borderBottom: "1px solid #eee", padding: "10px 0", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "400px" }}>
                            <div>
                                <p style={{ margin: 0, fontWeight: "bold" }}>{fb.program?.title || "Nimetu programm"}</p>
                            </div>
                            <RemoveFeedback feedbackId={fb.id} apiUrl={API_URL} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
