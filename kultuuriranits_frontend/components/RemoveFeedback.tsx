"use client";

import { useRouter } from "next/navigation";

interface RemoveFeedbackButtonProps {
    feedbackId: number;
    apiUrl: string | undefined;
}

export function RemoveFeedback({ feedbackId, apiUrl }: RemoveFeedbackButtonProps) {
    const router = useRouter();

    const handleRemove = async () => {
        try {
            const res = await fetch(`${apiUrl}/feedback/${feedbackId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert("Tagasiside eemaldamine ebaõnnestus.");
            }
        } catch (error) {
            console.error("Viga tagasiside eemaldamisel:", error);
        }
    };

    return (
        <button
            onClick={handleRemove}
            style={{
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer"
            }}
        >
            Kustuta tagasisidest
        </button>
    );
}
