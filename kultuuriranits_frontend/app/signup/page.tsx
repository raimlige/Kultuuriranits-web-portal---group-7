"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    AlertCircle,
    ArrowRight,
    Building2,
    CheckCircle2,
    Eye,
    EyeOff,
    GraduationCap,
    IdCard,
    Loader2,
    LockKeyhole,
    Mail,
    ShieldCheck,
    User,
    UserPlus,
} from "lucide-react";
import { Person } from "../../models/Person";
import { Organization } from "../../models/Organization";
import { LoginInfoCarousel } from "@/components/LoginInfoCarousel";

const API_URL = process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:5050";

export default function RegisterPage() {
    const router = useRouter();

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [selectedOrgId, setSelectedOrgId] = useState<string>("");
    const [selectedRoleId, setSelectedRoleId] = useState<number>(1);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<Person>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        personalCode: "",
    });

    useEffect(() => {
        async function fetchOrganizations() {
            try {
                const res = await fetch(`${API_URL}/organization`, {
                    cache: "no-store",
                });

                if (res.ok) {
                    const data = await res.json();
                    setOrganizations(data);
                }
            } catch (err) {
                console.error("Organisatsioonide laadimine ebaõnnestus", err);
            }
        }

        fetchOrganizations();
    }, []);

    const filteredOrganizations = organizations.filter((org) => {
        if (selectedRoleId === 1) {
            return org.type === "kooliasutus";
        }

        if (selectedRoleId === 2) {
            return org.type === "kultuuriasutus";
        }

        return false;
    });

    const handleRoleChange = (roleId: number) => {
        setSelectedRoleId(roleId);
        setSelectedOrgId("");
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const getRoleName = () => {
        if (selectedRoleId === 3) return "ADMIN";
        if (selectedRoleId === 2) return "CULTURAL_INSTITUTION";
        return "TEACHER";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (success) return;

        setError(null);
        setLoading(true);

        if (selectedRoleId !== 3 && !selectedOrgId) {
            setError("Palun vali nimekirjast oma organisatsioon!");
            setLoading(false);
            return;
        }

        const payload = {
            ...formData,
            email: formData.email?.trim(),
            role: {
                id: selectedRoleId,
                name: getRoleName(),
            },
            ...(selectedRoleId !== 3 && {
                organization: {
                    id: Number(selectedOrgId),
                },
            }),
        };

        try {
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
                router.push("/");
                router.refresh();
            }, 3500);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Midagi läks valesti...");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
            {success && (
                <div className="fixed top-24 right-6 z-[100] w-[calc(100%-2rem)] max-w-xs animate-toast-in">
                    <div className="rounded-2xl border border-green-200 bg-white px-4 py-3 shadow-[0_10px_25px_rgba(16,24,40,0.08)]">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 border border-green-200">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-base font-black text-gray-900 leading-tight">
                                    Kasutaja loodud!
                                </p>

                                <p className="mt-0.5 text-sm font-medium text-gray-500 leading-snug">
                                    Suuname sind avalehele...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    <div className="hidden lg:block lg:mt-12">
                        <h1 className="text-4xl xl:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                            Loo konto ja alusta Kultuuriranitsa kasutamist
                        </h1>

                        <LoginInfoCarousel />
                    </div>

                    <div className="w-full max-w-xl mx-auto lg:ml-auto">
                        <div className="rounded-[2rem] bg-white border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-br from-blue-600 to-blue-800 px-8 py-8 text-white">
                                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
                                    <UserPlus className="w-7 h-7" />
                                </div>

                                <h2 className="text-3xl font-black tracking-tight">
                                    Loo uus konto
                                </h2>

                                <p className="mt-2 text-sm text-blue-100 leading-relaxed">
                                    Täida andmed ja vali oma konto tüüp.
                                </p>
                            </div>

                            <div className="p-8">
                                {error && (
                                    <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />

                                        <p className="text-sm font-semibold text-red-700">
                                            {error}
                                        </p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label 
                                                htmlFor="first-name-input"
                                                className="block text-sm font-extrabold text-gray-700 mb-2 cursor-pointer"
                                            >
                                                Eesnimi
                                            </label>

                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                                                <input
                                                    id="first-name-input"
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    required
                                                    autoComplete="given-name"
                                                    placeholder="Eesnimi"
                                                    className="w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 py-3.5 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label 
                                                htmlFor="last-name-input"
                                                className="block text-sm font-extrabold text-gray-700 mb-2 cursor-pointer"
                                            >
                                                Perekonnanimi
                                            </label>

                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                                                <input
                                                    id="last-name-input"
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    required
                                                    autoComplete="family-name"
                                                    placeholder="Perekonnanimi"
                                                    className="w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 py-3.5 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label 
                                            htmlFor="email-input"
                                            className="block text-sm font-extrabold text-gray-700 mb-2 cursor-pointer"
                                        >
                                            E-mail
                                        </label>

                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                                            <input
                                                id="email-input"
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                autoComplete="email"
                                                placeholder="nimi@email.ee"
                                                className="w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 py-3.5 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label 
                                            htmlFor="password-input"
                                            className="block text-sm font-extrabold text-gray-700 mb-2 cursor-pointer"
                                        >
                                            Parool
                                        </label>

                                        <div className="relative">
                                            <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                                            <input
                                                id="password-input"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                autoComplete="new-password"
                                                placeholder="Sisesta parool"
                                                className="w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-12 py-3.5 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={showPassword ? "Peida parool" : "Näita parooli"}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label 
                                            htmlFor="personal-code-input"
                                            className="block text-sm font-extrabold text-gray-700 mb-2 cursor-pointer"
                                        >
                                            Isikukood
                                        </label>

                                        <div className="relative">
                                            <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                                            <input
                                                id="personal-code-input"
                                                type="text"
                                                name="personalCode"
                                                value={formData.personalCode}
                                                onChange={handleChange}
                                                required
                                                placeholder="Isikukood"
                                                className="w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 py-3.5 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                            />
                                        </div>
                                    </div>

                                    <div className={`grid grid-cols-1 ${selectedRoleId === 3 ? "" : "sm:grid-cols-2"} gap-4`}>
                                        <div>
                                            <label 
                                                htmlFor="role-select"
                                                className="block text-sm font-extrabold text-gray-700 mb-2 cursor-pointer"
                                            >
                                                Konto tüüp
                                            </label>

                                            <div className="relative">
                                                {selectedRoleId === 1 ? (
                                                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                                ) : selectedRoleId === 2 ? (
                                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                                ) : (
                                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                                )}

                                                <select
                                                    id="role-select"
                                                    value={selectedRoleId}
                                                    onChange={(e) => handleRoleChange(Number(e.target.value))}
                                                    className="w-full appearance-none cursor-pointer rounded-2xl border border-gray-200 bg-white pl-12 pr-10 py-3.5 text-gray-900 outline-none transition-all hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                                >
                                                    <option value={1}>Õpetaja</option>
                                                    <option value={2}>Kultuuriasutus</option>
                                                    <option value={3}>Admin</option>
                                                </select>

                                                <svg
                                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>

                                        {selectedRoleId !== 3 && (
                                            <div>
                                                <label 
                                                    htmlFor="org-select"
                                                    className="block text-sm font-extrabold text-gray-700 mb-2 cursor-pointer"
                                                >
                                                    {selectedRoleId === 1 ? "Kooliasutus" : "Kultuuriasutus"}
                                                </label>

                                                <div className="relative">
                                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />

                                                    <select
                                                        id="org-select"
                                                        value={selectedOrgId}
                                                        onChange={(e) => setSelectedOrgId(e.target.value)}
                                                        required={selectedRoleId !== 3}
                                                        className="w-full appearance-none cursor-pointer rounded-2xl border border-gray-200 bg-white pl-12 pr-10 py-3.5 text-gray-900 outline-none transition-all hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                                    >
                                                        <option value="">Vali asutus</option>

                                                        {filteredOrganizations.map((org) => (
                                                            <option key={org.id} value={org.id}>
                                                                {org.name}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <svg
                                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || success}
                                        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-white font-extrabold shadow-md transition-all cursor-pointer hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none active:scale-[0.99]"
                                    >
                                        {success ? (
                                            <>
                                                <CheckCircle2 className="w-5 h-5" />
                                                Konto loodud
                                            </>
                                        ) : loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Palun oota...
                                            </>
                                        ) : (
                                            <>
                                                Registreeru
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-7 rounded-2xl bg-gray-50 border border-gray-100 p-5">
                                    <div className="flex items-start gap-3">
                                        <LockKeyhole className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />

                                        <div>
                                            <p className="text-sm font-black text-gray-900">
                                                Konto on juba olemas?
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                                                Logi sisse, et jätkata Kultuuriranitsa kasutamist.
                                            </p>

                                            <Link
                                                href="/login"
                                                className="mt-3 inline-flex items-center gap-2 text-sm font-extrabold text-blue-700 hover:text-blue-900 underline"
                                            >
                                                Logi sisse
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="mt-6 text-center text-sm text-gray-500">
                            Ei leia oma organisatsiooni? Võta ühendust administraatoriga.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}