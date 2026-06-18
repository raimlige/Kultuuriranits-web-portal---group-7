"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Star, CheckCircle2 } from "lucide-react";

interface AddFeedbackProps {
  programId: number;
  personId: number;
  apiUrl: string | undefined;
}

export function AddFeedback({
  programId,
  personId,
  apiUrl,
}: AddFeedbackProps) {
  const router = useRouter();

  const [text, setText] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim() || rating === 0) {
      setError("Palun täida tekstiväli ja vali reiting!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          text: text,
          rating: rating,
          program: { id: programId },
          person: { id: personId },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError(errData.message || "Tagasiside salvestamine ebaõnnestus.");
        return;
      }

      setText("");
      setRating(0);
      setHoveredRating(0);

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
    } catch (err) {
      console.error("Viga tagasiside postitamisel:", err);
      setError("Serveriga ei saadud ühendust.");
    } finally {
      setLoading(false);
    }
  };

  const toast =
    showToast && typeof document !== "undefined"
      ? createPortal(
          <div
            aria-live="polite"
            className={`fixed top-24 right-6 z-[9999] w-[340px] max-w-[calc(100vw-2rem)] transition-all duration-300 ease-out ${
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
                  Tagasiside saadetud!
                </p>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">
                  Sinu tagasiside salvestati edukalt.
                </p>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-extrabold text-gray-700 mb-2">
            Hinnang (1–5 tärni)
          </label>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 hover:scale-110 transition-transform cursor-pointer"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="feedback-text"
            className="block text-sm font-extrabold text-gray-700 mb-2"
          >
            Sinu arvustus
          </label>

          <textarea
            id="feedback-text"
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Kirjuta siia oma kogemusest antud programmiga..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-medium outline-none resize-y"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Tühista
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
          >
            {loading ? "Salvestab..." : "Saada tagasiside"}
          </button>
        </div>
      </form>

      {toast}
    </>
  );
}