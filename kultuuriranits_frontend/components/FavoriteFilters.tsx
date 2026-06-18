"use client";

import { ChevronDown, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
};

interface FavoriteFiltersProps {
  categories: Category[];
}

export function FavoriteFilters({ categories }: FavoriteFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlKeyword = searchParams.get("keyword") || "";
  const urlCategoryId = searchParams.get("categoryId") || "all";

  const [keyword, setKeyword] = useState(urlKeyword);

  const hasActiveFilters = urlKeyword || urlCategoryId !== "all";

  useEffect(() => {
    setKeyword(urlKeyword);
  }, [urlKeyword]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmedKeyword = keyword.trim();

      if (trimmedKeyword === urlKeyword) return;

      const params = new URLSearchParams(searchParams.toString());

      if (trimmedKeyword) {
        params.set("keyword", trimmedKeyword);
      } else {
        params.delete("keyword");
      }

      params.set("page", "0");

      const query = params.toString();
      router.replace(query ? `?${query}` : "/favorites", { scroll: false });
    }, 300);

    return () => clearTimeout(timeout);
  }, [keyword, urlKeyword, searchParams, router]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.set("page", "0");

    const query = params.toString();
    router.push(query ? `?${query}` : "/favorites");
  };

  const clearFilters = () => {
    router.push("/favorites");
  };

  return (
    <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-4 sm:p-5">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-4 items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Otsi lemmikutest..."
            className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-sm font-semibold text-gray-700 outline-none transition-all placeholder:text-gray-400 hover:border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="relative w-full">
          <select
            value={urlCategoryId}
            onChange={(event) => updateParam("categoryId", event.target.value)}
            style={{ backgroundImage: "none" }}
            className="h-12 w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 pl-4 pr-12 text-sm font-bold text-gray-700 shadow-sm outline-none transition-all hover:border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
          >
            <option value="all">Kõik kategooriad</option>

            {categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-2 text-sm font-extrabold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
          >
            <X className="h-4 w-4" />
            Puhasta filtrid
          </button>
        </div>
      )}
    </div>
  );
}