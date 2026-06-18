"use client";

import Link from "next/link";
import {
    AlertTriangle,
    BarChart3,
    BookOpen,
    CheckCircle2,
    CircleOff,
    MessageSquare,
    Star,
    Users,
    Wrench,
} from "lucide-react";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    CartesianGrid,
} from "recharts";

import type { Program } from "@/models/Program";
import type { Person } from "@/models/Person";

export type AdminFeedback = {
    id: number;
    text?: string;
    rating?: number;
    createdAt?: string;
    program?: Program | null;
    person?: Person | null;
};

type AdminDashboardProps = {
    users: Person[];
    programs: Program[];
    feedbacks: AdminFeedback[];
};

const CHART_COLORS = [
    "#2563eb",
    "#16a34a",
    "#f97316",
    "#9333ea",
    "#dc2626",
    "#0891b2",
    "#ca8a04",
];

export function AdminDashboard({
    users,
    programs,
    feedbacks,
}: AdminDashboardProps) {
    const isActiveProgram = (status?: string) => {
        return status?.toLowerCase() === "active";
    };

    const activePrograms = programs.filter((program) =>
        isActiveProgram(program.status)
    );

    const inactivePrograms = programs.filter(
        (program) => !isActiveProgram(program.status)
    );

    const culturalInstitutions = users.filter(
        (user) => user.role?.name?.toLowerCase() === "cultural_institution"
    );

    const teachers = users.filter(
        (user) => user.role?.name?.toLowerCase() === "teacher"
    );

    const admins = users.filter(
        (user) => user.role?.name?.toLowerCase() === "admin"
    );

    const averageRating =
        feedbacks.length > 0
            ? feedbacks.reduce(
                (sum, feedback) => sum + Number(feedback.rating || 0),
                0
            ) / feedbacks.length
            : 0;

    const lowRatedFeedbacks = feedbacks.filter((feedback) => {
        return Number(feedback.rating || 0) <= 2;
    });

    const duplicateEmails = users.filter((user, index, array) => {
        if (!user.email) return false;

        return (
            array.findIndex(
                (otherUser) =>
                    otherUser.email?.toLowerCase() === user.email?.toLowerCase()
            ) !== index
        );
    });

    const activeProgramsWithoutFeedback = activePrograms.filter((program) => {
        return !feedbacks.some((feedback) => feedback.program?.id === program.id);
    });

    const institutionsWithoutActivePrograms = culturalInstitutions.filter(
        (user) => {
            const organizationId = user.organization?.id;

            if (!organizationId) return false;

            return !activePrograms.some(
                (program) => program.organization?.id === organizationId
            );
        }
    );

    const usersWithAccountSetupIssues = users.filter((user) => {
        const roleName = user.role?.name?.toLowerCase();

        const hasNoRole = !roleName;

        const isCulturalInstitutionWithoutOrganization =
            roleName === "cultural_institution" && !user.organization?.id;

        return hasNoRole || isCulturalInstitutionWithoutOrganization;
    });

    const statusChartData = [
        {
            name: "Aktiivsed",
            value: activePrograms.length,
        },
        {
            name: "Mitteaktiivsed",
            value: inactivePrograms.length,
        },
    ];

    const userRoleChartData = [
        {
            name: "Adminid",
            value: admins.length,
        },
        {
            name: "Õpetajad",
            value: teachers.length,
        },
        {
            name: "Kultuuriasutused",
            value: culturalInstitutions.length,
        },
    ];

    const categoryChartData = Object.entries(
        programs.reduce<Record<string, number>>((counts, program) => {
            const categoryName = program.category?.name || "Kategooria puudub";
            counts[categoryName] = (counts[categoryName] || 0) + 1;
            return counts;
        }, {})
    ).map(([name, value]) => ({
        name,
        value,
    }));

    const attentionItems = [
        {
            title: "Mitteaktiivsed programmid",
            value: inactivePrograms.length,
            description:
                "Programmid, mis ei ole hetkel õpetajatele nähtavad. Admin saab jälgida, kas neid peaks avalikustama või üle vaatama.",
            href: "/admin/programs",
            tone: inactivePrograms.length > 0 ? "amber" : "green",
        },
        {
            title: "Madala hinnanguga tagasiside",
            value: lowRatedFeedbacks.length,
            description:
                "Tagasisided hindega 1 või 2. Need võivad viidata probleemsele programmile või teenuse kvaliteedile.",
            href: "/admin",
            tone: lowRatedFeedbacks.length > 0 ? "red" : "green",
        },
        {
            title: "Konto seadistuse probleemid",
            value: usersWithAccountSetupIssues.length,
            description:
                "Kasutajad, kelle roll või vajalik seos asutusega vajab ülevaatamist. See võib mõjutada ligipääsu õigetele vaadetele.",
            href: "/admin/users",
            tone: usersWithAccountSetupIssues.length > 0 ? "red" : "green",
        },
        {
            title: "Duplikaat e-mailid",
            value: duplicateEmails.length,
            description:
                "Kasutajad, kelle e-mail kattub mõne teise kontoga. See võib tekitada sisselogimise või õiguste probleeme.",
            href: "/admin/users",
            tone: duplicateEmails.length > 0 ? "red" : "green",
        },
        {
            title: "Aktiivsed programmid ilma tagasisideta",
            value: activeProgramsWithoutFeedback.length,
            description:
                "Aktiivsed programmid, mille kohta pole veel tagasisidet jäetud. See aitab märgata programme, mille kasutust või nähtavust võiks jälgida.",
            href: "/admin/programs",
            tone: activeProgramsWithoutFeedback.length > 0 ? "blue" : "green",
        },
        {
            title: "Asutused ilma aktiivsete programmideta",
            value: institutionsWithoutActivePrograms.length,
            description:
                "Kultuuriasutuse kontod, mille seotud asutusel pole ühtegi aktiivset programmi.",
            href: "/admin/users",
            tone: institutionsWithoutActivePrograms.length > 0 ? "amber" : "green",
        },
    ];

    const quickLinks = [
        {
            title: "Halda kasutajaid",
            description: "Vaata, otsi ja muuda kasutajakontosid.",
            href: "/admin/users",
            icon: Users,
        },
        {
            title: "Halda programme",
            description: "Vaata kõiki kultuuriprogramme ja nende staatuseid.",
            href: "/admin/programs",
            icon: BookOpen,
        },
        {
            title: "Vaata murekohti",
            description: "Vaata kohti, mis võivad vajada admini tähelepanu.",
            href: "#attention",
            icon: AlertTriangle,
        },
        {
            title: "Vaata statistikat",
            description: "Ülevaade kasutajatest, programmidest ja tagasisidest.",
            href: "#statistics",
            icon: BarChart3,
        },
    ];

    const getToneClass = (tone: string) => {
        if (tone === "red") return "bg-red-50 text-red-700";
        if (tone === "amber") return "bg-amber-50 text-amber-700";
        if (tone === "blue") return "bg-blue-50 text-blue-700";
        if (tone === "green") return "bg-green-50 text-green-700";

        return "bg-gray-100 text-gray-600";
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <p className="text-sm font-extrabold uppercase tracking-wider text-blue-700 mb-2">
                        Administraatori töölaud
                    </p>

                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                        Ülevaade
                    </h1>

                    <p className="mt-3 text-gray-600 max-w-3xl">
                        Siin näed kogu süsteemi üldstatistikat, kontrollimist vajavaid kohti
                        ja kiireid admini tegevusi.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                    <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5">
                            <Users className="w-6 h-6" />
                        </div>

                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                            Kasutajaid kokku
                        </p>

                        <p className="mt-3 text-4xl font-black text-gray-900">
                            {users.length}
                        </p>
                    </div>

                    <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-5">
                            <BookOpen className="w-6 h-6" />
                        </div>

                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                            Programme kokku
                        </p>

                        <p className="mt-3 text-4xl font-black text-gray-900">
                            {programs.length}
                        </p>
                    </div>

                    <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center mb-5">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>

                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                            Aktiivsed programmid
                        </p>

                        <p className="mt-3 text-4xl font-black text-green-700">
                            {activePrograms.length}
                        </p>
                    </div>

                    <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
                        <div className="w-12 h-12 rounded-2xl bg-yellow-50 text-yellow-700 flex items-center justify-center mb-5">
                            <Star className="w-6 h-6" />
                        </div>

                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                            Keskmine hinnang
                        </p>

                        <p className="mt-3 text-4xl font-black text-gray-900">
                            {feedbacks.length > 0 ? averageRating.toFixed(1) : "—"}
                        </p>
                    </div>
                </div>

                <section id="attention" className="mb-8">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5" />
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-gray-900">
                                Tähelepanu vajavad kohad
                            </h2>

                            <p className="text-sm text-gray-500">
                                Olulisemad kohad, mida admin peaks süsteemi korras hoidmiseks
                                jälgima.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {attentionItems.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all group"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-black text-gray-900">
                                            {item.title}
                                        </p>

                                        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    <span
                                        className={`inline-flex min-w-12 h-12 rounded-2xl items-center justify-center text-xl font-black ${getToneClass(
                                            item.tone
                                        )}`}
                                    >
                                        {item.value}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <section id="statistics" className="mb-8">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5" />
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-gray-900">Statistika</h2>

                            <p className="text-sm text-gray-500">
                                Graafikud kogu süsteemi andmete põhjal.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
                            <h3 className="text-lg font-black text-gray-900 mb-1">
                                Programmid staatuse järgi
                            </h3>

                            <p className="text-sm text-gray-500 mb-6">
                                Aktiivsete ja mitteaktiivsete programmide jaotus.
                            </p>

                            <div className="h-[320px]">
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart data={statusChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="name" stroke="#6b7280" />
                                        <YAxis allowDecimals={false} stroke="#6b7280" />
                                        <Tooltip />
                                        <Bar
                                            dataKey="value"
                                            fill="#2563eb"
                                            radius={[8, 8, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
                            <h3 className="text-lg font-black text-gray-900 mb-1">
                                Kasutajad rollide järgi
                            </h3>

                            <p className="text-sm text-gray-500 mb-6">
                                Adminide, õpetajate ja kultuuriasutuste kontod.
                            </p>

                            <div className="h-[320px]">
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart data={userRoleChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="name" stroke="#6b7280" />
                                        <YAxis allowDecimals={false} stroke="#6b7280" />
                                        <Tooltip />
                                        <Bar
                                            dataKey="value"
                                            fill="#16a34a"
                                            radius={[8, 8, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="xl:col-span-2 rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
                            <h3 className="text-lg font-black text-gray-900 mb-1">
                                Programmid kategooriate järgi
                            </h3>

                            <p className="text-sm text-gray-500 mb-6">
                                Näitab, millistesse kategooriatesse programmid jaotuvad.
                            </p>

                            {categoryChartData.length === 0 ? (
                                <div className="h-[320px] flex items-center justify-center text-gray-400 font-semibold">
                                    Kategooriate statistikat pole veel kuvada.
                                </div>
                            ) : (
                                <div className="h-[360px]">
                                    <ResponsiveContainer width="100%" height={340}>
                                        <PieChart>
                                            <Pie
                                                data={categoryChartData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={120}
                                                label
                                            >
                                                {categoryChartData.map((entry, index) => (
                                                    <Cell
                                                        key={`${entry.name}-${index}`}
                                                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                            <Wrench className="w-5 h-5" />
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-gray-900">Kiirlingid</h2>

                            <p className="text-sm text-gray-500">
                                Kõige olulisemad admini tegevused ühest kohast.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                        {quickLinks.map((link) => {
                            const Icon = link.icon;

                            return (
                                <Link
                                    key={link.title}
                                    href={link.href}
                                    className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    <h3 className="text-lg font-black text-gray-900">
                                        {link.title}
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                                        {link.description}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            </section>
        </main>
    );
}