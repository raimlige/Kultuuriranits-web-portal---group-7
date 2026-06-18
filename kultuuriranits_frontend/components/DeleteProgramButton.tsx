"use client"; // Veendu, et faili alguses on see rida!

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface DeleteButtonProps {
    programId: number;
    programTitle: string;
}

export function DeleteProgramButton({ programId, programTitle }: DeleteButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        if (!confirm(`Kas oled kindel, et soovid kustutada programmi "${programTitle}"?`)) {
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/program/${programId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                startTransition(() => {
                    router.refresh();
                });
            } else {
                alert("Kustutamine ebaõnnestus");
            }
        } catch (error) {
            console.error("Viga kustutamisel:", error);
        }
    };

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className={`inline-flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
        >
            <Trash2 className="w-4 h-4" />
            {isPending ? "Kustutan..." : "Kustuta"}
        </button>
    );
}