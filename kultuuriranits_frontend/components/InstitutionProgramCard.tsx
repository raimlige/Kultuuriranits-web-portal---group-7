"use client";

import Link from "next/link";
import {
    MapPin,
    Clock,
    Users,
    Globe,
    Pencil,
    Eye,
    EyeOff,
    Trash2,
} from "lucide-react";

export type Category = {
    id: number;
    name: string;
};

export type Organization = {
    id: number;
    name: string;
    address?: string;
    city?: string;
    state?: string;
    type?: string;
    phone?: string;
    email?: string;
};

export type InstitutionProgram = {
    id: number;
    title: string;
    description: string;
    shortDescription: string;
    pricePerStudent: number;
    durationMinutes: number;
    targetGroups: string[];
    minGroupSize: number;
    maxGroupSize: number;
    location: string;
    county: string;
    languages: string[];
    status: string;
    createdAt?: string;
    updatedAt?: string;
    imageName: string | null;
    imageType: string | null;
    category: Category | null;
    organization?: Organization | null;
};

type InstitutionProgramCardProps = {
    program: InstitutionProgram;
    apiUrl: string;
    onDelete: (id: number, title: string) => void;
    onToggleVisibility: (program: InstitutionProgram) => void;
};

export function InstitutionProgramCard({
    program,
    apiUrl,
    onDelete,
    onToggleVisibility,
}: InstitutionProgramCardProps) {
    const isPublished =
        program.status?.toLowerCase() === "active" ||
        program.status?.toLowerCase() === "published" ||
        program.status?.toLowerCase() === "avalikustatud";

    const infoItems = [
        {
            label: "Asukoht",
            value: program.location && program.county
          ? `${program.location}, ${program.county}`
          : "Pole täpsustatud",
            icon: MapPin,
        },
        {
            label: "Kestus",
            value: program.durationMinutes
                ? `${program.durationMinutes} min`
                : "Pole täpsustatud",
            icon: Clock,
        },
        {
            label: "Grupi suurus",
            value:
                program.minGroupSize && program.maxGroupSize
                    ? `${program.minGroupSize} - ${program.maxGroupSize} õpilast`
                    : "Pole täpsustatud",
            icon: Users,
        },
        {
            label: "Keel",
            value: program.languages?.length
                ? program.languages.join(", ")
                : "Pole täpsustatud",
            icon: Globe,
        },
    ];

    return (
        <div className="relative bg-white border-2 border-black rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 ease-out overflow-hidden flex flex-col md:flex-row min-h-[280px]">
            <div className="w-full md:w-[300px] lg:w-[330px] shrink-0 bg-gray-50 flex items-center justify-center">
                {program.imageName ? (
                    <img
                        src={`${apiUrl}/program/${program.id}/image`}
                        alt={program.title}
                        className="w-full h-64 md:h-full object-contain p-4"
                    />
                ) : (
                    <div className="w-full h-64 md:h-full flex items-center justify-center text-gray-400 text-sm font-bold">
                        Pilt puudub
                    </div>
                )}
            </div>

            <div className="flex-1 p-6 md:p-7 lg:p-8 flex flex-col justify-between">
                <div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${isPublished
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {isPublished ? "Avalikustatud" : "Mitteavalik"}
                            </span>

                            {program.category && (
                                <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider">
                                    {program.category.name ?? `Kategooria ${program.category.id}`}
                                </span>
                            )}
                        </div>

                        <span className="hidden sm:inline-flex bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-extrabold whitespace-nowrap">
                            {program.pricePerStudent}€ / õpilane
                        </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-3">
                        {program.title}
                    </h2>

                    <p className="text-gray-600 text-base leading-relaxed mb-6 line-clamp-2 max-w-3xl">
                        {program.shortDescription || "Kirjeldus puudub."}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-6 auto-rows-fr">
                        {infoItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.label}
                                    className="h-full min-h-[112px] bg-blue-50 border border-blue-100 rounded-2xl px-4 py-4 shadow-sm flex flex-col"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-9 h-9 rounded-xl bg-white border border-blue-100 shadow-sm flex items-center justify-center shrink-0">
                                            <Icon className="w-4 h-4 text-blue-600" />
                                        </div>

                                        <p className="text-[11px] font-black text-blue-600 uppercase tracking-wide leading-tight">
                                            {item.label}
                                        </p>
                                    </div>

                                    <p className="text-sm font-black text-gray-950 leading-snug break-words mt-auto">
                                        {item.value}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        {program.targetGroups && 
                            program.targetGroups?.map((group) => (
                            <span
                                key={group}
                                className="border border-blue-100 bg-white text-gray-700 px-3 py-1 rounded-md text-xs font-bold"
                            >
                                {group}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={`/programs/${program.id}/edit`}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
                        >
                            <Pencil className="w-4 h-4" />
                            Muuda
                        </Link>

                        <button
                            type="button"
                            onClick={() => onToggleVisibility(program)}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                        >
                            {isPublished ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                            {isPublished ? "Muuda mitteavalikuks" : "Muuda avalikuks"}
                        </button>

                        <button
                            type="button"
                            onClick={() => onDelete(program.id, program.title)}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4" />
                            Kustuta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}