import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Person } from "../../../../models/Person";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

async function checkAdminAndGetUsers(): Promise<Person[]> {
    try {
        const cookieStore = await cookies();
        const cookieString = cookieStore.toString();

        const meRes = await fetch(`${API_URL}/me`, {
            headers: { Cookie: cookieString },
            cache: "no-store",
        });

        if (!meRes.ok) return [];
        const currentUser: Person = await meRes.json();

        if (!currentUser.role || currentUser.role.name !== "ADMIN") {
            return [];
        }

        const res = await fetch(`${API_URL}/users`, {
            headers: { Cookie: cookieString },
            cache: "no-store"
        });

        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export default async function AdminUsersPage() {
    const users = await checkAdminAndGetUsers();
    if (users.length === 0) {
        redirect("/");
    }

    return (
        <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
            <h1>Kasutajakontod</h1>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                    <tr style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>
                        <th style={{ padding: "10px" }}>ID</th>
                        <th style={{ padding: "10px" }}>Nimi</th>
                        <th style={{ padding: "10px" }}>E-mail</th>
                        <th style={{ padding: "10px" }}>Isikukood</th>
                        <th style={{ padding: "10px" }}>Asutus</th>
                        <th style={{ padding: "10px" }}>Roll</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "10px" }}>{user.id}</td>
                            <td style={{ padding: "10px" }}>{user.firstName} {user.lastName}</td>
                            <td style={{ padding: "10px" }}>{user.email}</td>
                            <td style={{ padding: "10px" }}>{user.personalCode}</td>
                            <td style={{ padding: "10px" }}> {user.organization?.name || "Asutus puudub"}</td>
                            <td style={{ padding: "10px" }}>
                                <span style={{
                                    backgroundColor: user.role?.name === "ADMIN" ? "#ffcccc" : "#e0e0e0",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    fontWeight: "bold"
                                }}>
                                    {user.role?.name ?? "ROLL PUUDUB"}
                                </span>


                                <Link href={`/admin/users/${user.id}`} style={{
                                    marginLeft: "10px",
                                    padding: "4px 8px",
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    textDecoration: "none", // Eemaldab lingi altjoone
                                    fontSize: "14px"
                                }}>
                                    Muuda
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}