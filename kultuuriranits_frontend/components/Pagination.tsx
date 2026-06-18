"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const changePage = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      const params = new URLSearchParams(searchParams.toString());

      params.set("page", String(newPage));

      router.push(`?${params.toString()}`);
    }
  };

  const isFirstPage = page === 0;
  const isLastPage = page + 1 >= totalPages;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-12 flex justify-center">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          disabled={isFirstPage}
          onClick={() => changePage(page - 1)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-sm border transition-all ${
            isFirstPage
              ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed opacity-60"
              : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 cursor-pointer active:scale-95"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Eelmine
        </button>

        <div className="min-w-[88px] text-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
          <span className="text-sm font-black text-gray-900">
            {page + 1}
          </span>
          <span className="text-sm font-semibold text-gray-400">
            {" "}
            / {totalPages}
          </span>
        </div>

        <button
          type="button"
          disabled={isLastPage}
          onClick={() => changePage(page + 1)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-sm border transition-all ${
            isLastPage
              ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed opacity-60"
              : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 cursor-pointer active:scale-95"
          }`}
        >
          Järgmine
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}