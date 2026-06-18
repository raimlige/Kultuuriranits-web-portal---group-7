"use client";

import { ChevronDown, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const PAGE_SIZES = [3, 6, 9, 12];

export function MaterialSearchControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlKeyword = searchParams.get("keyword") || "";
  const currentSize = Number(searchParams.get("size")) || 6;

  const [keyword, setKeyword] = useState(urlKeyword);

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

      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [keyword, urlKeyword, searchParams, router, pathname]);

  const updateSize = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("size", value);
    params.set("page", "0");

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("keyword");
    params.set("page", "0");

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-4 sm:p-5">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-4 items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Otsi õppematerjali..."
            className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-11 text-sm font-semibold text-gray-700 outline-none transition-all placeholder:text-gray-400 hover:border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {urlKeyword && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-blue-600 cursor-pointer"
              aria-label="Puhasta otsing"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <label className="block">
          <span className="sr-only">Tulemusi lehel</span>

          <div className="relative">
            <select
              value={currentSize}
              onChange={(event) => updateSize(event.target.value)}
              style={{ backgroundImage: "none" }}
              className="h-12 w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 pl-4 pr-12 text-sm font-bold text-gray-700 shadow-sm outline-none transition-all hover:border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size} lehel
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>
        </label>
      </div>
    </div>
  );
}