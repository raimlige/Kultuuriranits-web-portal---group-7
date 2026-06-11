"use client";

import { useRouter } from "next/navigation";

interface AddFeedbackButtonProps {
    programId: number;
    personId: number;
    apiUrl: string | undefined;
}

export function AddFeedback({ programId, personId, apiUrl }: AddFeedbackButtonProps) {
    const router = useRouter();

    const handleAdd = async () => {
        const feedbackText = prompt("Sisesta oma tagasiside:");
        const feedbackRating = parseInt(prompt("Sisesta oma reiting (1-5):") || "0", 10);
        if (!feedbackText || isNaN(feedbackRating)) return;

        try {
            const res = await fetch(`${apiUrl}/feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: feedbackText,
                    rating: feedbackRating,
                    programId: programId,
                    personId: personId
                })
            });

            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error("Viga tagasiside lisamisel:", error);
        }
    };

    return (
        <button onClick={handleAdd}>Lisa tagasiside</button>
    );
}