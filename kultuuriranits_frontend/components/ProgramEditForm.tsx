"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Program } from "@/models/Program";
import { Category } from "@/models/Category";
import {
    Trash,
    PlusCircle,
    FileText,
    ChevronDown
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_BACK_URL;
interface Props {
    program: Program;
    categories: Category[];
}

const ESTONIAN_COUNTIES = [
    'Harjumaa', 'Tartumaa', 'Pärnumaa', 'Viljandimaa', 'Lääne-Virumaa',
    'Ida-Virumaa', 'Saaremaa', 'Hiiumaa', 'Raplamaa', 'Järvamaa',
    'Jõgevamaa', 'Põlvamaa', 'Valgamaa', 'Võrumaa', 'Läänemaa'
];

const CURRICULUM_PRESETS = [
    'Ajalugu', 'Ühiskonnaõpetus', 'Kultuuriteadlikkus', 'Kunst',
    'Muusika', 'Tehnoloogia', 'Bioloogia', 'Loodusõpetus', 'Emakeel'
];

export function ProgramEditForm({ program, categories }: Props) {
    const router = useRouter();

    const [title, setTitle] = useState(program.title ?? "");
    const [description, setDescription] = useState(program.description ?? "");
    const [shortDescription, setShortDescription] = useState(program.shortDescription ?? "");
    const [connection, setConnection] = useState(program.connection ?? "");
    const [connectionKeys, setConnectionKeys] = useState(program.connectionKeys ?? []);
    const [price, setPrice] = useState(program.pricePerStudent?.toString() ?? "0");
    const [duration, setDuration] = useState(program.durationMinutes?.toString() ?? "0");
    const [targetGroups, setTargetGroups] = useState(program.targetGroups ?? []);
    const [languages, setLanguages] = useState(program.languages ?? ["Eesti"]);
    const [minGroupSize, setMinGroupSize] = useState(program.minGroupSize?.toString() ?? "1");
    const [maxGroupSize, setMaxGroupSize] = useState(program.maxGroupSize?.toString() ?? "25");
    const [location, setLocation] = useState(program.location ?? "");
    const [status, setStatus] = useState(program.status ?? "INACTIVE");
    const [wheelchair, setWheelchair] = useState<boolean>(program?.wheelchair ?? false);
    const [outdoor, setOutdoor] = useState<boolean>(program?.outdoor ?? false);
    const [hev, setHEV] = useState<boolean>(program?.hev ?? false);
    const [lak, setLAK] = useState<boolean>(program?.lak ?? false);
    const [addInfo, setAddInfo] = useState(program.addInfo ?? "");
    const [contactEmail, setContactEmail] = useState(program.contactEmail ?? "");
    const [contactPhone, setContactPhone] = useState(program.contactPhone ?? "");
    const [address, setAddress] = useState(program.address ?? "");
    const [county, setCounty] = useState(program.county ?? "");
    const [categoryId, setCategoryId] = useState(program.category?.id?.toString() ?? "");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Materjalide haldus
    const [existingMaterials, setExistingMaterials] = useState(program.materials ?? []);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [materialFile, setMaterialFile] = useState<File | null>(null);
    const [materialName, setMaterialName] = useState("");
    const [materials, setMaterials] = useState<{ file: File; name: string; title: string }[]>([]);

    const handleEditMaterial = (index: number) => {
        const material = materials[index];

        setMaterialName(material.title);
        setMaterialFile(material.file);
        setEditingIndex(index);
    };

    const handleSaveMaterial = () => {
        if (!materialFile) return;

        const material = {
            file: materialFile,
            title: materialName || materialFile.name,
            name: materialFile.name,
        };

        if (editingIndex !== null) {
            setMaterials(prev =>
                prev.map((m, i) =>
                    i === editingIndex ? material : m
                )
            );
        } else {
            setMaterials(prev => [...prev, material]);
        }

        setMaterialFile(null);
        setMaterialName("");
        setEditingIndex(null);
    };

    const handleRemoveNewMaterial = (index: number) => {
        setMaterials(materials.filter((_, i) => i !== index));
    };
    const handleRemoveExistingMaterial = (id: number) => {
        setExistingMaterials(existingMaterials.filter(mat => mat.id !== id));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const formData = new FormData();

            const programData = {
                id: program.id,
                title: title,
                description: description,
                shortDescription: shortDescription,
                connection: connection,
                connectionKeys: connectionKeys,
                pricePerStudent: parseFloat(price),
                durationMinutes: parseInt(duration),
                //targetGroup: targetGroup,
                targetGroups: targetGroups,
                //language: language,
                languages: languages,
                minGroupSize: parseInt(minGroupSize),
                maxGroupSize: parseInt(maxGroupSize),
                location: location,

                status: status,
                wheelchair: wheelchair,
                outdoor: outdoor,
                hev: hev,
                lak: lak,

                addInfo: addInfo,
                contactEmail: contactEmail,
                contactPhone: contactPhone,
                address: address,
                county: county,
                category: categoryId ? { id: parseInt(categoryId) } : null,
                materialIds: existingMaterials.map(m => m.id),
                materials: existingMaterials
            };

            formData.append(
                "program",
                new Blob([JSON.stringify(programData)], { type: "application/json" })
            );

            if (imageFile) {
                formData.append("imageFile", imageFile);
            } else {
                formData.append("imageFile", new Blob([], { type: "application/octet-stream" }));
            }

            if (materials && materials.length > 0) {
                materials.forEach((m, i) => {
                    if (!m?.file) return;

                    console.log("Material sent:", i, m.file.name, m.title);
                    formData.append("materialFiles", m.file);
                    formData.append("materialTitles", m.title);
                });
            }

            const res = await fetch(`${API_URL}/program/${program.id}`, {
                method: "PUT",
                body: formData,
                credentials: "include"
            });

            if (res.ok) {
                setMessage("Programm edukalt uuendatud!");
                router.refresh();
                setTimeout(() => router.push("/cultural_institution"), 1500);
            } else {
                const errorText = await res.text();
                setMessage(`Viga: ${errorText || "Uuendamine ebaõnnestus"}`);
            }
        } catch (error) {
            console.error(error);
            setMessage("Võrguviga bäkendiga ühendumisel.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                {/* Modern Frameless Larger Single-Column Sequential Layout */}
                <div className="max-w-6xl mx-auto space-y-12">

                    <div className="space-y-6">
                        <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                            Programmi põhiinfo
                        </h3>

                        {/* Program Title */}
                        <div className="space-y-2">
                            <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">Kultuuriprogrammi nimetus *</label>
                            <input
                                type="text"
                                required
                                placeholder="nt. Ajarännak minevikku"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-850 shadow-xs"
                            />
                        </div>

                        {/* Short Description */}
                        <div className="space-y-2">
                            <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">Kultuuriprogrammi lühikirjeldus (1-2 lauset) *</label>
                            <input
                                type="text"
                                required
                                placeholder="Maksimaalselt 150 tähemärki"
                                value={shortDescription}
                                onChange={(e) => setShortDescription(e.target.value)}
                                className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-855 shadow-xs"
                            />
                        </div>

                        {/* Full Description */}
                        <div className="space-y-2">
                            <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">Kultuuriprogrammi kirjeldus *</label>
                            <textarea
                                required
                                rows={6}
                                placeholder="Kirjelda siin programmi sisu, tegevusi, tulemusi jne..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-855 shadow-xs"
                            ></textarea>
                        </div>

                        {/* Keeled (Language checkboxes) */}
                        <div className="space-y-2.5">
                            <div className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">
                                Keeled *
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-150">
                                {["Eesti", "Inglise", "Vene", "Muu"].map((lang) => (
                                    <div
                                        key={lang}
                                        className="flex items-center gap-3 text-base font-bold text-gray-700 select-none"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={languages.includes(lang)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setLanguages([...languages, lang]);
                                                } else {
                                                    setLanguages(languages.filter(l => l !== lang));
                                                }
                                            }}
                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded accent-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                        {lang}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-8 pt-8"></div>

                    {/* Section 2: Teemad ja sihtgrupp */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                            Teemad ja sihtgrupp
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Kategooriad */}
                            <div className="space-y-2">
                                <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">
                                    Kategooriad *
                                </label>

                                <div className="relative">
                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        className="block w-full pl-4 pr-10 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer h-[54px] appearance-none"
                                    >
                                        <option value="">Lisa teema / kategooria...</option>
                                        {categories?.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>

                                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            {/* Sihtgrupp */}
                            <div className="space-y-2">
                                <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">
                                    Sihtgrupp *
                                </label>

                                <div className="relative">
                                    <select
                                        value=""
                                        onChange={(e) => {
                                            const val = e.target.value;

                                            if (val && !targetGroups.includes(val)) {
                                                setTargetGroups([...targetGroups, val]);
                                            }

                                            e.target.value = "";
                                        }}
                                        className="block w-full pl-4 pr-10 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer h-[54px] appearance-none"
                                    >
                                        <option value="">Lisa sihtgrupp...</option>

                                        {[
                                            "Lasteaed",
                                            "1. - 3. klass",
                                            "4. - 6. klass",
                                            "7. - 9. klass",
                                            "Gümnaasium",
                                        ].map(grp => (
                                            <option
                                                key={grp}
                                                value={grp}
                                                disabled={targetGroups.includes(grp)}
                                            >
                                                {grp}
                                            </option>
                                        ))}
                                    </select>

                                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>

                                <div className="flex flex-wrap gap-2 mt-3 bg-gray-50 p-3 rounded-xl border border-gray-150 min-h-[52px] items-center">
                                    {targetGroups.map(grp => (
                                        <span
                                            key={grp}
                                            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-blue-700 text-sm font-bold px-3 py-1 rounded-lg shadow-xs"
                                        >
                                            {grp}
                                            <button
                                                type="button"
                                                onClick={() => setTargetGroups(targetGroups.filter(g => g !== grp))}
                                                className="text-blue-500 hover:text-blue-700 font-extrabold cursor-pointer text-sm ml-1"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))}

                                    {targetGroups.length === 0 && (
                                        <span className="text-sm text-gray-455 italic">
                                            Ühtegi sihtgruppi pole valitud
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Õppekavaseosed */}
                            <div className="space-y-2">
                                <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">
                                    Õppekavaseosed
                                </label>

                                <div className="relative">
                                    <select
                                        value=""
                                        onChange={(e) => {
                                            const val = e.target.value;

                                            if (val && !connectionKeys.includes(val)) {
                                                setConnectionKeys(prev => [...prev, val]);
                                            }

                                            e.target.value = "";
                                        }}
                                        className="block w-full pl-4 pr-10 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer h-[54px] appearance-none"
                                    >
                                        <option value="">Lisa õppekavaseos...</option>

                                        {CURRICULUM_PRESETS.map(conn => (
                                            <option
                                                key={conn}
                                                value={conn}
                                                disabled={connectionKeys.includes(conn)}
                                            >
                                                {conn}
                                            </option>
                                        ))}
                                    </select>

                                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>

                                <div className="flex flex-wrap gap-2 mt-3 bg-gray-50 p-3 rounded-xl border border-gray-150 min-h-[52px] items-center">
                                    {connectionKeys.map(conn => (
                                        <span
                                            key={conn}
                                            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold px-3 py-1 rounded-lg shadow-xs"
                                        >
                                            {conn}
                                            <button
                                                type="button"
                                                onClick={() => setConnectionKeys(connectionKeys.filter(c => c !== conn))}
                                                className="text-gray-400 hover:text-gray-700 font-extrabold cursor-pointer text-sm ml-1"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))}

                                    {connectionKeys.length === 0 && (
                                        <span className="text-sm text-gray-455 italic">
                                            Õppekavaseoseid pole lisatud
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Õppekavaseose kirjeldus */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">
                                    Õppekavaseose kirjeldus
                                </label>

                                <input
                                    type="text"
                                    placeholder="Õppekavaseose kirjeldus.."
                                    value={connection}
                                    onChange={(e) => setConnection(e.target.value)}
                                    className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-855 shadow-xs"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-8 pt-8"></div>

                    {/* Section 3: Toimumise info */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                            Toimumise info
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {/* Price input */}
                            <div className="space-y-1.5">
                                <label className="text-base font-extrabold text-gray-800 block">Hind õpilase kohta *</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="nt. 10€"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                                />
                            </div>

                            {/* Duration */}
                            <div className="space-y-1.5">
                                <label className="text-base font-extrabold text-gray-800 block">Kestus *</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="nt. 90 min"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                                />
                            </div>

                            {/* Min group size */}
                            <div className="space-y-1.5">
                                <label className="text-base font-extrabold text-gray-800 block">Minimaalne grupp *</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="10"
                                    value={minGroupSize}
                                    onChange={(e) => setMinGroupSize(e.target.value)}
                                    className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                                />
                            </div>

                            {/* Max group size */}
                            <div className="space-y-1.5">
                                <label className="text-base font-extrabold text-gray-800 block">Maksimaalne grupp *</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="30"
                                    value={maxGroupSize}
                                    onChange={(e) => setMaxGroupSize(e.target.value)}
                                    className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {/* County select */}
                            <div className="space-y-1.5">
                                <label className="text-base font-extrabold text-gray-800 block">Maakond *</label>
                                <select
                                    value={county}
                                    onChange={(e) => setCounty(e.target.value)}
                                    className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 cursor-pointer h-[54px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                >
                                    {ESTONIAN_COUNTIES.map(cnt => (
                                        <option key={cnt} value={cnt}>{cnt}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Location name */}
                            <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-base font-extrabold text-gray-800 block">Toimumiskoht *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="nt. Eesti Rahva Muuseum"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-1.5">
                            <label className="text-base font-extrabold text-gray-800 block">Täpne aadress *</label>
                            <input
                                type="text"
                                required
                                placeholder="nt. Muuseumi tee 2, 60532 Tartu"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                            />
                        </div>

                        {/* Accessibility & outdoor checkboxes */}
                        <div className="space-y-2">
                            <div className="text-base font-extrabold text-gray-800 block uppercase tracking-wider">
                                Muu toimumisinfo
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 bg-gray-50 p-5 rounded-xl border border-gray-150 text-base font-bold text-gray-700">
                                {[
                                    {
                                        label: "Ligipääs ratastooliga",
                                        checked: wheelchair,
                                        setter: setWheelchair,
                                    },
                                    {
                                        label: "HEV",
                                        checked: hev,
                                        setter: setHEV,
                                    },
                                    {
                                        label: "LAK",
                                        checked: lak,
                                        setter: setLAK,
                                    },
                                    {
                                        label: "Toimub välitingimustes",
                                        checked: outdoor,
                                        setter: setOutdoor,
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-center gap-3 select-none"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={item.checked}
                                            onChange={(e) => item.setter(e.target.checked)}
                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded accent-blue-600 cursor-pointer"
                                        />

                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-8 pt-8"></div>

                    {/* Section 4: Meedia ja õppematerjalid */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                            Meedia ja õppematerjalid
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Kaanefoto (Image Box Preview) */}
                            <div className="space-y-3">
                                <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">Programmi kaanefoto *</label>
                                <div className="border border-gray-200 bg-gray-50 rounded-2xl overflow-hidden h-48 flex flex-col items-center justify-center relative group shadow-xs">


                                    {imageFile ? (
                                        <Image
                                            src={URL.createObjectURL(imageFile)}
                                            alt="Preview"
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    ) : program.imageName ? (
                                        <Image
                                            src={`${API_URL}/program/${program.id}/image`}
                                            alt={program.title}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            Pilti pole veel valitud
                                        </div>
                                    )}
                                </div>

                                {/* Image upload zone */}
                                <div className="space-y-3 pt-2">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <label className="flex-1 bg-white border border-gray-300 rounded-xl px-5 py-3.5 text-base font-bold text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all cursor-pointer shadow-xs active:scale-98 border-dashed border-2 hover:border-blue-400">
                                            <PlusCircle className="w-5 h-5 text-gray-400" />
                                            Vali fail arvutist
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) {
                                                        setImageFile(e.target.files[0]);
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 4: Meedia ja parandatud ÕPPEMATERJALID */}
                            <div className="space-y-6">
                                {/* Õppematerjalide Uuendamine */}
                                <div className="space-y-3">
                                    <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">Õppematerjalid</label>

                                    <div className="space-y-4">
                                        <div className="border border-gray-200 bg-gray-50 rounded-2xl h-48 p-6 space-y-8 shadow-xs">
                                            <input
                                                type="text"
                                                placeholder="Materjali nimetus (nt. Tööleht)"
                                                value={materialName}
                                                onChange={(e) => setMaterialName(e.target.value)}
                                                className="w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            />

                                            {/* Faili lisamise nupp */}
                                            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-4 bg-white hover:bg-gray-50 cursor-pointer transition">

                                                <span className="text-sm font-bold text-gray-700">{materialFile ?  materialFile.name : "Vali fail (PDF, PNG, JPG, DOCX...)"}</span>
                                                <input
                                                    type="file"
                                                    accept=".pdf, .png, .jpg, .jpeg, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt"
                                                    onChange={(e) => {
                                                        if (e.target.files?.[0]) {
                                                            setMaterialFile(e.target.files[0]);
                                                        }
                                                    }}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                       <button
                                        type="button"
                                        onClick={handleSaveMaterial}
                                        className="bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-xl text-sm font-bold cursor-pointer transition-all shadow-xs active:scale-98 flex items-center justify-center gap-2 w-full"
                                        >
                                            <PlusCircle className="w-5 h-5" />
                                            Lisa õppematerjal nimekirja
                                        </button>

                                        {/* Materjalide nimekiri */}
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                            {/* Osa A: Juba andmebaasis olevad materjalid */}
                                            {existingMaterials.map((mat) => (
                                                <div key={mat.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-3 shadow-2xs">
                                                    <div className="flex items-center gap-2.5 truncate">
                                                        <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-sm font-semibold text-gray-700 truncate">Pealkiri: {mat.title}</span>
                                                            <span className="text-sm font-semibold text-gray-700 truncate">Faili nimi: {mat.name}</span>
                                                        </div>

                                                        <span className="text-2xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">Serveris</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveExistingMaterial(mat.id)}
                                                        className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg transition hover:bg-red-50 cursor-pointer"
                                                        title="Kustuta fail andmebaasist"
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                </div>

                                            ))}


                                            {/* Osa B: Kasutaja poolt uuesti valitud failid */}
                                            {materials.map((mat, index) => (
                                                <div key={index} className="flex items-center justify-between bg-blue-50/40 border border-blue-100 rounded-xl p-3 shadow-2xs">
                                                    <div className="flex items-center gap-2.5 truncate">
                                                        <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-sm font-semibold text-gray-700 truncate">Pealkiri: {mat.title}</span>
                                                            <span className="text-sm font-semibold text-gray-700 truncate">Faili nimi: {mat.name}</span>
                                                        </div>
                                                        <span className="text-2xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">Uus</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveNewMaterial(index)}
                                                        className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg transition hover:bg-red-50 cursor-pointer"
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                </div>

                                            ))}

                                            {existingMaterials.length === 0 && materials.length === 0 && (
                                                <p className="text-sm text-gray-455 text-center py-4 italic">Programmil puuduvad lisatud õppematerjalid.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="space-y-1.5">
                            <label className="text-base font-extrabold text-gray-800 block">Lisainfo</label>
                            <textarea
                                rows={3}
                                placeholder="Täiendav info programmi kohta..."
                                value={addInfo}
                                onChange={(e) => setAddInfo(e.target.value)}
                                className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                            ></textarea>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-8 pt-8"></div>

                    {/* Section 5: Kontaktandmed */}
                    <div className="space-y-4 animate-fade-in">
                        <p className="text-sm font-semibold text-gray-500 leading-relaxed">
                            Täida allolevad kontaktandmed, mille kaudu õpetajad saavad Teiega ühendust võtta.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-base font-extrabold text-gray-800 block">Email *</label>
                                <input
                                    type="email"
                                    placeholder="kultuuri@asutus.ee"
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                    className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-base font-extrabold text-gray-800 block">Telefon *</label>
                                <input
                                    type="text"
                                    placeholder="+372 ..."
                                    value={contactPhone}
                                    onChange={(e) => setContactPhone(e.target.value)}
                                    className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 6: Avalikustamise olek */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-150">
                        <div>
                            <span className="text-base font-extrabold text-gray-800 block uppercase tracking-wider">Avalikustamise olek</span>
                            <span className="text-xs sm:text-sm text-gray-500 font-semibold block mt-0.5">Kas programm on salvestamise järel õpetajatele nähtav?</span>
                        </div>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="bg-white border border-gray-300 rounded-xl px-5 py-3.5 text-base font-extrabold text-gray-800 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 h-[54px]"
                        >
                            <option value="Active">Avalik (nähtav)</option>
                            <option value="Inactive">Mitteavalik (draft)</option>
                        </select>
                    </div>

                    {/* FORM FOOTER BUTTONS */}
                    <div className="flex justify-end gap-3 pt-6 pb-12 mb-8 border-t border-gray-100">
                         <Link 
                            href="/cultural_institution"
                            className="bg-white border border-gray-300 text-gray-700 px-8 py-3.5 rounded-xl text-base font-bold hover:bg-gray-50 transition-all cursor-pointer shadow-xs active:scale-98"
                            >
                            Tühista
                        </Link>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-10 py-3.5 rounded-xl text-base font-bold hover:bg-blue-700 transition-all shadow-xs flex items-center gap-2 cursor-pointer transform active:scale-98"
                        >
                            Salvesta
                            {/* <ArrowRight className="w-5 h-5" /> */}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}