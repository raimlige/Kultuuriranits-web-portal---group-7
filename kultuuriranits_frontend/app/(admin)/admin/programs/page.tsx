import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Program } from "../../../../models/Program";
import { Category } from "../../../../models/Category";
import { Organization } from "../../../../models/Organization";

const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

async function checkAdminAndGetPrograms(): Promise<Program[]> {
    try {
        const cookieStore = await cookies();
        const cookieString = cookieStore.toString();
        const meRes = await fetch(`${API_URL}/me`, {
            headers: { Cookie: cookieString },
            cache: "no-store",
        });

        if (!meRes.ok) return [];
        const currentUser = await meRes.json();

        if (!currentUser.role || currentUser.role.name !== "ADMIN") {
            return [];
        }
        const res = await fetch(`${API_URL}/program`, {
            headers: { Cookie: cookieString },
            cache: "no-store"
        });

        if (!res.ok) return [];
        const data = await res.json();

        return data.content ?? [];
    } catch (error) {
        console.error("Error fetching programs:", error);
        return [];
    }
}

export default async function AdminProgramsPage() {
    const programs = await checkAdminAndGetPrograms();
    if (programs.length === 0) {
        redirect("/");
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Puudub";
        return new Date(dateString).toLocaleDateString("et-EE");
    };

    return (
        <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
            <h1>Programmid</h1>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                    <tr style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>
                        <th style={{ padding: "10px" }}>ID</th>
                        <th style={{ padding: "10px" }}>Nimi</th>
                        <th style={{ padding: "10px" }}>Kirjeldus</th>
                        <th style={{ padding: "10px" }}>Hind õpilase kohta</th>
                        <th style={{ padding: "10px" }}>Kestus</th>
                        <th style={{ padding: "10px" }}>Sihtgrupp</th>
                        <th style={{ padding: "10px" }}>Min.grupp suurus</th>
                        <th style={{ padding: "10px" }}>Max.grupp suurus</th>
                        <th style={{ padding: "10px" }}>Asukoht</th>
                        <th style={{ padding: "10px" }}>Keel</th>
                        <th style={{ padding: "10px" }}>Staatus</th>
                        <th style={{ padding: "10px" }}>Loomis.kp</th>
                        <th style={{ padding: "10px" }}>Muutmis.kp</th>
                        <th style={{ padding: "10px" }}>Kategooria</th>
                        <th style={{ padding: "10px" }}>Korraldaja</th>

                    </tr>
                </thead>
                <tbody>
                    {programs.map((program) => (
                        <tr key={program.id} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "10px" }}>{program.id}</td>
                            <td style={{ padding: "10px" }}>{program.title}</td>
                            <td style={{ padding: "10px" }}>{program.description}</td>
                            <td style={{ padding: "10px" }}>{program.pricePerStudent}€</td>
                            <td style={{ padding: "10px" }}>{program.durationMinutes} min</td>
                            <td style={{ padding: "10px" }}>{program.targetGroup}</td>
                            <td style={{ padding: "10px" }}>{program.minGroupSize}</td>
                            <td style={{ padding: "10px" }}>{program.maxGroupSize}</td>
                            <td style={{ padding: "10px" }}>{program.location}</td>
                            <td style={{ padding: "10px" }}>{program.language}</td>
                            <td style={{ padding: "10px" }}>{program.status}</td>
                            <td style={{ padding: "10px" }}>{formatDate(program.createdAt)}</td>
                            <td style={{ padding: "10px" }}>{formatDate(program.updatedAt)}</td>
                            <td style={{ padding: "10px" }}>{program.category?.name ?? "Määramata"}</td>
                            <td style={{ padding: "10px" }}>{program.organization?.name ?? "Määramata"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}