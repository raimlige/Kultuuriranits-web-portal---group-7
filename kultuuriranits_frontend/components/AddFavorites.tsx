"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Heart, CheckCircle2 } from "lucide-react";

type AddFavoritesProps = {
  programId: number;
  personId: number;
  apiUrl: string | undefined;
};

export function AddFavorites({
  programId,
  personId,
  apiUrl,
}: AddFavoritesProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  async function handleAddFavorite() {
    if (isSubmitting || isAdded) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`${apiUrl}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          program: { id: programId },
          person: { id: personId },
        }),
      });

      if (!res.ok) {
        throw new Error("Lemmikuks lisamine ebaõnnestus");
      }

      // Muudab südame kohe aktiivseks, ei pea refreshi ootama
      setIsAdded(true);

      // Näitab toast'i
      setShowToast(true);

      setTimeout(() => {
        setToastVisible(true);
      }, 10);

      setTimeout(() => {
        setToastVisible(false);
      }, 1800);

      setTimeout(() => {
        setShowToast(false);
        router.refresh();
      }, 2200);
    } catch (error) {
      console.error("Viga lemmikuks lisamisel:", error);
      setIsAdded(false);
      alert("Lemmikuks lisamine ebaõnnestus.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const toast =
    showToast && typeof document !== "undefined"
      ? createPortal(
          <div
            aria-live="polite"
            className={`fixed top-24 right-6 z-[9999] w-[320px] max-w-[calc(100vw-2rem)] transition-all duration-300 ease-out ${
              toastVisible
                ? "opacity-100 translate-x-0 translate-y-0"
                : "opacity-0 translate-x-8 -translate-y-2"
            }`}
          >
            <div className="bg-white border border-green-100 shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>

              <div>
                <p className="text-sm font-black text-gray-900">
                  Lisatud lemmikutesse!
                </p>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">
                  Programm salvestati edukalt.
                </p>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={handleAddFavorite}
        disabled={isSubmitting || isAdded}
        aria-label="Lisa lemmikuks"
        title="Lisa lemmikuks"
        className={`w-11 h-11 rounded-full border shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-95 disabled:cursor-default ${
          isAdded
            ? "bg-red-50 border-red-100"
            : "bg-white/95 border-gray-200 hover:bg-blue-50 hover:border-blue-200"
        }`}
      >
        <Heart
          className={`w-5 h-5 transition-all ${
            isAdded ? "text-red-500 fill-red-500" : "text-blue-600"
          }`}
        />
      </button>

      {toast}
    </>
  );
}