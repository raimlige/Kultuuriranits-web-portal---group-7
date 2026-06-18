"use client";

import { ArrowUpDown, ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function FeedbackSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "createdAt,desc";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("sort", value);
    params.set("page", "0");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-blue-600 shadow-sm">
        <ArrowUpDown className="h-5 w-5" />
      </div>

      <div className="relative">
        <select
          value={currentSort}
          onChange={(event) => handleChange(event.target.value)}
          className="h-11 min-w-[210px] appearance-none rounded-2xl border border-gray-200 bg-white pl-5 pr-11 text-sm font-bold text-gray-700 shadow-sm outline-none transition-all hover:border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
        >
          <option value="createdAt,desc">Uuemad ees</option>
          <option value="createdAt,asc">Vanemad ees</option>
          <option value="rating,desc">Kõrgem hinnang ees</option>
          <option value="rating,asc">Madalam hinnang ees</option>
          <option value="programTitle,asc">Programmi nimi A–Z</option>
          <option value="programTitle,desc">Programmi nimi Z–A</option>
        </select>

        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      </div>
    </div>
  );
}