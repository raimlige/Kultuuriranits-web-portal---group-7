"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FeedbackTextProps {
  text?: string | null;
}

export function FeedbackText({ text }: FeedbackTextProps) {
  const [expanded, setExpanded] = useState(false);

  const feedbackText = text?.trim() || "Kommentaari ei lisatud.";
  const isLong = feedbackText.length > 220;

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <p
        className={`text-sm font-medium text-gray-600 leading-relaxed ${
          !expanded && isLong ? "line-clamp-4" : ""
        }`}
      >
        {feedbackText}
      </p>

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-3 inline-flex items-center gap-1 text-sm font-extrabold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
        >
          {expanded ? (
            <>
              Näita vähem
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Loe edasi
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}