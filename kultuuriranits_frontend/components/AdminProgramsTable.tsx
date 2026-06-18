"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowUpDown,
  BookOpen,
  Building2,
  CheckCircle2,
  CircleOff,
  Euro,
  RotateCcw,
  Search,
} from "lucide-react";
import type { Program } from "@/models/Program";
import { DeleteProgramButton } from "@/components/DeleteProgramButton";
import { Pagination } from "@/components/Pagination";

type AdminProgramsTableProps = {
  programs: Program[];
};

type SortOption =
  | "newest"
  | "oldest"
  | "title-az"
  | "title-za"
  | "price-low"
  | "price-high"
  | "duration-low"
  | "duration-high"
  | "organization-az"
  | "status";

const PROGRAMS_PER_PAGE = 10;

export function AdminProgramsTable({ programs }: AdminProgramsTableProps) {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [organizationFilter, setOrganizationFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Puudub";

    return new Date(dateString).toLocaleDateString("et-EE");
  };

  const getDateTime = (dateString?: string) => {
    if (!dateString) return 0;

    return new Date(dateString).getTime();
  };

  const isProgramActive = (status?: string) => {
    return status?.toLowerCase() === "active";
  };

  const activePrograms = programs.filter((program) =>
    isProgramActive(program.status)
  ).length;

  const inactivePrograms = programs.filter(
    (program) => !isProgramActive(program.status)
  ).length;

  const organizationsCount = new Set(
    programs.map((program) => program.organization?.id).filter(Boolean)
  ).size;

  const categoryOptions = useMemo(() => {
    const map = new Map<number, string>();

    programs.forEach((program) => {
      if (program.category?.id && program.category?.name) {
        map.set(program.category.id, program.category.name);
      }
    });

    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [programs]);

  const organizationOptions = useMemo(() => {
    const map = new Map<number, string>();

    programs.forEach((program) => {
      if (program.organization?.id && program.organization?.name) {
        map.set(program.organization.id, program.organization.name);
      }
    });

    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [programs]);

  const filteredPrograms = useMemo(() => {
    let result = [...programs];

    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter((program) => {
        const searchableText = [
          program.id,
          program.title,
          program.description,
          program.status,
          program.category?.name,
          program.organization?.name,
          program.location,
          program.languages,
          program.targetGroups,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchValue);
      });
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (program) => program.status?.toLowerCase() === statusFilter
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter(
        (program) => String(program.category?.id) === categoryFilter
      );
    }

    if (organizationFilter !== "all") {
      result = result.filter(
        (program) => String(program.organization?.id) === organizationFilter
      );
    }

    result.sort((a, b) => {
      if (sortBy === "oldest") {
        return getDateTime(a.createdAt) - getDateTime(b.createdAt);
      }

      if (sortBy === "title-az") {
        return (a.title || "").localeCompare(b.title || "");
      }

      if (sortBy === "title-za") {
        return (b.title || "").localeCompare(a.title || "");
      }

      if (sortBy === "price-low") {
        return Number(a.pricePerStudent || 0) - Number(b.pricePerStudent || 0);
      }

      if (sortBy === "price-high") {
        return Number(b.pricePerStudent || 0) - Number(a.pricePerStudent || 0);
      }

      if (sortBy === "duration-low") {
        return Number(a.durationMinutes || 0) - Number(b.durationMinutes || 0);
      }

      if (sortBy === "duration-high") {
        return Number(b.durationMinutes || 0) - Number(a.durationMinutes || 0);
      }

      if (sortBy === "organization-az") {
        return (a.organization?.name || "").localeCompare(
          b.organization?.name || ""
        );
      }

      if (sortBy === "status") {
        return (a.status || "").localeCompare(b.status || "");
      }

      return getDateTime(b.createdAt) - getDateTime(a.createdAt);
    });

    return result;
  }, [
    programs,
    search,
    statusFilter,
    categoryFilter,
    organizationFilter,
    sortBy,
  ]);

  const totalPages = Math.ceil(filteredPrograms.length / PROGRAMS_PER_PAGE);

  const pageParam = Number(searchParams.get("page") || 0);

  const currentPage =
    totalPages > 0
      ? Math.min(Math.max(pageParam, 0), totalPages - 1)
      : 0;

  const startIndex = currentPage * PROGRAMS_PER_PAGE;
  const endIndex = startIndex + PROGRAMS_PER_PAGE;

  const paginatedPrograms = filteredPrograms.slice(startIndex, endIndex);

  const hasActiveFilters =
    search ||
    statusFilter !== "all" ||
    categoryFilter !== "all" ||
    organizationFilter !== "all" ||
    sortBy !== "newest";

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setOrganizationFilter("all");
    setSortBy("newest");
  };

  const getStatusBadgeClass = (status?: string) => {
    if (status?.toLowerCase() === "active") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (status?.toLowerCase() === "inactive") {
      return "bg-gray-100 text-gray-600 border-gray-200";
    }

    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <p className="text-sm font-extrabold uppercase tracking-wider text-blue-700 mb-2">
            Administraatori vaade
          </p>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            Kultuuriprogrammid
          </h1>

          <p className="mt-3 text-gray-600 max-w-3xl">
            Siin saad ülevaate süsteemis olevatest kultuuriprogrammidest,
            nende korraldajatest ja staatusest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5">
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
              Aktiivsed
            </p>

            <p className="mt-3 text-4xl font-black text-green-700">
              {activePrograms}
            </p>
          </div>

          <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center mb-5">
              <CircleOff className="w-6 h-6" />
            </div>

            <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
              Mitteaktiivsed
            </p>

            <p className="mt-3 text-4xl font-black text-gray-700">
              {inactivePrograms}
            </p>
          </div>

          <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-5">
              <Building2 className="w-6 h-6" />
            </div>

            <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
              Korraldajaid
            </p>

            <p className="mt-3 text-4xl font-black text-indigo-700">
              {organizationsCount}
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  Kõik programmid
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Kuvan{" "}
                  <span className="font-bold text-gray-900">
                    {filteredPrograms.length > 0 ? startIndex + 1 : 0}
                    {"–"}
                    {Math.min(endIndex, filteredPrograms.length)}
                  </span>{" "}
                  / {filteredPrograms.length} programmist.
                </p>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm font-extrabold text-blue-700 hover:bg-blue-100 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Puhasta filtrid
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-4 mt-5">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

                <input
                  type="text"
                  placeholder="Otsi programmi..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 cursor-pointer"
              >
                <option value="all">Kõik staatused</option>
                <option value="active">Aktiivsed</option>
                <option value="inactive">Mitteaktiivsed</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 cursor-pointer"
              >
                <option value="all">Kõik kategooriad</option>

                {categoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={organizationFilter}
                onChange={(event) => setOrganizationFilter(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 cursor-pointer"
              >
                <option value="all">Kõik korraldajad</option>

                {organizationOptions.map((organization) => (
                  <option key={organization.id} value={organization.id}>
                    {organization.name}
                  </option>
                ))}
              </select>

              <div className="relative">
                <ArrowUpDown className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value as SortOption)
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 cursor-pointer"
                >
                  <option value="newest">Uuemad enne</option>
                  <option value="oldest">Vanemad enne</option>
                  <option value="title-az">Nimi A-Z</option>
                  <option value="title-za">Nimi Z-A</option>
                  <option value="price-low">Hind madalam enne</option>
                  <option value="price-high">Hind kõrgem enne</option>
                  <option value="duration-low">Kestus lühem enne</option>
                  <option value="duration-high">Kestus pikem enne</option>
                  <option value="organization-az">Korraldaja A-Z</option>
                  <option value="status">Staatus</option>
                </select>
              </div>
            </div>
          </div>

          {programs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-5">
                <BookOpen className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-3">
                Programme pole veel lisatud
              </h3>

              <p className="text-gray-500">
                Kui kultuuriasutused lisavad programme, kuvatakse need siin.
              </p>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-5">
                <Search className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-3">
                Ühtegi programmi ei leitud
              </h3>

              <p className="text-gray-500 mb-6">
                Proovi otsingut või filtreid muuta.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Puhasta filtrid
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-[1050px] w-full border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="w-20 px-6 py-4 text-center text-xs font-black text-gray-500 uppercase tracking-wider">
                        ID
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">
                        Programm
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">
                        Korraldaja
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">
                        Kategooria
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">
                        Staatus
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">
                        Hind
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">
                        Kestus
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">
                        Loodud
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-wider">
                        Tegevused
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginatedPrograms.map((program) => (
                      <tr
                        key={program.id}
                        className="hover:bg-blue-50/40 transition-colors"
                      >
                        <td className="w-20 px-6 py-5 text-center text-sm font-black text-gray-900 align-middle">
                          {program.id}
                        </td>

                        <td className="px-6 py-5 align-middle">
                          <div className="max-w-[360px]">
                            <p className="text-sm font-black text-gray-900 leading-snug">
                              {program.title}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5 align-middle">
                          <p className="max-w-[190px] text-sm font-semibold text-gray-800 leading-relaxed">
                            {program.organization?.name ?? "Määramata"}
                          </p>
                        </td>

                        <td className="px-6 py-5 align-middle">
                          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                            {program.category?.name ?? "Määramata"}
                          </span>
                        </td>

                        <td className="px-6 py-5 align-middle whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${getStatusBadgeClass(
                              program.status
                            )}`}
                          >
                            {program.status || "Puudub"}
                          </span>
                        </td>

                        <td className="px-6 py-5 align-middle whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-sm font-black text-gray-900">
                            <Euro className="w-4 h-4 text-gray-400" />
                            {program.pricePerStudent}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-700 align-middle whitespace-nowrap">
                          {program.durationMinutes} min
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-600 align-middle whitespace-nowrap">
                          {formatDate(program.createdAt)}
                        </td>

                        <td className="px-6 py-5 align-middle text-right whitespace-nowrap">
                          <DeleteProgramButton
                            programId={program.id}
                            programTitle={program.title}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-100 px-6 pb-8">
                <Pagination page={currentPage} totalPages={totalPages} />
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}