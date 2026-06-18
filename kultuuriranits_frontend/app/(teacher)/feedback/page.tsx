import { Feedback } from "../../../models/Feedback";
import { RemoveFeedback } from "../../../components/RemoveFeedback";
import { FeedbackText } from "../../../components/FeedbackText";
import { FeedbackSort } from "../../../components/FeedbackSort";
import { Pagination } from "../../../components/Pagination";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Star,
  MessageSquareText,
  Building2,
  ClipboardList,
  CalendarDays,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

type SearchParamValue = string | string[] | undefined;

interface SearchParams {
  page?: SearchParamValue;
  size?: SearchParamValue;
  sort?: SearchParamValue;
}

async function getFeedback(): Promise<Feedback[]> {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const res = await fetch(`${API_URL}/feedback`, {
      headers: {
        Cookie: cookieString,
      },
      cache: "no-store",
    });

    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Viga tagasiside pärimisel backendist:", error);
    return [];
  }
}

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

    return res.ok ? await res.json() : null;
  } catch (error) {
    console.error("Viga kasutaja pärimisel backendist:", error);
    return null;
  }
}

function firstParam(value: SearchParamValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeText(value?: string | number | null): string {
  return String(value ?? "").trim().toLowerCase();
}

type FeedbackWithDate = Feedback & {
  createdAt?: string | Date | null;
  created_at?: string | Date | null;
  updatedAt?: string | Date | null;
};

function getFeedbackDate(feedback: FeedbackWithDate) {
  return feedback.createdAt ?? feedback.created_at ?? feedback.updatedAt ?? null;
}

function formatFeedbackDate(feedback: FeedbackWithDate) {
  const value = getFeedbackDate(feedback);

  if (!value) return "Kuupäev puudub";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Kuupäev puudub";
  }

  return new Intl.DateTimeFormat("et-EE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getFeedbackSortValue(
  feedback: FeedbackWithDate,
  field: string
): string | number {
  switch (field) {
    case "rating":
      return Number(feedback.rating ?? 0);

    case "programTitle":
      return normalizeText(feedback.program?.title);

    case "createdAt": {
      const value = getFeedbackDate(feedback);

      if (!value) return Number(feedback.id ?? 0);

      const date = new Date(value);

      return Number.isNaN(date.getTime())
        ? Number(feedback.id ?? 0)
        : date.getTime();
    }

    case "id":
    default:
      return Number(feedback.id ?? 0);
  }
}

function sortFeedback(
  feedback: FeedbackWithDate[],
  sort = "createdAt,desc"
): FeedbackWithDate[] {
  const [field = "createdAt", direction = "desc"] = sort.split(",");

  return [...feedback].sort((a, b) => {
    const aValue = getFeedbackSortValue(a, field);
    const bValue = getFeedbackSortValue(b, field);

    if (typeof aValue === "string" && typeof bValue === "string") {
      return direction === "desc"
        ? bValue.localeCompare(aValue, "et")
        : aValue.localeCompare(bValue, "et");
    }

    return direction === "desc"
      ? Number(bValue) - Number(aValue)
      : Number(aValue) - Number(bValue);
  });
}

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const [currentUser, allFeedback] = await Promise.all([
    getCurrentUser(),
    getFeedback(),
  ]);

  if (!currentUser) {
    redirect("/login");
  }

  const userFeedback = allFeedback.filter((fb) => {
    const feedbackUserId = fb.person?.id;
    return feedbackUserId === currentUser.id;
  });

  const page = Math.max(Number(firstParam(params.page)) || 0, 0);
  const size = Math.max(Number(firstParam(params.size)) || 4, 1);
  const sort = firstParam(params.sort) || "createdAt,desc";

  const sortedFeedback = sortFeedback(userFeedback, sort);

  const totalPages = Math.max(Math.ceil(sortedFeedback.length / size), 1);
  const safePage = Math.min(page, totalPages - 1);
  const startIndex = safePage * size;
  const visibleFeedback = sortedFeedback.slice(startIndex, startIndex + size);

  const resultsText =
    userFeedback.length === 1
      ? "1 tagasiside"
      : `${userFeedback.length} tagasisidet`;

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-3">
            Minu tagasiside
          </h1>

          <p className="max-w-2xl text-base text-gray-600 leading-relaxed">
            Siit leiad kultuuriprogrammidele jäetud hinnangud ja kommentaarid.
          </p>
        </div>

        {userFeedback.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Jäetud tagasiside
              </h2>

              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
                {resultsText}
              </p>
            </div>

            <FeedbackSort />
          </div>
        )}

        {userFeedback.length === 0 ? (
          <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-12 text-center">
            <div className="max-w-xl mx-auto">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                <MessageSquareText className="h-7 w-7" />
              </div>

              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                Tagasisidet veel pole
              </h2>

              <p className="text-gray-500 mb-6">
                Kui jätad mõnele kultuuriprogrammile hinnangu või kommentaari,
                ilmub see siia.
              </p>

              <Link
                href="/programs"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-extrabold text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                Vaata programme
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {visibleFeedback.map((fb) => (
                <article
                  key={fb.id}
                  className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div className="min-w-0">
                        <div className="inline-flex items-center gap-2 mb-3 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-blue-600">
                          <MessageSquareText className="h-4 w-4" />
                          Tagasiside
                        </div>

                        <h3 className="text-xl font-black text-gray-900 tracking-tight leading-snug">
                          {fb.program?.title || "Nimetu programm"}
                        </h3>
                      </div>

                      <div className="shrink-0 rounded-2xl bg-amber-50 border border-amber-100 px-3 py-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-black text-gray-900">
                            {fb.rating || 0}/5
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-blue-600 mb-1">
                          <Building2 className="h-4 w-4" />
                          Korraldaja
                        </div>

                        <p className="text-sm font-bold text-gray-900 leading-snug">
                          {fb.program?.organization?.name ||
                            "Korraldaja puudub"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-blue-600 mb-1">
                          <CalendarDays className="h-4 w-4" />
                          Kuupäev
                        </div>

                        <p className="text-sm font-bold text-gray-900 leading-snug">
                          {formatFeedbackDate(fb)}
                        </p>
                      </div>
                    </div>

                    <div className="mb-5">
                      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-blue-600 mb-2">
                        <ClipboardList className="h-4 w-4" />
                        Kommentaar
                      </div>

                      <FeedbackText text={fb.text} />
                    </div>
                  </div>

                  <div className="flex justify-end pt-5 mt-2 border-t border-gray-100">
                    <RemoveFeedback feedbackId={fb.id} apiUrl={API_URL} />
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10">
              <Pagination page={safePage} totalPages={totalPages} />
            </div>
          </>
        )}
      </section>
    </main>
  );
}