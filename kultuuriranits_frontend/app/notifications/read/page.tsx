import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Notification } from "@/models/Notification";
import NotificationList from "@/components/NotificationList";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

async function getNotifications(): Promise<Notification[]> {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const res = await fetch(`${API_URL}/notification`, {
      headers: {
        Cookie: cookieString,
      },
      cache: "no-store",
    });

    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Viga teavituste pärimisel serveris:", error);
    return [];
  }
}

async function getCurrentUser(): Promise<{ id: number } | null> {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const res = await fetch(`${API_URL}/me`, {
      headers: {
        Cookie: cookieString,
      },
      cache: "no-store",
    });

    if (res.ok) return await res.json();

    return null;
  } catch (error) {
    return null;
  }
}

export default async function ReadNotificationsPage() {
  const [currentUser, notifications] = await Promise.all([
    getCurrentUser(),
    getNotifications(),
  ]);

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wider text-blue-600 mb-2">
              Arhiiv
            </p>

            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Loetud teated
            </h1>

            <p className="text-sm font-medium text-gray-500 mt-2">
              Siin kuvatakse teavitused, mille oled märkinud loetuks.
            </p>
          </div>

          <Link
            href="/notifications"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-5 py-3 text-sm font-extrabold text-blue-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
            Uued teated
          </Link>
        </div>

        <NotificationList
          key="read-list"
          initialNotifications={notifications}
          currentStatusFilter="read"
          showMarkAsReadButton={false}
          emptyMessage="Siin kuvatakse teavitused, mille oled märkinud loetuks."
        />
      </section>
    </main>
  );
}