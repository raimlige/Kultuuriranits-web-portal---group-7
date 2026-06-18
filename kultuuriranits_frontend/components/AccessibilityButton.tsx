"use client";

import { useEffect, useState } from "react";
import { PersonStanding, Check, ExternalLink, X } from "lucide-react";

type ContrastMode = "default" | "high-contrast";

export function AccessibilityButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [contrastMode, setContrastMode] = useState<ContrastMode>("default");

    useEffect(() => {
        const savedMode = localStorage.getItem("accessibility-contrast-mode");

        if (savedMode === "high-contrast") {
            setContrastMode("high-contrast");
            document.documentElement.classList.add("accessibility-high-contrast");
        }
    }, []);

    const openPanel = () => {
        setIsClosing(false);
        setIsOpen(true);
    };

    const closePanel = () => {
        setIsClosing(true);

        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 180);
    };

    const changeContrastMode = (mode: ContrastMode) => {
        setContrastMode(mode);
        localStorage.setItem("accessibility-contrast-mode", mode);

        if (mode === "high-contrast") {
            document.documentElement.classList.add("accessibility-high-contrast");
        } else {
            document.documentElement.classList.remove("accessibility-high-contrast");
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={openPanel}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 text-xs font-bold text-gray-700 shadow-sm hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all cursor-pointer"
            >
                <PersonStanding className="w-4 h-4 text-blue-600" />
                Juurdepääsetavus
            </button>

            {isOpen && (
                <>
                    <div
                        onClick={closePanel}
                        className={`fixed inset-0 z-[90] bg-black/45 backdrop-blur-[3px] ${isClosing ? "accessibility-overlay-out" : "accessibility-overlay-in"
                            }`}
                    />

                    <aside
                        className={`fixed right-0 top-0 z-[100] h-screen w-full max-w-[460px] bg-white border-l border-gray-200 shadow-2xl flex flex-col ${isClosing ? "accessibility-panel-out" : "accessibility-panel-in"
                            }`}
                    >
                        <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <PersonStanding className="w-6 h-6 text-blue-600" />

                                <h2 className="text-xl font-black text-gray-900">
                                    Juurdepääsetavus
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={closePanel}
                                aria-label="Sulge juurdepääsetavuse paneel"
                                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-5 mb-7">
                                <p className="text-sm leading-relaxed text-gray-700">
                                    Lehe loomisel on peetud silmas, et siin avaldatav info oleks
                                    kättesaadav ja kasutatav võimalikult paljudele inimestele.
                                </p>

                                <a
                                    href="/accessibility"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-blue-700 underline"
                                >
                                    Rohkem infot juurdepääsetavuse kohta on leitav siit
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>

                            <section className="mb-7">
                                <h3 className="text-sm font-black uppercase tracking-wider text-gray-400 mb-3">
                                    Kontrast
                                </h3>

                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={() => changeContrastMode("default")}
                                        className={`w-full rounded-2xl border px-4 py-4 text-left transition-all cursor-pointer ${contrastMode === "default"
                                            ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/20"
                                            : "border-gray-200 bg-white hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${contrastMode === "default"
                                                        ? "border-blue-600 bg-blue-600 text-white"
                                                        : "border-gray-300"
                                                        }`}
                                                >
                                                    {contrastMode === "default" && (
                                                        <Check className="w-3.5 h-3.5" />
                                                    )}
                                                </span>

                                                <div>
                                                    <p className="text-sm font-black text-gray-900">
                                                        Vaikimisi seaded
                                                    </p>

                                                    <p className="text-sm text-gray-500">
                                                        Tavaline kujundus ja värvid
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-bold text-gray-700">
                                                Aa
                                            </span>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => changeContrastMode("high-contrast")}
                                        className={`w-full rounded-2xl border px-4 py-4 text-left transition-all cursor-pointer ${contrastMode === "high-contrast"
                                            ? "border-yellow-400 bg-black ring-2 ring-yellow-400/40"
                                            : "border-gray-200 bg-white hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${contrastMode === "high-contrast"
                                                        ? "border-yellow-400 bg-yellow-400 text-black"
                                                        : "border-gray-300"
                                                        }`}
                                                >
                                                    {contrastMode === "high-contrast" && (
                                                        <Check className="w-3.5 h-3.5" />
                                                    )}
                                                </span>

                                                <div>
                                                    <p
                                                        className={`text-sm font-black ${contrastMode === "high-contrast"
                                                            ? "text-yellow-300"
                                                            : "text-gray-900"
                                                            }`}
                                                    >
                                                        Must ja kollane tekst
                                                    </p>

                                                    <p
                                                        className={`text-sm ${contrastMode === "high-contrast"
                                                            ? "text-yellow-200"
                                                            : "text-gray-500"
                                                            }`}
                                                    >
                                                        Kõrgkontrastne vaade vaegnägijatele
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                className={`rounded-md border px-2 py-1 text-xs font-black ${contrastMode === "high-contrast"
                                                    ? "border-yellow-400 bg-yellow-400 text-black"
                                                    : "border-yellow-400 bg-black text-yellow-300"
                                                    }`}
                                            >
                                                Aa
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-black uppercase tracking-wider text-gray-400 mb-3">
                                    Teksti suurus
                                </h3>

                                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-5 py-5">
                                    <p className="text-sm leading-relaxed text-gray-600">
                                        Kõikides populaarsetes veebilehitsejates on võimalik lehte
                                        suurendada ja vähendada, kui hoida all{" "}
                                        <kbd className="rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-xs font-bold">
                                            Ctrl
                                        </kbd>{" "}
                                        klahvi ning vajutada samal ajal{" "}
                                        <kbd className="rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-xs font-bold">
                                            +
                                        </kbd>{" "}
                                        või{" "}
                                        <kbd className="rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-xs font-bold">
                                            -
                                        </kbd>{" "}
                                        klahvi.
                                    </p>

                                    <p className="mt-4 text-sm leading-relaxed text-gray-600">
                                        Normaalsuurusesse saab tagasi, kui vajutada korraga{" "}
                                        <kbd className="rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-xs font-bold">
                                            Ctrl
                                        </kbd>{" "}
                                        ja{" "}
                                        <kbd className="rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-xs font-bold">
                                            0
                                        </kbd>
                                        .
                                    </p>
                                </div>
                            </section>
                        </div>

                        <div className="border-t border-gray-100 px-6 py-4 text-center">
                            <p className="text-xs font-semibold text-gray-400">
                                Vastab EN 301 549 juurdepääsetavuse suunistele
                            </p>
                        </div>
                    </aside>
                </>
            )}
        </>
    );
}