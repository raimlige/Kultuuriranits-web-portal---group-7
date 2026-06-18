"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

const counties = [
  "Kõik piirkonnad",
  "Harjumaa",
  "Hiiumaa",
  "Ida-Virumaa",
  "Jõgevamaa",
  "Järvamaa",
  "Läänemaa",
  "Lääne-Virumaa",
  "Põlvamaa",
  "Pärnumaa",
  "Raplamaa",
  "Saaremaa",
  "Tartumaa",
  "Valgamaa",
  "Viljandimaa",
  "Võrumaa",
];

const targetGroups = [
  "Vali...",
  "Lasteaed",
  "1. - 3. klass",
  "4. - 6. klass",
  "7. - 9. klass",
  "Gümnaasium",
];


const prices = [
  { label: "Kõik hinnad", min: undefined, max: undefined },
  { label: "Tasuta", max: 0 },
  { label: "Kuni 5€", max: 5 },
  { label: "Kuni 10€", max: 10 },
  { label: "Üle 10€", min: 10 },
];

const durations = [
  { label: "Kõik", min: undefined, max: undefined },
  { label: "Kuni 45 min", max: 45 },
  { label: "45-90 min", min: 45, max: 90 },
  { label: "Üle 90 min", min: 90 },
];

const groupSizes = [
  { label: "Kõik suurused", min: undefined, max: undefined },
  { label: "Kuni 15 õpilast", max: 15 },
  { label: "Kuni 30 õpilast", max: 30 },
  { label: "Üle 30 õpilase", min: 31 },
];

interface AdvancedFiltersProps {
  categories: {
    id: number;
    name: string;
  }[];

  organizations: {
    id: number;
    name: string;
    address?: string;
    city?: string;
    state?: string;
    type?: string;
    phone?: string;
    email?: string;
  }[];
}

