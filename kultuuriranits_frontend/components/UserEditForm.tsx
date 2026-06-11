"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Person } from "../models/Person";
import { useEffect } from "react";
import { Organization } from "@/models/Organization";


interface UserEditFormProps {
    user: Person;
    organizations: Organization[];
}

export default function UserEditForm({ user, organizations }: UserEditFormProps) {
    const router = useRouter();
    const [firstName, setFirstName] = useState(user.firstName || "");
    const [lastName, setLastName] = useState(user.lastName || "");
    const [email, setEmail] = useState(user.email || "");
    const [password, setPassword] = useState(user.password || "");
    const [roleId, setRoleId] = useState(user.role?.id || 1);
    const [organizationId, setOrganizationId] = useState(user.organization?.id || 1);
    const [loading, setLoading] = useState(false);

    // GET organization
    /*     useEffect(() => {
            async function fetchOrganizations() {
                try {
                    const res = await fetch(`${API_URL}/organization`);
                    if (res.ok) {
                        const data = await res.json();
                        fetchOrganizations();
                    }
                } catch (err) {
                    console.error("Organisatsioonide laadimine ebaõnnestus", err);
                }
            }
            fetchOrganizations();
        }, [API_URL]); */


    // DELETE users/{id}
    const handleDelete = async () => {
        if (!confirm(`Kas oled kindel, et soovid kasutaja ${firstName} ${lastName} kustutada?`)) {
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/users/${user.id}`, {
                method: "DELETE",
                keepalive: true,
            });

            if (res.ok) {
                alert("Kasutaja edukalt kustutatud!");
                router.push("/admin/users");
                router.refresh();
            } else {
                alert("Kustutamine ebaõnnestus.");
            }
        } catch (error) {
            console.error("Viga kustutamisel:", error);
            alert("Süsteemne viga kustutamisel.");
        } finally {
            setLoading(false);
        }
    };

    // PUT users/{id}
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const updatedUser = {
            ...user,
            firstName,
            lastName,
            email,
            password,
            role: {
                ...user.role,
                id: roleId
            },
            organization: {
                ...user.organization,
                id: organizationId
            }
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/users/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser),
            });

            if (res.ok) {
                alert("Andmed edukalt uuendatud!");
                router.refresh();
            } else {
                alert("Uuendamine ebaõnnestus.");
            }
        } catch (error) {
            console.error("Viga uuendamisel:", error);
            alert("Süsteemne viga andmete salvestamisel.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "between", alignItems: "center" }}>
                <h1>Muuda kasutaja andmeid (ID: {user.id})</h1>
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading}
                    style={{
                        padding: "8px 15px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    Kustuta kasutaja
                </button>
            </div>

            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Eesnimi</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Perekonnanimi</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ marginBottom: "5px", fontWeight: "bold" }}>E-mail</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Parool</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Isikukood</label>
                    <input
                        type="text"
                        defaultValue={user.personalCode}
                        disabled
                        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #eee", backgroundColor: "#f9f9f9" }}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Roll</label>
                    <select
                        value={roleId}
                        onChange={(e) => setRoleId(Number(e.target.value))}
                        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    >
                        <option value={1}>Õpetaja (TEACHER)</option>
                        <option value={2}>Kultuuriasutus (CULTURAL_INSTITUTION)</option>
                        <option value={3}>Admin (ADMIN)</option>
                    </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Organisatsioon</label>

                    <select
                        name="organizationId"
                        value={organizationId}
                        onChange={(e) => setOrganizationId(Number(e.target.value))}
                        required
                    >
                        <option value="">
                            Vali organisatsioon
                        </option>

                        {organizations.map((organization) => (
                            <option
                                key={organization.id}
                                value={organization.id}
                            >
                                {organization.name}
                            </option>
                        ))}
                    </select>
                </div>



                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: "10px",
                        backgroundColor: loading ? "#6c757d" : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontWeight: "bold",
                        marginTop: "10px"
                    }}
                >
                    {loading ? "Salvestab..." : "Salvesta muudatused"}
                </button>
            </form>
        </div>
    );
}