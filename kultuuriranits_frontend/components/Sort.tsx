"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
  {
    label: "Uuemad enne",
    value: "id,desc",
  },
  {
    label: "Vanemad enne",
    value: "id,asc",
  },
  {
    label: "A-Z (Pealkiri)",
    value: "title,asc",
  },
  {
    label: "Z-A (Pealkiri)",
    value: "title,desc",
  },
  {
    label: "Hind kasvavalt",
    value: "pricePerStudent,asc",
  },
  {
    label: "Hind kahanevalt",
    value: "pricePerStudent,desc",
  },
  {
    label: "Kestus kasvavalt",
    value: "durationMinutes,asc",
  },
  {
    label: "Kestus kahanevalt",
    value: "durationMinutes,desc",
  },
];

const PAGE_SIZES = [1, 2, 3, 4];

export function Sort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSize = Number(searchParams.get("size")) || 3;
  const currentSort = searchParams.get("sort") || "id,desc";

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set(key, value);
    params.set("page", "0");

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-4 py-3 flex flex-col sm:flex-row gap-4 sm:gap-5">
      <div className="min-w-[130px]">
        <label className="block text-xs font-black text-gray-900 uppercase tracking-wide mb-2">
          Tulemusi lehel
        </label>

        <div className="relative">
          <select
            value={currentSize}
            onChange={(e) => updateParams("size", e.target.value)}
            className="w-full appearance-none bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 pr-9 text-sm font-semibold text-gray-700 outline-none cursor-pointer hover:border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size} lehel
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="min-w-[180px]">
        <label className="block text-xs font-black text-gray-900 uppercase tracking-wide mb-2">
          Sorteeri
        </label>

        <div className="relative">
          <select
            value={currentSort}
            onChange={(e) => updateParams("sort", e.target.value)}
            className="w-full appearance-none bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 pr-9 text-sm font-semibold text-gray-700 outline-none cursor-pointer hover:border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}