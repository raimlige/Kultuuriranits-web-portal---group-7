"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  BookOpen,
  Building2,
  MessageSquare,
  Search,
  Star,
} from "lucide-react";

const loginInfoCards = [
  {
    title: "Õpetajatele",
    description: "Leia ja salvesta klassile sobivaid kultuuriprogramme.",
    icon: Search,
  },
  {
    title: "Kultuuriasutustele",
    description: "Halda programme, staatuseid ja tagasisidet ühest kohast.",
    icon: Building2,
  },
  {
    title: "Programmid ühes kohas",
    description: "Sirvi kultuuriprogramme mugavalt ühest kesksest keskkonnast.",
    icon: BookOpen,
  },
  {
    title: "Tagasiside",
    description: "Vaata ja jäta programmidele hinnanguid ning kommentaare.",
    icon: MessageSquare,
  },
  {
    title: "Lemmikud",
    description: "Salvesta huvipakkuvad programmid hilisemaks vaatamiseks.",
    icon: Star,
  },
];

export function LoginInfoCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4500);

    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <div className="mt-8 max-w-xl">
      <div ref={emblaRef} className="overflow-hidden -mx-2 px-2 py-2">
        <div className="flex -ml-4">
          {loginInfoCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="flex-[0_0_100%] min-w-0 pl-4"
              >
                <div className="h-full rounded-3xl bg-white border border-gray-200 shadow-sm p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <p className="text-sm font-black text-gray-900">
                    {card.title}
                  </p>

                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {loginInfoCards.map((card, index) => (
          <button
            key={card.title}
            type="button"
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Näita kaarti: ${card.title}`}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              index === selectedIndex
                ? "w-8 bg-blue-600"
                : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}