"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";

interface RemoveFeedbackButtonProps {
  feedbackId: number;
  apiUrl: string | undefined;
}

export function RemoveFeedback({
  feedbackId,
  apiUrl,
}: RemoveFeedbackButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRemove = async () => {
    if (!confirm("Kas oled kindel, et soovid selle tagasiside kustutada?")) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/feedback/${feedbackId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        startTransition(() => {
          router.refresh();
        });
      } else {
        alert("Tagasiside eemaldamine ebaõnnestus.");
      }
    } catch (error) {
      console.error("Viga tagasiside eemaldamisel:", error);
      alert("Tagasiside eemaldamisel tekkis viga.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleRemove}
      disabled={isPending}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-extrabold text-red-600 transition-all hover:bg-red-100 hover:text-red-700 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
    >
      <Trash2 className="h-4 w-4" />
      {isPending ? "Kustutan..." : "Kustuta"}
    </button>
  );
}