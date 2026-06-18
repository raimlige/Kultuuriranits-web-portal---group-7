"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Building2,
  Eye,
  EyeOff,
  IdCard,
  Mail,
  Save,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { Person } from "@/models/Person";
import { Organization } from "@/models/Organization";

interface UserEditFormProps {
  user: Person;
  organizations: Organization[];
}

const API_URL = process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:5050";

const roleOptions = [
  { id: 1, name: "TEACHER", label: "Õpetaja" },
  { id: 2, name: "CULTURAL_INSTITUTION", label: "Kultuuriasutus" },
  { id: 3, name: "ADMIN", label: "Admin" },
];

export default function UserEditForm({
  user,
  organizations,
}: UserEditFormProps) {
  const router = useRouter();

  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState(user.password || "");
  const [roleId, setRoleId] = useState(user.role?.id || 1);
  const [organizationId, setOrganizationId] = useState(
    user.organization?.id ? String(user.organization.id) : ""
  );
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const selectedRole = roleOptions.find((role) => role.id === roleId);

  const fullName =
    `${firstName || ""} ${lastName || ""}`.trim() || "Nimi puudub";

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Kas oled kindel, et soovid kasutaja "${fullName}" kustutada?`
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/users/${user.id}`, {
        method: "DELETE",
        credentials: "include",
        keepalive: true,
      });

      if (res.ok) {
        alert("Kasutaja edukalt kustutatud!");
        router.push("/admin/users");
        router.refresh();
      } else {
        const errorText = await res.text();
        alert(`Kustutamine ebaõnnestus: ${errorText || "Viga serveris"}`);
      }
    } catch (error) {
      console.error("Viga kustutamisel:", error);
      alert("Süsteemne viga kustutamisel.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    const updatedUser = {
      ...user,
      firstName,
      lastName,
      email,
      password,
      role: {
        ...user.role,
        id: roleId,
        name: selectedRole?.name || user.role?.name,
      },
      organization: organizationId
        ? {
            ...user.organization,
            id: Number(organizationId),
          }
        : null,
    };

    try {
      const res = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedUser),
      });

      if (res.ok) {
        alert("Andmed edukalt uuendatud!");
        router.refresh();
      } else {
        const errorText = await res.text();
        alert(`Uuendamine ebaõnnestus: ${errorText || "Viga serveris"}`);
      }
    } catch (error) {
      console.error("Viga uuendamisel:", error);
      alert("Süsteemne viga andmete salvestamisel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <UserRound className="w-7 h-7" />
          </div>

          <div>
            <p className="text-sm font-extrabold uppercase tracking-wider text-blue-700 mb-1">
              Kasutaja #{user.id}
            </p>

            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              {fullName}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Muuda kasutaja andmeid, rolli ja seotud organisatsiooni.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-extrabold text-red-700 hover:bg-red-100 hover:border-red-300 transition-all cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          Kustuta kasutaja
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-black text-gray-900 mb-2">
            Eesnimi
          </label>

          <div className="relative">
            <UserRound className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
              className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-black text-gray-900 mb-2">
            Perekonnanimi
          </label>

          <div className="relative">
            <UserRound className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

            <input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
              className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-black text-gray-900 mb-2">
            E-mail
          </label>

          <div className="relative">
            <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-black text-gray-900 mb-2">
            Parool
          </label>

          <div className="relative">
            <ShieldCheck className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-12 text-sm text-gray-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition cursor-pointer"
              aria-label={showPassword ? "Peida parool" : "Näita parooli"}
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
          <label className="block text-sm font-black text-gray-900 mb-2">
            Isikukood
          </label>

          <div className="relative">
            <IdCard className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

            <input
              type="text"
              value={user.personalCode || ""}
              disabled
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm text-gray-500 outline-none cursor-not-allowed"
            />
          </div>

          <p className="mt-2 text-xs text-gray-400">
            Isikukoodi ei saa selles vaates muuta.
          </p>
        </div>

        <div>
          <label className="block text-sm font-black text-gray-900 mb-2">
            Roll
          </label>

          <div className="relative">
            <ShieldCheck className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

            <select
              value={roleId}
              onChange={(event) => setRoleId(Number(event.target.value))}
              className="w-full appearance-none rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm font-semibold text-gray-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 cursor-pointer"
            >
              {roleOptions.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.label} ({role.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-black text-gray-900 mb-2">
            Organisatsioon
          </label>

          <div className="relative">
            <Building2 className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

            <select
              value={organizationId}
              onChange={(event) => setOrganizationId(event.target.value)}
              className="w-full appearance-none rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm font-semibold text-gray-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 cursor-pointer"
            >
              <option value="">Asutus puudub</option>

              {organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />

        <div>
          <p className="text-sm font-black text-amber-800">
            Kontrolli muudatused enne salvestamist üle
          </p>

          <p className="text-sm text-amber-700 mt-1">
            Rolli või organisatsiooni muutmine võib muuta seda, milliseid vaateid
            kasutaja näeb.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin/users")}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-extrabold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Tagasi
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-extrabold text-white hover:bg-blue-700 transition-all shadow-sm cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {loading ? "Salvestab..." : "Salvesta muudatused"}
        </button>
      </div>
    </form>
  );
}