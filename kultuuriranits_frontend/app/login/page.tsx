"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  UserPlus,
} from "lucide-react";
import { LoginInfoCarousel } from "@/components/LoginInfoCarousel";

const API_URL = process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:5050";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email.trim(), password }),
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Vale e-maili aadress või parool.");
            }

            const userData = await res.json();
            const role = userData.role?.name;

            switch (role) {
                case "ADMIN":
                    router.push("/admin");
                    break;
                case "TEACHER":
                    router.push("/");
                    break;
                case "CULTURAL_INSTITUTION":
                    router.push("/");
                    break;
                default:
                    router.push("/programs");
            }

            router.refresh();

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Midagi läks sisselogimisel valesti.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <div className="hidden lg:block">

                        <h1 className="text-4xl xl:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                            Logi sisse ja jätka Kultuuriranitsa kasutamist
                        </h1>

                        <LoginInfoCarousel />
                    </div>

                    <div className="w-full max-w-md mx-auto lg:ml-auto">
                        <div className="rounded-[2rem] bg-white border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-br from-blue-600 to-blue-800 px-8 py-8 text-white">
                                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
                                    <LockKeyhole className="w-7 h-7" />
                                </div>

                                <h2 className="text-3xl font-black tracking-tight">
                                    Logi sisse
                                </h2>

                                <p className="mt-2 text-sm text-blue-100 leading-relaxed">
                                    Sisesta oma e-mail ja parool, et jätkata.
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
                                    <div>
                                        <label className="block text-sm font-extrabold text-gray-700 mb-2">
                                            E-mail
                                        </label>

                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                placeholder="nimi@email.ee"
                                                className="w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 py-3.5 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-extrabold text-gray-700 mb-2">
                                            Parool
                                        </label>

                                        <div className="relative">
                                            <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                placeholder="Sisesta parool"
                                                className="w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-12 py-3.5 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={
                                                    showPassword ? "Peida parool" : "Näita parooli"
                                                }
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

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-white font-extrabold shadow-md transition-all cursor-pointer hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none active:scale-[0.99]"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Palun oota...
                                            </>
                                        ) : (
                                            <>
                                                Logi sisse
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-7 rounded-2xl bg-gray-50 border border-gray-100 p-5">
                                    <div className="flex items-start gap-3">
                                        <UserPlus className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />

                                        <div>
                                            <p className="text-sm font-black text-gray-900">
                                                Pole veel kontot?
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                                                Loo konto, et kasutada Kultuuriranitsa võimalusi.
                                            </p>

                                            <Link
                                                href="/signup"
                                                className="mt-3 inline-flex items-center gap-2 text-sm font-extrabold text-blue-700 hover:text-blue-900 underline"
                                            >
                                                Mine registreerima
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="mt-6 text-center text-sm text-gray-500">
                            Probleem sisselogimisega? Võta ühendust administraatoriga.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}