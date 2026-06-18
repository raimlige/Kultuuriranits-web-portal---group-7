"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlKeyword = searchParams.get("keyword") || "";

  // Algväärtus URL-ist
  const [keyword, setKeyword] = useState(urlKeyword);

  // Kui URL-is olev keyword muutub näiteks back/forward nupuga,
  // sünkime inputi sellega.
  useEffect(() => {
    setKeyword(urlKeyword);
  }, [urlKeyword]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmedKeyword = keyword.trim();

      // Väga oluline:
      // Kui keyword pole muutunud, ära tee router.replace'i.
      // Nii ei nullita page=1 tagasi page=0 peale.
      if (trimmedKeyword === urlKeyword) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());

      if (trimmedKeyword) {
        params.set("keyword", trimmedKeyword);
      } else {
        params.delete("keyword");
      }

      // Page nullitakse ainult siis, kui otsingusõna muutus.
      params.set("page", "0");

      router.replace(`?${params.toString()}`, {
        scroll: false,
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [keyword, urlKeyword, searchParams, router]);

  return (
    <div className="w-full">
      <div className="flex items-center w-full rounded-full border border-gray-300 bg-white px-5 py-3 shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
        <span className="mr-3 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>

        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Otsi programmi..."
          className="w-full bg-transparent text-base text-gray-800 placeholder:text-gray-400 outline-none"
        />
      </div>
    </div>
  );
}