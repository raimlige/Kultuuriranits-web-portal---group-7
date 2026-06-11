"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Person } from "../../models/Person";
import { Organization } from "../../models/Organization";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [selectedOrgId, setSelectedOrgId] = useState<string>("");

    const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

    const [formData, setFormData] = useState<Person>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        personalCode: "",
    });

    const [selectedRoleId, setSelectedRoleId] = useState<number>(1);

    // GET organization
    useEffect(() => {
        async function fetchOrganizations() {
            try {
                const res = await fetch(`${API_URL}/organization`);
                if (res.ok) {
                    const data = await res.json();
                    setOrganizations(data);
                }
            } catch (err) {
                console.error("Organisatsioonide laadimine ebaõnnestus", err);
            }
        }
        fetchOrganizations();
    }, [API_URL]);

    const filteredOrganizations = organizations.filter((org) => {
        if (selectedRoleId === 1) {
            return org.type === "kooliasutus";
        } else if (selectedRoleId === 2) {
            return org.type === "kultuuriasutus";
        } else if (selectedRoleId === null) {
            return true;
        }
        return false;
    });

    const handleRoleChange = (roleId: number) => {
        setSelectedRoleId(roleId);
        setSelectedOrgId("");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!selectedOrgId) {
            setError("Palun vali nimekirjast oma organisatsioon!");
            return;
        }

        const payload = {
            ...formData,
            role: {
                id: selectedRoleId,
                name: selectedRoleId === 2 ? "CULTURAL_INSTITUTION" : "TEACHER"
            },
            organization: {
                id: Number(selectedOrgId)
            }
        };

        try {
            const API_URL = process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:5050";

            const res = await fetch(`${API_URL}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
                credentials: "include",
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Registreerumine ebaõnnestus.");
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 2000);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Midagi läks valesti...");
            }
        }
    };

    if (success) {
        return (
            <div style={{ maxWidth: "400px", margin: "100px auto", textAlign: "center", color: "green" }}>
                <h2>Kasutaja loodud!</h2>
                <p>Suuname sind sisselogimise lehele...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h2 style={{ marginBottom: "20px" }}>Loo uus konto</h2>

            {error && <p style={{ color: "red", backgroundColor: "#ffebee", padding: "10px", borderRadius: "4px" }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

                <div>
                    <label style={{ display: "block", marginBottom: "5px" }}>Eesnimi</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "5px" }}>Perekonnanimi</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "5px" }}>E-mail</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "5px" }}>Parool</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "5px" }}>Isikukood</label>
                    <input type="text" name="personalCode" value={formData.personalCode} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "5px" }}>Konto tüüp</label>
                    <select value={selectedRoleId} onChange={(e) => setSelectedRoleId(Number(e.target.value))} style={{ width: "100%", padding: "8px" }}>
                        <option value={1}>Õpetaja (TEACHER)</option>
                        <option value={2}>Kultuuriasutus (CULTURAL_INSTITUTION)</option>
                        <option value={3}>Admin (ADMIN)</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                        {selectedRoleId === 1 ? "Vali Kooliasutus" : "Vali Kultuuriasutus"}
                    </label>
                    <select
                        value={selectedOrgId}
                        onChange={(e) => setSelectedOrgId(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    >
                        <option value="">-- Vali asutus --</option>
                        {filteredOrganizations.map((org) => (
                            <option key={org.id} value={org.id}>
                                {org.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" style={{ padding: "10px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "10px" }}>
                    Registreeru
                </button>
            </form>
        </div>
    );
}