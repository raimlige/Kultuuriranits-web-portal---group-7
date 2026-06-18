"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronDown,
  MessageSquare,
  PlusCircle,
  Search,
  Star,
  UserRound,
} from "lucide-react";

import {
  InstitutionProgramCard,
  type InstitutionProgram,
} from "@/components/InstitutionProgramCard";
import { ProgramAddForm } from "@/components/ProgramAddForm";
import { Pagination } from "@/components/Pagination";
import { Sort } from "@/components/Sort";
import { Category } from "@/models/Category";
import { useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:5050";

const CHART_COLORS = [
  "#2563eb",
  "#16a34a",
  "#f97316",
  "#9333ea",
  "#dc2626",
  "#0891b2",
];

const STATUS_ACTIVE = "Active";
const STATUS_INACTIVE = "Inactive";

type DashboardTab = "programs" | "feedback" | "statistics" | "addProgram";

type Organization = {
  id: number;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  type?: string;
  phone?: string;
  email?: string;
};

type CurrentUser = {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  organization?: Organization | null;
  role?: {
    id: number;
    name: string;
  };
};

type ProgramResponse = {
  content?: InstitutionProgram[];
  totalPages?: number;
};

type FeedbackPerson = {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
};

type Feedback = {
  id: number;
  text: string;
  rating: number;
  createdAt?: string;
  program?: InstitutionProgram | null;
  person?: FeedbackPerson | null;
};

function isProgramPublished(status?: string | null) {
  return (
    status?.toLowerCase() === "active" ||
    status?.toLowerCase() === "published" ||
    status?.toLowerCase() === "avalikustatud"
  );
}

function getNormalizedStatus(status?: string | null) {
  return isProgramPublished(status) ? STATUS_ACTIVE : STATUS_INACTIVE;
}

function normalize(value?: string | number | null) {
  return String(value ?? "").trim().toLowerCase();
}

function getProgramSortValue(
  program: InstitutionProgram,
  field: string,
): string | number {
  switch (field) {
    case "title":
      return normalize(program.title);

    case "pricePerStudent":
      return Number(program.pricePerStudent ?? 0);

    case "durationMinutes":
      return Number(program.durationMinutes ?? 0);

    case "id":
    default:
      return Number(program.id ?? 0);
  }
}

function sortInstitutionPrograms(
  programs: InstitutionProgram[],
  sort = "id,desc",
) {
  const [field = "id", direction = "desc"] = sort.split(",");

  return [...programs].sort((a, b) => {
    const aValue = getProgramSortValue(a, field);
    const bValue = getProgramSortValue(b, field);

    if (typeof aValue === "string" && typeof bValue === "string") {
      return direction === "desc"
        ? bValue.localeCompare(aValue, "et")
        : aValue.localeCompare(bValue, "et");
    }

    return direction === "desc"
      ? Number(bValue) - Number(aValue)
      : Number(aValue) - Number(bValue);
  });
}

function formatFeedbackDate(date?: string) {
  if (!date) return "Kuupäev puudub";

  return new Date(date).toLocaleDateString("et-EE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getFeedbackAuthor(person?: FeedbackPerson | null) {
  if (!person) return "Anonüümne kasutaja";

  const fullName = `${person.firstName || ""} ${person.lastName || ""}`.trim();

  return fullName || person.email || "Anonüümne kasutaja";
}

export default function CulturalInstitutionDashboardPage() {
  const searchParams = useSearchParams();

  const page = Math.max(Number(searchParams.get("page")) || 0, 0);
  const size = Math.max(Number(searchParams.get("size")) || 3, 1);
  const sort = searchParams.get("sort") || "id,desc";

  const [activeTab, setActiveTab] = useState<DashboardTab>("programs");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [programs, setPrograms] = useState<InstitutionProgram[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [publishedOnly, setPublishedOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [feedbackProgramFilter, setFeedbackProgramFilter] = useState("all");
  const [feedbackRatingFilter, setFeedbackRatingFilter] = useState("all");
  const [feedbackSort, setFeedbackSort] = useState("newest");

  const loadDashboardData = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setErrorMessage("");

      const meResponse = await fetch(`${API_URL}/me`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        signal,
      });

      if (meResponse.status === 401 || meResponse.status === 403) {
        setCurrentUser(null);
        setPrograms([]);
        setErrorMessage("Töölaua vaatamiseks pead olema sisse logitud.");
        return;
      }

      if (!meResponse.ok) {
        throw new Error(`Kasutaja päring ebaõnnestus: ${meResponse.status}`);
      }

      const userData: CurrentUser = await meResponse.json();
      setCurrentUser(userData);

      const organizationId = userData.organization?.id;

      if (!organizationId) {
        setPrograms([]);
        setErrorMessage("Kasutajaga ei ole seotud kultuuriasutust.");
        return;
      }

      const [programsResponse, feedbackResponse, categoriesResponse] =
        await Promise.all([
          fetch(`${API_URL}/program?page=0&size=200&sort=id,desc`, {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            signal,
          }),
          fetch(`${API_URL}/feedback`, {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            signal,
          }),
          fetch(`${API_URL}/category`, {
            method: "GET",
            cache: "no-store",
            signal,
          }),
        ]);

      if (!programsResponse.ok) {
        throw new Error(
          `Programmide päring ebaõnnestus: ${programsResponse.status}`,
        );
      }

      const programsData: ProgramResponse | InstitutionProgram[] =
        await programsResponse.json();

      const allPrograms = Array.isArray(programsData)
        ? programsData
        : programsData.content ?? [];

      const ownPrograms = allPrograms.filter((program) => {
        return program.organization?.id === organizationId;
      });

      setPrograms(ownPrograms);

      if (feedbackResponse.ok) {
        const feedbackData: Feedback[] = await feedbackResponse.json();
        setFeedbacks(feedbackData);
      } else {
        setFeedbacks([]);
      }

      if (categoriesResponse.ok) {
        const categoryData: Category[] = await categoriesResponse.json();
        setCategories(Array.isArray(categoryData) ? categoryData : []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Töölaua andmete laadimine ebaõnnestus:", error);
        setErrorMessage(error.message);
        setPrograms([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    loadDashboardData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadDashboardData]);

  const organizationId = currentUser?.organization?.id;
  const institutionName = currentUser?.organization?.name ?? "Minu asutus";

  const statusChartData = useMemo(() => {
    const counts: Record<string, number> = {};

    programs.forEach((program) => {
      const status = getNormalizedStatus(program.status);
      counts[status] = (counts[status] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [programs]);

  const categoryChartData = useMemo(() => {
    const counts: Record<string, number> = {};

    programs.forEach((program) => {
      const category = program.category?.name || "Kategooria puudub";
      counts[category] = (counts[category] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [programs]);

  const priceChartData = useMemo(() => {
    return programs.map((program) => ({
      name:
        program.title.length > 18
          ? `${program.title.slice(0, 18)}...`
          : program.title,
      price: Number(program.pricePerStudent || 0),
    }));
  }, [programs]);

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        program.title?.toLowerCase().includes(searchValue) ||
        program.description?.toLowerCase().includes(searchValue) ||
        program.shortDescription?.toLowerCase().includes(searchValue) ||
        program.location?.toLowerCase().includes(searchValue) ||
        program.category?.name?.toLowerCase().includes(searchValue) ||
        program.targetGroups?.some((group) =>
          group.toLowerCase().includes(searchValue),
        );

      const matchesPublished = publishedOnly
        ? isProgramPublished(program.status)
        : true;

      return matchesSearch && matchesPublished;
    });
  }, [programs, search, publishedOnly]);

  const sortedPrograms = useMemo(() => {
    return sortInstitutionPrograms(filteredPrograms, sort);
  }, [filteredPrograms, sort]);

  const totalPages = Math.max(Math.ceil(sortedPrograms.length / size), 1);
  const safePage = Math.min(page, totalPages - 1);
  const startIndex = safePage * size;

  const paginatedPrograms = useMemo(() => {
    return sortedPrograms.slice(startIndex, startIndex + size);
  }, [sortedPrograms, startIndex, size]);

  const activeProgramsCount = programs.filter((program) =>
    isProgramPublished(program.status),
  ).length;

  const ownProgramIds = useMemo(() => {
    return new Set(programs.map((program) => program.id));
  }, [programs]);

  const institutionFeedbacks = useMemo(() => {
    return feedbacks
      .filter((feedback) => {
        const feedbackProgramId = feedback.program?.id;

        if (!feedbackProgramId) return false;

        return ownProgramIds.has(feedbackProgramId);
      })
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        return dateB - dateA;
      });
  }, [feedbacks, ownProgramIds]);

  const filteredFeedbacks = useMemo(() => {
    let result = [...institutionFeedbacks];

    if (feedbackSearch.trim()) {
      const searchValue = feedbackSearch.toLowerCase();

      result = result.filter((feedback) => {
        const programTitle = feedback.program?.title?.toLowerCase() || "";
        const feedbackText = feedback.text?.toLowerCase() || "";
        const author = getFeedbackAuthor(feedback.person).toLowerCase();

        return (
          programTitle.includes(searchValue) ||
          feedbackText.includes(searchValue) ||
          author.includes(searchValue)
        );
      });
    }

    if (feedbackProgramFilter !== "all") {
      result = result.filter(
        (feedback) => String(feedback.program?.id) === feedbackProgramFilter,
      );
    }

    if (feedbackRatingFilter !== "all") {
      const rating = Number(feedbackRatingFilter);
      result = result.filter((feedback) => Number(feedback.rating) === rating);
    }

    result.sort((a, b) => {
      if (feedbackSort === "oldest") {
        return (
          new Date(a.createdAt || "").getTime() -
          new Date(b.createdAt || "").getTime()
        );
      }

      if (feedbackSort === "rating-high") {
        return Number(b.rating || 0) - Number(a.rating || 0);
      }

      if (feedbackSort === "rating-low") {
        return Number(a.rating || 0) - Number(b.rating || 0);
      }

      if (feedbackSort === "program-az") {
        return (a.program?.title || "").localeCompare(b.program?.title || "");
      }

      return (
        new Date(b.createdAt || "").getTime() -
        new Date(a.createdAt || "").getTime()
      );
    });

    return result;
  }, [
    institutionFeedbacks,
    feedbackSearch,
    feedbackProgramFilter,
    feedbackRatingFilter,
    feedbackSort,
  ]);

  const feedbackProgramOptions = useMemo(() => {
    const map = new Map<number, string>();

    institutionFeedbacks.forEach((feedback) => {
      if (feedback.program?.id && feedback.program?.title) {
        map.set(feedback.program.id, feedback.program.title);
      }
    });

    return Array.from(map.entries()).map(([id, title]) => ({
      id,
      title,
    }));
  }, [institutionFeedbacks]);

  const averageFeedbackRating = useMemo(() => {
    if (institutionFeedbacks.length === 0) return 0;

    const sum = institutionFeedbacks.reduce(
      (total, feedback) => total + Number(feedback.rating || 0),
      0,
    );

    return sum / institutionFeedbacks.length;
  }, [institutionFeedbacks]);

  const programsWithFeedbackCount = useMemo(() => {
    return new Set(
      institutionFeedbacks
        .map((feedback) => feedback.program?.id)
        .filter(Boolean),
    ).size;
  }, [institutionFeedbacks]);

  const averageProgramPrice = useMemo(() => {
    if (programs.length === 0) return 0;

    const sum = programs.reduce(
      (total, program) => total + Number(program.pricePerStudent || 0),
      0,
    );

    return Math.round(sum / programs.length);
  }, [programs]);

  const handleDeleteProgram = async (id: number, title: string) => {
    const confirmDelete = window.confirm(
      `Kas oled kindel, et soovid programmi "${title}" jäädavalt kustutada?`,
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/program/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setPrograms((prevPrograms) =>
          prevPrograms.filter((program) => program.id !== id),
        );

        alert("Programm edukalt kustutatud!");
      } else {
        const errorText = await res.text();
        alert(`Kustutamine ebaõnnestus: ${errorText || "Viga serveris"}`);
      }
    } catch (error) {
      console.error("Viga kustutamisel:", error);
      alert("Võrguviga programmi kustutamisel.");
    }
  };

  const handleToggleProgramVisibility = async (
    programToUpdate: InstitutionProgram,
  ) => {
    const isCurrentlyPublished = isProgramPublished(programToUpdate.status);
    const nextStatus = isCurrentlyPublished ? STATUS_INACTIVE : STATUS_ACTIVE;

    const confirmed = window.confirm(
      isCurrentlyPublished
        ? `Kas soovid muuta programmi "${programToUpdate.title}" mitteavalikuks?`
        : `Kas soovid muuta programmi "${programToUpdate.title}" avalikuks?`,
    );

    if (!confirmed) return;

    if (!programToUpdate.imageName) {
      alert(
        "Seda programmi ei saa olemasoleva update endpointiga muuta, sest programmil puudub pilt.\nBackend ootab update päringus imageFile osa.",
      );

      return;
    }

    try {
      const imageResponse = await fetch(
        `${API_URL}/program/${programToUpdate.id}/image`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        },
      );

      if (!imageResponse.ok) {
        alert("Olemasoleva pildi laadimine ebaõnnestus.");
        return;
      }

      const imageBlob = await imageResponse.blob();

      const updatedProgram = {
        ...programToUpdate,
        status: nextStatus,
      };

      const formData = new FormData();

      formData.append(
        "program",
        new Blob([JSON.stringify(updatedProgram)], {
          type: "application/json",
        }),
      );

      formData.append(
        "imageFile",
        imageBlob,
        programToUpdate.imageName || `program-${programToUpdate.id}.jpg`,
      );

      const res = await fetch(`${API_URL}/program/${programToUpdate.id}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();

        alert(
          `Staatuse muutmine ebaõnnestus: ${errorText || "Viga serveris"
          }`,
        );

        return;
      }

      setPrograms((prevPrograms) =>
        prevPrograms.map((program) =>
          program.id === programToUpdate.id
            ? {
              ...program,
              status: nextStatus,
            }
            : program,
        ),
      );
    } catch (error) {
      console.error("Viga programmi staatuse muutmisel:", error);
      alert("Võrguviga programmi staatuse muutmisel.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-extrabold uppercase tracking-wider text-blue-600 mb-2">
            Kultuuriasutuse töölaud
          </p>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            {institutionName}
          </h1>

          <p className="text-sm font-medium text-gray-500 mt-2 max-w-2xl">
            Siin saad hallata oma kultuuriasutuse programme, vaadata tagasisidet
            ja jälgida statistikat.
          </p>
        </div>

        <div className="mb-8 border-b border-gray-200">
          <nav className="flex flex-wrap gap-6">
            <button
              type="button"
              onClick={() => setActiveTab("programs")}
              className={`inline-flex items-center gap-2 px-1 py-4 text-sm font-bold border-b-2 transition cursor-pointer active:scale-95 ${activeTab === "programs"
                  ? "text-blue-700 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-800"
                }`}
            >
              <BookOpen className="h-4 w-4" />
              Programmid
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-black text-gray-600">
                {programs.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("feedback")}
              className={`inline-flex items-center gap-2 px-1 py-4 text-sm font-bold border-b-2 transition cursor-pointer active:scale-95 ${activeTab === "feedback"
                  ? "text-blue-700 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-800"
                }`}
            >
              <MessageSquare className="h-4 w-4" />
              Tagasiside
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("statistics")}
              className={`inline-flex items-center gap-2 px-1 py-4 text-sm font-bold border-b-2 transition cursor-pointer active:scale-95 ${activeTab === "statistics"
                  ? "text-blue-700 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-800"
                }`}
            >
              <BarChart3 className="h-4 w-4" />
              Statistika
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("addProgram")}
              className={`inline-flex items-center gap-2 px-1 py-4 text-sm font-bold border-b-2 transition cursor-pointer active:scale-95 ${activeTab === "addProgram"
                  ? "text-blue-700 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-800"
                }`}
            >
              <PlusCircle className="h-4 w-4" />
              Lisa uus programm
            </button>
          </nav>
        </div>

        {activeTab === "programs" && (
          <>
            <div className="mb-8 rounded-3xl bg-white border border-gray-200 shadow-sm p-5">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-4 items-center">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Otsi enda programme..."
                    className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                  />
                </div>

                <label className="inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={publishedOnly}
                    onChange={(event) =>
                      setPublishedOnly(event.target.checked)
                    }
                    className="w-5 h-5 rounded border-gray-300 accent-blue-600 cursor-pointer"
                  />
                  Avalikustatud
                </label>

                <button
                  type="button"
                  onClick={() => setActiveTab("addProgram")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 transition shadow-sm cursor-pointer active:scale-95"
                >
                  <PlusCircle className="h-4 w-4" />
                  Lisa uus programm
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  Minu programmid
                </h2>

                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
                  {filteredPrograms.length === 1
                    ? "1 programm"
                    : `${filteredPrograms.length} programmi`}
                </p>
              </div>

              <Sort />
            </div>

            {loading && (
              <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-10 text-center text-gray-500 font-semibold">
                Laetakse programme...
              </div>
            )}

            {!loading && errorMessage && (
              <div className="rounded-3xl bg-white border border-red-100 shadow-sm p-10 text-center">
                <h2 className="text-2xl font-black text-gray-900 mb-2">
                  Programme ei saanud laadida
                </h2>

                <p className="text-gray-500">{errorMessage}</p>
              </div>
            )}

            {!loading && !errorMessage && paginatedPrograms.length === 0 && (
              <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-10 text-center">
                <h2 className="text-2xl font-black text-gray-900 mb-2">
                  Programme ei ole veel kuvada
                </h2>

                <p className="text-gray-500 mb-6">
                  Selle kultuuriasutusega seotud programme ei leitud või need ei
                  vasta filtritele.
                </p>

                <button
                  type="button"
                  onClick={() => setActiveTab("addProgram")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 transition cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4" />
                  Lisa esimene programm
                </button>
              </div>
            )}

            {!loading && paginatedPrograms.length > 0 && (
              <div className="space-y-6">
                {paginatedPrograms.map((program) => (
                  <InstitutionProgramCard
                    key={program.id}
                    program={program}
                    apiUrl={API_URL}
                    onDelete={handleDeleteProgram}
                    onToggleVisibility={handleToggleProgramVisibility}
                  />
                ))}
              </div>
            )}

            {!loading && filteredPrograms.length > 0 && (
              <div className="mt-10">
                <Pagination page={safePage} totalPages={totalPages} />
              </div>
            )}
          </>
        )}

        {activeTab === "feedback" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Tagasiside
              </h2>

              <p className="text-sm font-medium text-gray-500 mt-2">
                Siin näed tagasisidet, mis on jäetud sinu kultuuriasutuse
                programmidele.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
                <p className="text-xs font-black uppercase tracking-wide text-blue-600 mb-2">
                  Tagasisidet kokku
                </p>

                <p className="text-3xl font-black text-gray-900">
                  {institutionFeedbacks.length}
                </p>
              </div>

              <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
                <p className="text-xs font-black uppercase tracking-wide text-blue-600 mb-2">
                  Keskmine hinne
                </p>

                <p className="text-3xl font-black text-gray-900">
                  {institutionFeedbacks.length > 0
                    ? averageFeedbackRating.toFixed(1)
                    : "—"}
                  {institutionFeedbacks.length > 0 && (
                    <span className="text-base font-bold text-gray-400">
                      {" "}
                      / 5
                    </span>
                  )}
                </p>
              </div>

              <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
                <p className="text-xs font-black uppercase tracking-wide text-blue-600 mb-2">
                  Programme tagasisidega
                </p>

                <p className="text-3xl font-black text-gray-900">
                  {programsWithFeedbackCount}
                </p>
              </div>
            </div>

            {institutionFeedbacks.length === 0 ? (
              <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-10 text-center">
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  Tagasisidet pole veel
                </h3>

                <p className="text-gray-500">
                  Kui õpetajad jätavad sinu kultuuriasutuse programmidele
                  hinnanguid või kommentaare, kuvatakse need siin.
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-5">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px_180px_200px] gap-4">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                      <input
                        type="text"
                        value={feedbackSearch}
                        onChange={(event) =>
                          setFeedbackSearch(event.target.value)
                        }
                        placeholder="Otsi tagasisidest..."
                        className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                      />
                    </div>

                    <div className="relative">
                      <select
                        value={feedbackProgramFilter}
                        onChange={(event) =>
                          setFeedbackProgramFilter(event.target.value)
                        }
                        className="w-full appearance-none rounded-2xl border border-gray-200 bg-white pl-4 pr-10 py-3 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 cursor-pointer"
                      >
                        <option value="all">Kõik programmid</option>

                        {feedbackProgramOptions.map((program) => (
                          <option key={program.id} value={program.id}>
                            {program.title}
                          </option>
                        ))}
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>

                    <div className="relative">
                      <select
                        value={feedbackRatingFilter}
                        onChange={(event) =>
                          setFeedbackRatingFilter(event.target.value)
                        }
                        className="w-full appearance-none rounded-2xl border border-gray-200 bg-white pl-4 pr-10 py-3 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 cursor-pointer"
                      >
                        <option value="all">Kõik hinded</option>
                        <option value="5">5 tärni</option>
                        <option value="4">4 tärni</option>
                        <option value="3">3 tärni</option>
                        <option value="2">2 tärni</option>
                        <option value="1">1 tärn</option>
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>

                    <div className="relative">
                      <select
                        value={feedbackSort}
                        onChange={(event) =>
                          setFeedbackSort(event.target.value)
                        }
                        className="w-full appearance-none rounded-2xl border border-gray-200 bg-white pl-4 pr-10 py-3 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 cursor-pointer"
                      >
                        <option value="newest">Uuemad enne</option>
                        <option value="oldest">Vanemad enne</option>
                        <option value="rating-high">Kõrgem hinne enne</option>
                        <option value="rating-low">Madalam hinne enne</option>
                        <option value="program-az">Programm A-Z</option>
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                      {filteredFeedbacks.length === 1
                        ? "Kuvan 1 tagasiside"
                        : `Kuvan ${filteredFeedbacks.length} tagasisidet`}
                    </p>

                    {(feedbackSearch ||
                      feedbackProgramFilter !== "all" ||
                      feedbackRatingFilter !== "all" ||
                      feedbackSort !== "newest") && (
                        <button
                          type="button"
                          onClick={() => {
                            setFeedbackSearch("");
                            setFeedbackProgramFilter("all");
                            setFeedbackRatingFilter("all");
                            setFeedbackSort("newest");
                          }}
                          className="text-sm font-extrabold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        >
                          Puhasta filtrid
                        </button>
                      )}
                  </div>
                </div>

                {filteredFeedbacks.length === 0 ? (
                  <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-10 text-center">
                    <h3 className="text-2xl font-black text-gray-900 mb-2">
                      Filtritele vastavat tagasisidet ei leitud
                    </h3>

                    <p className="text-gray-500">
                      Proovi otsingut muuta või puhasta filtrid, et näha kõiki
                      tagasisidesid.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredFeedbacks.map((feedback) => (
                      <article
                        key={feedback.id}
                        className="rounded-3xl bg-white border-2 border-black shadow-sm p-6 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-black text-yellow-700">
                                <Star className="h-3.5 w-3.5 fill-current" />
                                {feedback.rating}/5
                              </span>

                              {feedback.program?.title && (
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                                  {feedback.program.title}
                                </span>
                              )}
                            </div>

                            <h3 className="text-xl font-black text-gray-900">
                              {feedback.program?.title || "Programm puudub"}
                            </h3>
                          </div>

                          <div className="text-sm text-gray-500 space-y-1">
                            <div className="flex items-center gap-2">
                              <UserRound className="h-4 w-4" />
                              {getFeedbackAuthor(feedback.person)}
                            </div>

                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4" />
                              {formatFeedbackDate(feedback.createdAt)}
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 leading-relaxed">
                          {feedback.text || "Kommentaar puudub."}
                        </p>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "addProgram" && (
          <ProgramAddForm
            categories={categories}
            organizationId={organizationId}
            onSuccess={() => {
              loadDashboardData();
              setActiveTab("programs");
              window.scrollTo({ top: 0 });
            }}
          />
        )}

        {activeTab === "statistics" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Statistika
              </h2>

              <p className="text-sm font-medium text-gray-500 mt-2">
                Statistika põhineb hetkel laaditud kultuuriasutuse programmidel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
                <p className="text-xs font-black uppercase tracking-wide text-blue-600 mb-2">
                  Programme kokku
                </p>

                <p className="text-3xl font-black text-gray-900">
                  {programs.length}
                </p>
              </div>

              <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
                <p className="text-xs font-black uppercase tracking-wide text-blue-600 mb-2">
                  Avalikustatud
                </p>

                <p className="text-3xl font-black text-gray-900">
                  {activeProgramsCount}
                </p>
              </div>

              <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
                <p className="text-xs font-black uppercase tracking-wide text-blue-600 mb-2">
                  Keskmine hind
                </p>

                <p className="text-3xl font-black text-gray-900">
                  {programs.length > 0 ? `${averageProgramPrice}€` : "—"}
                </p>
              </div>
            </div>

            {programs.length === 0 ? (
              <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-10 text-center">
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  Statistikat pole veel kuvada
                </h3>

                <p className="text-gray-500">
                  Kui kultuuriasutusel on programmid olemas, kuvatakse siin
                  graafikud.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
                  <h3 className="text-xl font-black text-gray-900 mb-1">
                    Programmid staatuse järgi
                  </h3>

                  <p className="text-sm font-medium text-gray-500 mb-6">
                    Näitab, mitu programmi on igas staatuses.
                  </p>

                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusChartData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={90}
                          label
                        >
                          {statusChartData.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                        </Pie>

                        <Tooltip
                          content={({ active, payload }: any) => {
                            if (active && payload && payload.length) {
                              const data = payload[0];
                              const currentName = String(
                                data.payload.name || data.name,
                              ).toLowerCase();

                              const labelName =
                                currentName === "active"
                                  ? "Aktiivseid"
                                  : "Mitteaktiivseid";

                              return (
                                <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm">
                                  {labelName}: {data.value}
                                </div>
                              );
                            }

                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
                  <h3 className="text-xl font-black text-gray-900 mb-1">
                    Programmid kategooriate järgi
                  </h3>

                  <p className="text-sm font-medium text-gray-500 mb-6">
                    Näitab programmide jaotust kategooriate kaupa.
                  </p>

                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryChartData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={90}
                          label
                        >
                          {categoryChartData.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                        </Pie>

                        <Tooltip
                          content={({ active, payload }: any) => {
                            if (active && payload && payload.length) {
                              const data = payload[0];

                              return (
                                <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm">
                                  {data.name}: {data.value}
                                </div>
                              );
                            }

                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6 xl:col-span-2">
                  <h3 className="text-xl font-black text-gray-900 mb-1">
                    Programmi hind õpilase kohta
                  </h3>

                  <p className="text-sm font-medium text-gray-500 mb-6">
                    Võrdleb kultuuriasutuse programmide hindu.
                  </p>

                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={priceChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          content={({ active, payload }: any) => {
                            if (active && payload && payload.length) {
                              const data = payload[0];

                              return (
                                <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm">
                                  <p>{`Programm: ${data.payload.name}`}</p>
                                  <p>{`Hind: ${data.value}€`}</p>
                                </div>
                              );
                            }

                            return null;
                          }}
                        />
                        <Bar dataKey="price" radius={[10, 10, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}