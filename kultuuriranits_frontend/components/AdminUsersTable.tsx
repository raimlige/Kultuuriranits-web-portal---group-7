"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowUpDown,
  Building2,
  GraduationCap,
  Mail,
  RotateCcw,
  Search,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import type { Person } from "@/models/Person";
import { Pagination } from "@/components/Pagination";
import { DeleteUserButton } from "@/components/DeleteUserButton";
import { ModifyUserButton } from "@/components/ModifyUserButton";

type AdminUsersTableProps = {
  users: Person[];
};

type SortOption =
  | "id-asc"
  | "id-desc"
  | "name-az"
  | "name-za"
  | "email-az"
  | "role"
  | "organization-az";

const USERS_PER_PAGE = 10;
const API_URL = process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:5050";

export function AdminUsersTable({ users }: AdminUsersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [organizationFilter, setOrganizationFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("id-asc");
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  const getFullName = (user: Person) => {
    return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Nimi puudub";
  };

  const getRoleName = (user: Person) => {
    return user.role?.name || "ROLL PUUDUB";
  };

  const getOrganizationName = (user: Person) => {
    return user.organization?.name || "Asutus puudub";
  };

  const adminUsers = users.filter(
    (user) => getRoleName(user).toLowerCase() === "admin"
  ).length;

  const teacherUsers = users.filter(
    (user) => getRoleName(user).toLowerCase() === "teacher"
  ).length;

  const culturalInstitutionUsers = users.filter(
    (user) => getRoleName(user).toLowerCase() === "cultural_institution"
  ).length;

  const organizationOptions = useMemo(() => {
    const map = new Map<number, string>();

    users.forEach((user) => {
      if (user.organization?.id && user.organization?.name) {
        map.set(user.organization.id, user.organization.name);
      }
    });

    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter((user) => {
        const searchableText = [
          user.id,
          user.firstName,
          user.lastName,
          user.email,
          user.personalCode,
          user.role?.name,
          user.organization?.name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchValue);
      });
    }

    if (roleFilter !== "all") {
      result = result.filter(
        (user) => getRoleName(user).toLowerCase() === roleFilter
      );
    }

    if (organizationFilter !== "all") {
      if (organizationFilter === "none") {
        result = result.filter((user) => !user.organization?.id);
      } else {
        result = result.filter(
          (user) => String(user.organization?.id) === organizationFilter
        );
      }
    }

    result.sort((a, b) => {
      if (sortBy === "id-desc") {
        return Number(b.id || 0) - Number(a.id || 0);
      }

      if (sortBy === "name-az") {
        return getFullName(a).localeCompare(getFullName(b));
      }

      if (sortBy === "name-za") {
        return getFullName(b).localeCompare(getFullName(a));
      }

      if (sortBy === "email-az") {
        return (a.email || "").localeCompare(b.email || "");
      }

      if (sortBy === "role") {
        return getRoleName(a).localeCompare(getRoleName(b));
      }

      if (sortBy === "organization-az") {
        return getOrganizationName(a).localeCompare(getOrganizationName(b));
      }

      return Number(a.id || 0) - Number(b.id || 0);
    });

    return result;
  }, [users, search, roleFilter, organizationFilter, sortBy]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const pageParam = Number(searchParams.get("page") || 0);

  const currentPage =
    totalPages > 0
      ? Math.min(Math.max(pageParam, 0), totalPages - 1)
      : 0;

  const startIndex = currentPage * USERS_PER_PAGE;
  const endIndex = startIndex + USERS_PER_PAGE;

  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const hasActiveFilters =
    search ||
    roleFilter !== "all" ||
    organizationFilter !== "all" ||
    sortBy !== "id-asc";

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setOrganizationFilter("all");
    setSortBy("id-asc");
  };

  const handleDeleteUser = async (userId: number) => {
    const confirmed = window.confirm(
      "Kas oled kindel, et soovid selle kasutaja kustutada?"
    );

    if (!confirmed) return;

    try {
      setDeletingUserId(userId);

      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Kasutaja kustutamine ebaõnnestus.");
      }

      router.refresh();
    } catch (error) {
      console.error("Kasutaja kustutamisel tekkis viga:", error);
      alert("Kasutaja kustutamine ebaõnnestus.");
    } finally {
      setDeletingUserId(null);
    }
  };

  const getRoleBadgeClass = (role?: string) => {
    const normalizedRole = role?.toLowerCase();

    if (normalizedRole === "admin") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    if (normalizedRole === "teacher") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (normalizedRole === "cultural_institution") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  const getRoleLabel = (role?: string) => {
    const normalizedRole = role?.toLowerCase();

    if (normalizedRole === "admin") return "Admin";
    if (normalizedRole === "teacher") return "Õpetaja";
    if (normalizedRole === "cultural_institution") return "Kultuuriasutus";

    return role || "Roll puudub";
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <p className="text-sm font-extrabold uppercase tracking-wider text-blue-700 mb-2">
            Administraatori vaade
          </p>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            Kasutajakontod
          </h1>

          <p className="mt-3 text-gray-600 max-w-3xl">
            Siin saad ülevaate süsteemi kasutajatest, nende rollidest ja seotud
            asutustest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
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
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
              Adminid
            </p>

            <p className="mt-3 text-4xl font-black text-red-700">
              {adminUsers}
            </p>
          </div>

          <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5">
              <GraduationCap className="w-6 h-6" />
            </div>

            <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
              Õpetajad
            </p>

            <p className="mt-3 text-4xl font-black text-blue-700">
              {teacherUsers}
            </p>
          </div>

          <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center mb-5">
              <Building2 className="w-6 h-6" />
            </div>

            <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
              Kultuuriasutused
            </p>

            <p className="mt-3 text-4xl font-black text-green-700">
              {culturalInstitutionUsers}
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  Kõik kasutajad
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Kuvan{" "}
                  <span className="font-bold text-gray-900">
                    {filteredUsers.length > 0 ? startIndex + 1 : 0}
                    {"–"}
                    {Math.min(endIndex, filteredUsers.length)}
                  </span>{" "}
                  / {filteredUsers.length} kasutajast.
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

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.6fr_1fr_1fr_1fr] gap-4 mt-5">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

                <input
                  type="text"
                  placeholder="Otsi nime, e-maili, isikukoodi või asutust..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 cursor-pointer"
              >
                <option value="all">Kõik rollid</option>
                <option value="admin">Admin</option>
                <option value="teacher">Õpetaja</option>
                <option value="cultural_institution">Kultuuriasutus</option>
              </select>

              <select
                value={organizationFilter}
                onChange={(event) => setOrganizationFilter(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 cursor-pointer"
              >
                <option value="all">Kõik asutused</option>
                <option value="none">Asutus puudub</option>

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
                  <option value="id-asc">ID kasvavalt</option>
                  <option value="id-desc">ID kahanevalt</option>
                  <option value="name-az">Nimi A-Z</option>
                  <option value="name-za">Nimi Z-A</option>
                  <option value="email-az">E-mail A-Z</option>
                  <option value="role">Roll</option>
                  <option value="organization-az">Asutus A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {users.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-5">
                <Users className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-3">
                Kasutajaid pole veel
              </h3>

              <p className="text-gray-500">
                Kui kasutajad registreeruvad, kuvatakse nende kontod siin.
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-5">
                <Search className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-3">
                Ühtegi kasutajat ei leitud
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
                <table className="min-w-[1000px] w-full border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="w-20 px-6 py-4 text-center text-xs font-black text-gray-500 uppercase tracking-wider">
                        ID
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">
                        Kasutaja
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">
                        E-mail
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">
                        Isikukood
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">
                        Asutus
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">
                        Roll
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-wider">
                        Tegevused
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginatedUsers.map((user) => (
                      <tr
                        key={user.id ?? user.email}
                        className="hover:bg-blue-50/40 transition-colors"
                      >
                        <td className="w-20 px-6 py-5 text-center text-sm font-black text-gray-900 align-middle">
                          {user.id ?? "—"}
                        </td>

                        <td className="px-6 py-5 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                              <UserRound className="w-5 h-5" />
                            </div>

                            <div>
                              <p className="text-sm font-black text-gray-900 leading-snug">
                                {getFullName(user)}
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                Kasutaja #{user.id ?? "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 align-middle">
                          <div className="inline-flex items-center gap-2 text-sm text-gray-700">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{user.email || "E-mail puudub"}</span>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-700 align-middle whitespace-nowrap">
                          {user.personalCode || "Puudub"}
                        </td>

                        <td className="px-6 py-5 align-middle">
                          <p className="max-w-[220px] text-sm font-semibold text-gray-800 leading-relaxed">
                            {getOrganizationName(user)}
                          </p>
                        </td>

                        <td className="px-6 py-5 align-middle whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${getRoleBadgeClass(
                              user.role?.name
                            )}`}
                          >
                            {getRoleLabel(user.role?.name)}
                          </span>
                        </td>

                        <td className="px-6 py-5 align-middle text-right whitespace-nowrap">
                          {user.id ? (
                            <div className="flex items-center justify-end gap-2">
                              <ModifyUserButton userId={Number(user.id)} />

                              <DeleteUserButton
                                userId={Number(user.id)}
                                userName={getFullName(user)}
                              />
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">ID puudub</span>
                          )}
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