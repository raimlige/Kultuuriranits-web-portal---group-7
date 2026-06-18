"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Person } from "../models/Person";

interface PasswordEditFormProps {
    user: Person;
}

export default function PasswordEditForm({ user }: PasswordEditFormProps) {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e: React.FormEvent) => {
        if (!confirm(`Kas oled kindel, et soovid parooli muuta?`)) {
            return;
        }
        e.preventDefault();
        setLoading(true);

        const updatedUser = {
            ...user,
            password: password
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(updatedUser),
            });

            if (res.ok) {
                alert("Andmed edukalt uuendatud!");
                setPassword("");
                router.push("/account");
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

    const inputClass =
        "w-full px-4 py-3 rounded-md bg-blue-900 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400";
    const labelClass = "block text-sm font-medium text-gray-700 mb-2";

    return (
        <main className="max-w-4xl mx-auto px-6 py-12">

            <h1 className="text-center text-5xl font-bold mb-16">Parooli muutmine</h1>

            <form onSubmit={handleUpdate}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label className={labelClass} style={{ fontWeight: "bold" }}>Parool</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Kirjuta siia uus parool..."
                            className={inputClass}
                            style={{ padding: "12px" }}
                        />
                    </div>

                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                    {loading ? "Salvestab..." : "Kinnita muudatused"}
                </button>

            </form>

        </main>
    );
}