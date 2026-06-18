"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface DeleteUserButtonProps {
  userId: number;
  userName: string;
}

const API_URL = process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:5050";

export function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const confirmed = confirm(
      `Kas oled kindel, et soovid kustutada kasutaja "${userName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        startTransition(() => {
          router.refresh();
        });
      } else {
        alert("Kasutaja kustutamine ebaõnnestus.");
      }
    } catch (error) {
      console.error("Viga kasutaja kustutamisel:", error);
      alert("Kasutaja kustutamisel tekkis viga.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className={`inline-flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition ${
        isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <Trash2 className="w-4 h-4" />
      {isPending ? "Kustutan..." : "Kustuta"}
    </button>
  );
}