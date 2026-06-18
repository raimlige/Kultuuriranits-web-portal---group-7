"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

interface ModifyUserButtonProps {
  userId: number;
}

export function ModifyUserButton({ userId }: ModifyUserButtonProps) {
  return (
    <Link
      href={`/admin/users/${userId}`}
      className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 px-4 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50 transition cursor-pointer"
    >
      <Pencil className="w-4 h-4" />
      Muuda
    </Link>
  );
}