export function AdvancedFilters({
  categories,
  organizations,
}: AdvancedFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isOpen = searchParams.get("filters") === "open";
  //const selectedLanguage = searchParams.get("language")?.split(",").filter(Boolean) || [];

  const pushParams = (params: URLSearchParams) => {
    params.set("page", "0");

    const query = params.toString();
    router.push(query ? `/programs?${query}` : "/programs");
  };

  const toggleFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (isOpen) {
      params.delete("filters");
    } else {
      params.set("filters", "open");
    }

    const query = params.toString();
    router.push(query ? `/programs?${query}` : "/programs");
  };

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (
      value &&
      value !== "Vali..." &&
      value !== "Kõik piirkonnad" &&
      value !== "Kõik toimumiskohad" &&
      value !== "Kõik hinnad" &&
      value !== "Kõik" &&
      value !== "Kõik suurused"
    ) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    pushParams(params);
  };

  const updateCheckbox = (key: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());

    if (checked) {
      params.set(key, "true");
    } else {
      params.delete(key);
    }

    pushParams(params);
  };

 const updateLanguage = (language: string, checked: boolean) => {
  const params = new URLSearchParams(searchParams.toString());

  const currentLanguages = params.getAll("languages");

  let newLanguages: string[];

  if (checked) {
    newLanguages = [...currentLanguages, language];
  } else {
    newLanguages = currentLanguages.filter((item) => item !== language);
  }

  params.delete("languages");

  newLanguages.forEach((lang) => {
    params.append("languages", lang);
  });

  pushParams(params);
};

  const updateRange = (
    minKey: string,
    maxKey: string,
    selected?: {
      label: string;
      min?: number;
      max?: number;
    }
  ) => {
    if (!selected) return;

    const params = new URLSearchParams(searchParams.toString());

    params.delete(minKey);
    params.delete(maxKey);

    if (selected.min !== undefined) {
      params.set(minKey, String(selected.min));
    }

    if (selected.max !== undefined) {
      params.set(maxKey, String(selected.max));
    }

    pushParams(params);
  };

  const clearFilters = () => {
    router.push("/programs");
  };

  const getRangeLabel = (
    items: {
      label: string;
      min?: number;
      max?: number;
    }[],
    minKey: string,
    maxKey: string,
    fallback: string
  ) => {
    const minValue = searchParams.get(minKey);
    const maxValue = searchParams.get(maxKey);

    const selected = items.find((item) => {
      const itemMin = item.min !== undefined ? String(item.min) : null;
      const itemMax = item.max !== undefined ? String(item.max) : null;

      return itemMin === minValue && itemMax === maxValue;
    });

    return selected?.label || fallback;
  };

  const priceLabel = getRangeLabel(
    prices,
    "minPricePerStudent",
    "maxPricePerStudent",
    "Kõik hinnad"
  );

  const durationLabel = getRangeLabel(
    durations,
    "minDurationMinutes",
    "maxDurationMinutes",
    "Kõik"
  );

  const groupLabel = getRangeLabel(
    groupSizes,
    "minGroupSize",
    "maxGroupSize",
    "Kõik suurused"
  );

  return (
    <>
      <button
        type="button"
        onClick={toggleFilters}
        className="inline-flex h-14 items-center justify-center gap-2 px-4 text-sm font-extrabold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap"
      >
        <SlidersHorizontal className="w-4 h-4" />
        {isOpen ? "Sulge täpsem otsing" : "Ava täpsem otsing"}
      </button>

      {isOpen && (
        <div className="md:col-span-2 mt-2 bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-8">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              Täpsem otsing
            </h2>

            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-extrabold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
            >
              Puhasta filtrid
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-900">
                Kategooriad
              </label>

              <select
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={searchParams.get("categoryId") || ""}
                onChange={(e) => updateParam("categoryId", e.target.value)}
              >
                <option value="">Vali...</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-900">
                Sihtgrupp
              </label>

              <select
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={searchParams.get("targetGroups") || "Vali..."}
                onChange={(e) => 
                 
                  updateParam("targetGroups", e.target.value)
                }
              >
                {targetGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-900">
                Kuupäev
              </label>

              <input
                type="date"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={searchParams.get("date") || ""}
                onChange={(e) => updateParam("date", e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-900">
                Maakond
              </label>

              <select
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={searchParams.get("county") || "Kõik piirkonnad"}
                onChange={(e) => updateParam("county", e.target.value)}
              >
                {counties.map((county) => (
                  <option key={county} value={county}>
                    {county}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-bold text-gray-900">
                Toimumiskoht
              </label>

              <select
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={searchParams.get("organizationId") || ""}
                onChange={(e) => updateParam("organizationId", e.target.value)}
              >
                <option value="">Kõik toimumiskohad</option>

                {organizations.map((organization) => (
                  <option key={organization.id} value={organization.id}>
                    {organization.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-900">
                Hind õpilase kohta
              </label>

              <select
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={priceLabel}
                onChange={(e) => {
                  const selected = prices.find(
                    (price) => price.label === e.target.value
                  );

                  updateRange(
                    "minPricePerStudent",
                    "maxPricePerStudent",
                    selected
                  );
                }}
              >
                {prices.map((price) => (
                  <option key={price.label} value={price.label}>
                    {price.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-900">
                Kestus
              </label>

              <select
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={durationLabel}
                onChange={(e) => {
                  const selected = durations.find(
                    (duration) => duration.label === e.target.value
                  );

                  updateRange(
                    "minDurationMinutes",
                    "maxDurationMinutes",
                    selected
                  );
                }}
              >
                {durations.map((duration) => (
                  <option key={duration.label} value={duration.label}>
                    {duration.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-900">
                Grupi suurus
              </label>

              <select
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={groupLabel}
                onChange={(e) => {
                  const selected = groupSizes.find(
                    (groupSize) => groupSize.label === e.target.value
                  );

                  updateRange("minGroupSize", "maxGroupSize", selected);
                }}
              >
                {groupSizes.map((size) => (
                  <option key={size.label} value={size.label}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <p className="mb-4 text-sm font-bold text-gray-900">
              Programmi keel
            </p>

            <div className="flex flex-wrap gap-4">
              {["Eesti", "Inglise", "Vene", "Muu"].map((language) => (
                <label
                  key={language}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer"
                >
                  <input
                      type="checkbox"
                      checked={searchParams.getAll("languages").includes(language)}
                      onChange={(e) =>
                        updateLanguage(language, e.target.checked)
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />

                  {language}
                </label>
              ))}
            </div>
          </div>
          <div className="mt-8 border-t border-gray-100 pt-6">
            <p className="mb-4 text-sm font-bold text-gray-900">
              Ligipääsetavus
            </p>
          <div className="mt-6 flex flex-wrap gap-5">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={searchParams.get("wheelchair") === "true"}
                onChange={(e) => updateCheckbox("wheelchair", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Ligipääs ratastooliga
            </label>

            <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={searchParams.get("hev") === "true"}
                onChange={(e) =>
                  updateCheckbox("hev", e.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Sobib erivajadustega õpilastele
            </label>

            <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={searchParams.get("outdoor") === "true"}
                onChange={(e) => updateCheckbox("outdoor", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Välitingimustes
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={searchParams.get("lak") === "true"}
                onChange={(e) => updateCheckbox("lak", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              LAK
            </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
}