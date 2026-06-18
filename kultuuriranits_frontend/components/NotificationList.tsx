"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Notification } from "@/models/Notification";
import { Pagination } from "@/components/Pagination";
import {
  BellRing,
  CheckCircle2,
  Clock3,
  Inbox,
  MessageSquareText,
  Trash2,
} from "lucide-react";

interface NotificationListProps {
  initialNotifications: Notification[];
  currentStatusFilter: "unread" | "read";
  showMarkAsReadButton?: boolean;
  emptyMessage?: string;
}

const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

function formatNotificationDate(value?: string) {
  if (!value) return "Kuupäev puudub";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Kuupäev puudub";
  }

  return `${date.toLocaleDateString("et-EE")} ${date.toLocaleTimeString(
    "et-EE",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  )}`;
}

export default function NotificationList({
  initialNotifications,
  currentStatusFilter,
  showMarkAsReadButton = false,
  emptyMessage = "Teateid pole.",
}: NotificationListProps) {
  const searchParams = useSearchParams();

  const [notifications, setNotifications] = useState(initialNotifications);
  const [pendingId, setPendingId] = useState<number | null>(null);

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const displayedNotifications = notifications.filter(
    (notification) => notification.status === currentStatusFilter
  );

  const page = Math.max(Number(searchParams.get("page")) || 0, 0);
  const size = Math.max(Number(searchParams.get("size")) || 4, 1);

  const totalPages = Math.max(
    Math.ceil(displayedNotifications.length / size),
    1
  );

  const safePage = Math.min(page, totalPages - 1);
  const startIndex = safePage * size;

  const visibleNotifications = displayedNotifications.slice(
    startIndex,
    startIndex + size
  );

  const isUnreadView = currentStatusFilter === "unread";

  const handleMarkAsRead = async (notification: Notification) => {
    try {
      setPendingId(notification.id);

      const updatedNotification = {
        ...notification,
        status: "read",
      };

      const res = await fetch(`${API_URL}/notification/${notification.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedNotification),
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setNotifications(data);

        window.dispatchEvent(
          new CustomEvent("notifications-updated", {
            detail: {
              unreadDelta: -1,
            },
          })
        );
      }
    } catch (error) {
      console.error("Viga loetuks märkimisel:", error);
    } finally {
      setPendingId(null);
    }
  };

  const handleValueDelete = async (notification: Notification) => {
    try {
      setPendingId(notification.id);

      const res = await fetch(`${API_URL}/notification/${notification.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setNotifications(data);

        if (notification.status === "unread") {
          window.dispatchEvent(
            new CustomEvent("notifications-updated", {
              detail: {
                unreadDelta: -1,
              },
            })
          );
        }
      }
    } catch (error) {
      console.error("Viga teavituse kustutamisel:", error);
    } finally {
      setPendingId(null);
    }
  };

  if (displayedNotifications.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-black bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
          <Inbox className="h-7 w-7" />
        </div>

        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Teateid pole
        </h2>

        <p className="text-sm font-medium text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        {visibleNotifications.map((notification) => {
          const isPending = pendingId === notification.id;

          return (
            <article
              key={notification.id}
              className="group rounded-3xl border-2 border-black bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-4 min-w-0">
                  <div
                    className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
                      isUnreadView
                        ? "border-blue-100 bg-blue-50 text-blue-600"
                        : "border-gray-200 bg-gray-50 text-gray-500"
                    }`}
                  >
                    {isUnreadView ? (
                      <BellRing className="h-6 w-6" />
                    ) : (
                      <CheckCircle2 className="h-6 w-6" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl font-black text-gray-900 tracking-tight">
                        {notification.title || "Süsteemne teade"}
                      </h3>

                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${
                          isUnreadView
                            ? "bg-blue-50 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {isUnreadView ? "Uus" : "Loetud"}
                      </span>
                    </div>

                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-400">
                      <Clock3 className="h-4 w-4" />
                      {formatNotificationDate(notification.createdAt)}
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-blue-600">
                        <MessageSquareText className="h-4 w-4" />
                        Sisu
                      </div>

                      <p className="text-sm font-medium leading-relaxed text-gray-700">
                        {notification.message || "Teavituse sisu puudub."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap justify-end gap-3 lg:pt-12">
                  {showMarkAsReadButton && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(notification)}
                      disabled={isPending}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {isPending ? "Märgin..." : "Märgi loetuks"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleValueDelete(notification)}
                    disabled={isPending}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-extrabold text-red-600 transition-all hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isPending
                      ? "Kustutan..."
                      : currentStatusFilter === "read"
                      ? "Kustuta ajaloost"
                      : "Kustuta"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-10">
          <Pagination page={safePage} totalPages={totalPages} />
        </div>
      )}
    </>
  );
}