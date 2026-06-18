import { Feedback } from "../models/Feedback";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

async function getAllFeedback(): Promise<Feedback[]> {
    try {
        const cookieStore = await cookies();
        const cookieString = cookieStore.toString();

        const res = await fetch(`${API_URL}/feedback`, {
            headers: {
                Cookie: cookieString,
            },
            cache: "no-store",
        });

        return res.ok ? await res.json() : [];
    } catch (error) {
        console.error("Viga tagasiside pärimisel komponendis:", error);
        return [];
    }
}

interface ProgramFeedbackListProps {
    programId: number;
}

export async function ProgramFeedbackList({ programId }: ProgramFeedbackListProps) {
    const allFeedback = await getAllFeedback();

    const programFeedback = allFeedback.filter(
        (fb) => fb.program && fb.program.id === programId
    );

    return (
        <div style={{ marginTop: "40px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
                Külastajate tagasiside ({programFeedback.length})
            </h3>

            {programFeedback.length === 0 ? (
                <p style={{ color: "gray", fontStyle: "italic" }}>
                    Sellele programmile pole veel tagasisidet jäetud.
                </p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {programFeedback.map((fb) => (
                        <div
                            key={fb.id}
                            style={{
                                border: "1px solid #eee",
                                padding: "16px",
                                borderRadius: "8px",
                                backgroundColor: "#f9f9f9",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "8px",
                                }}
                            >
                                <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                                    {fb.person?.firstName} {fb.person?.lastName} {fb.createdAt ? `- ${new Date(fb.createdAt).toLocaleDateString()}` : ""}
                                </span>
                                <span style={{ color: "#ffb100", fontWeight: "bold" }}>
                                    {"★".repeat(fb.rating || 0)}{"☆".repeat(5 - (fb.rating || 0))} ({fb.rating}/5)
                                </span>
                            </div>
                            <p style={{ margin: 0, fontSize: "14px", color: "#444", fontStyle: "italic" }}>
                                {`"${fb.text}"`}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}