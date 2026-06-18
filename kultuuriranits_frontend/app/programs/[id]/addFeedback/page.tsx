import Link from "next/link";
import { ChevronLeft, MessageSquare } from "lucide-react";
import { AddFeedback } from "@/components/AddFeedback";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

async function getCurrentUser(): Promise<{ id: number } | null> {
    try {
        const cookieStore = await cookies();
        const cookieString = cookieStore.toString();
        const res = await fetch(`${API_URL}/me`, {
            headers: {
                Cookie: cookieString,
            },
            cache: "no-store",
        });

        if (res.ok) {
            return await res.json();
        }
        return null;
    } catch (error) {
        console.error("Viga sisselogitud kasutaja tuvastamisel:", error);
        return null;
    }
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AddFeedbackPage({ params }: PageProps) {
    const { id } = await params;
    const currentUser = await getCurrentUser();
    const currentUserId = currentUser ? currentUser.id : null;

    if (!currentUserId) {
        redirect("/login");
    }
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Tagasi nupp */}
            <Link
                href={`/programs/${id}`}
                className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 mb-8 group transition-colors duration-200"
            >
                <ChevronLeft className="w-5 h-5 mr-1.5 transition-transform duration-200 group-hover:-translate-x-1 text-gray-400 group-hover:text-gray-900" />
                Tagasi programmi juurde
            </Link>

            {/* Vormi ümbris */}
            <div className="bg-white rounded-2xl border border-gray-150 shadow-sm p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-gray-900">
                            Lisa uus tagasiside
                        </h1>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">
                            Sinu hinnang salvestatakse reaalajas ning on nähtav ka teistele õpetajatele.
                        </p>
                    </div>
                </div>

                {!currentUserId ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm font-semibold rounded-xl text-center">
                        Tagasiside jätmiseks pead olema sisse logitud!
                    </div>
                ) : (
                    <AddFeedback programId={parseInt(id, 10)} personId={currentUserId} apiUrl={API_URL} />
                )}
            </div>
        </div>
    );
}