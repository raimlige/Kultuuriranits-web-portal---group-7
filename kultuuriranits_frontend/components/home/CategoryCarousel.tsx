"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  Landmark,
  Palette,
  Theater,
  Clapperboard,
  Music,
  Library,
  History,
  Atom,
  Leaf,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const categories = [
  { id: 1, name: "Muuseumid", icon: Landmark, color: "bg-orange-100 text-orange-600", query: "muuseumid", },
  { id: 2, name: "Galeriid", icon: Palette, color: "bg-pink-100 text-pink-600", query: "galeriid", },
  { id: 3, name: "Teatrid", icon: Theater, color: "bg-purple-100 text-purple-600", query: "teatrid", },
  { id: 4, name: "Kino", icon: Clapperboard, color: "bg-blue-100 text-blue-600", query: "kino", },
  { id: 5, name: "Kontserdid", icon: Music, color: "bg-indigo-100 text-indigo-600", query: "kontserdid", },
  { id: 6, name: "Raamatukogud", icon: Library, color: "bg-green-100 text-green-600", query: "raamatukogud", },
  { id: 7, name: "Ajalugu", icon: History, color: "bg-amber-100 text-amber-600", query: "ajalugu", },
  { id: 8, name: "Teaduskeskused", icon: Atom, color: "bg-cyan-100 text-cyan-600", query: "teaduskeskused", },
  { id: 9, name: "Loodus", icon: Leaf, color: "bg-emerald-100 text-emerald-600", query: "loodus", },
  { id: 10, name: "Töötoad", icon: Wrench, color: "bg-slate-100 text-slate-600", query: "tootoad", },
];

export function CategoryCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative mb-16 group/carousel">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Avasta kategooriaid
        </h2>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Eelmine kategooria"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 p-3 rounded-full bg-white shadow-xl border border-gray-100 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={scrollNext}
          aria-label="Järgmine kategooria"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 p-3 rounded-full bg-white shadow-xl border border-gray-100 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer active:scale-95"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div ref={emblaRef} className="overflow-hidden -mx-4 px-4 py-4 -my-4">
          <div className="flex pb-4 -ml-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex-[0_0_9rem] min-w-0 pl-4"
              >
                <Link
                  href={`/programs?categoryId=${category.id}&page=0`}
                  className="block h-full group"
                >
                  <div className="flex h-full flex-col items-center gap-3 w-32 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all transform hover:-translate-y-1">
                    <div
                      className={`p-4 rounded-xl ${category.color} group-hover:scale-110 transition-transform`}
                    >
                      <category.icon className="w-8 h-8" />
                    </div>

                    <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors text-center">
                      {category.name}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}