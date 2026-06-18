"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Heart, CheckCircle2 } from "lucide-react";

type RemoveFavoritesProps = {
  favoriteId: number;
  apiUrl: string | undefined;
};

export function RemoveFavorites({
  favoriteId,
  apiUrl,
}: RemoveFavoritesProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  async function handleRemoveFavorite() {
    if (isSubmitting || isRemoved) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`${apiUrl}/favorites/${favoriteId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Lemmikust eemaldamine ebaõnnestus");
      }

      setIsRemoved(true);

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
      console.error("Viga lemmikust eemaldamisel:", error);
      setIsRemoved(false);
      alert("Lemmikust eemaldamine ebaõnnestus.");
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
            <div className="bg-white border border-blue-100 shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>

              <div>
                <p className="text-sm font-black text-gray-900">
                  Eemaldatud lemmikutest!
                </p>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">
                  Programm eemaldati sinu lemmikutest.
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
        onClick={handleRemoveFavorite}
        disabled={isSubmitting || isRemoved}
        aria-label="Eemalda lemmikutest"
        title="Eemalda lemmikutest"
        className={`w-11 h-11 rounded-full border shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-95 disabled:cursor-default ${
          isRemoved
            ? "bg-white/95 border-gray-200 hover:bg-blue-50 hover:border-blue-200"
            : "bg-red-50 border-red-100 hover:bg-red-100 hover:border-red-200"
        }`}
      >
        <Heart
          className={`w-5 h-5 transition-all ${
            isRemoved ? "text-blue-600" : "text-red-500 fill-red-500"
          }`}
        />
      </button>

      {toast}
    </>
  );
}