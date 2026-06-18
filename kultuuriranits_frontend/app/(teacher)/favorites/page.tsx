import { Favorites } from "../../../models/Favorites";
import { Program } from "../../../models/Program";
import { RemoveFavorites } from "../../../components/RemoveFavorites";
import { ProgramCard } from "../../../components/ProgramCard";
import { FavoriteFilters } from "../../../components/FavoriteFilters";
import { Sort } from "../../../components/Sort";
import { Pagination } from "../../../components/Pagination";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

type SearchParamValue = string | string[] | undefined;

type Category = {
  id: number;
  name: string;
};

interface SearchParams {
  keyword?: SearchParamValue;
  page?: SearchParamValue;
  size?: SearchParamValue;
  sort?: SearchParamValue;
  categoryId?: SearchParamValue;
}

async function getFavorites(): Promise<Favorites[]> {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const res = await fetch(`${API_URL}/favorites`, {
      headers: {
        Cookie: cookieString,
      },
      cache: "no-store",
    });

    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Viga lemmikute pärimisel:", error);
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
    console.error("Viga kasutaja pärimisel:", error);
    return null;
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/category`, {
      cache: "no-store",
    });

    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Viga kategooriate pärimisel:", error);
    return [];
  }
}

function firstParam(value: SearchParamValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function normalize(value?: string | number | null): string {
  return String(value ?? "").trim().toLowerCase();
}

function includesText(value: string | number | null | undefined, keyword: string) {
  return normalize(value).includes(keyword);
}

function matchesFavorite(favorite: Favorites, params: SearchParams): boolean {
  const program = favorite.program;

  if (!program) return false;

  const keyword = normalize(firstParam(params.keyword));
  const categoryId = firstParam(params.categoryId);

  if (
    keyword &&
    ![
      program.title,
      program.shortDescription,
      program.description,
      program.location,
      program.address,
      program.county,
      program.category?.name,
      program.organization?.name,
    ].some((value) => includesText(value, keyword))
  ) {
    return false;
  }

  if (categoryId && String(program.category?.id ?? "") !== categoryId) {
    return false;
  }

  return true;
}

function getSortValue(program: Program, field: string): string | number {
  switch (field) {
    case "title":
      return normalize(program.title);

    case "pricePerStudent":
      return Number(program.pricePerStudent ?? 0);

    case "durationMinutes":
      return Number(program.durationMinutes ?? 0);

    case "id":
    default:
      return Number(program.id ?? 0);
  }
}

function sortFavorites(favorites: Favorites[], sort = "id,desc"): Favorites[] {
  const [field = "id", direction = "desc"] = sort.split(",");

  return [...favorites].sort((a, b) => {
    const aValue = getSortValue(a.program, field);
    const bValue = getSortValue(b.program, field);

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

export default async function GetFavoritesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const [currentUser, favorites, categories] = await Promise.all([
    getCurrentUser(),
    getFavorites(),
    getCategories(),
  ]);

  if (!currentUser) {
    redirect("/login");
  }

  const page = Math.max(Number(firstParam(params.page)) || 0, 0);
  const size = Math.max(Number(firstParam(params.size)) || 3, 1);
  const sort = firstParam(params.sort) || "id,desc";

  const favoritesWithPrograms = favorites.filter((favorite) => favorite.program);

  const filteredFavorites = favoritesWithPrograms.filter((favorite) =>
    matchesFavorite(favorite, params)
  );

  const sortedFavorites = sortFavorites(filteredFavorites, sort);

  const totalPages = Math.max(Math.ceil(sortedFavorites.length / size), 1);
  const safePage = Math.min(page, totalPages - 1);
  const startIndex = safePage * size;

  const visibleFavorites = sortedFavorites.slice(startIndex, startIndex + size);

  const resultsText =
    filteredFavorites.length === 1
      ? "1 tulemus"
      : `${filteredFavorites.length} tulemust`;

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-3">
            Minu lemmikud
          </h1>

          <p className="max-w-2xl text-base text-gray-600 leading-relaxed">
            Siit leiad programmid, mille oled hilisemaks vaatamiseks või
            võrdlemiseks salvestanud.
          </p>
        </div>

        {favoritesWithPrograms.length > 0 && (
          <>
            <div className="mb-8">
              <FavoriteFilters categories={categories} />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  Salvestatud programmid
                </h2>

                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
                  {resultsText}
                </p>
              </div>

              <Sort />
            </div>
          </>
        )}

        {favoritesWithPrograms.length === 0 ? (
          <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-12 text-center">
            <div className="max-w-xl mx-auto">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                Lemmikuid veel pole
              </h2>

              <p className="text-gray-500 mb-6">
                Kui salvestad mõne programmi lemmikuks, ilmub see siia.
              </p>

              <Link
                href="/programs"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-extrabold text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                Avasta programme
              </Link>
            </div>
          </div>
        ) : visibleFavorites.length === 0 ? (
          <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-10 text-center">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
              Filtritele vastavaid lemmikuid ei leitud
            </h2>

            <p className="text-gray-500 mb-6">
              Proovi otsingut või filtreid muuta, et salvestatud programme
              uuesti näha.
            </p>

            <Link
              href="/favorites"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-extrabold text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              Puhasta filtrid
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-6">
              {visibleFavorites.map((favorite) => (
                <ProgramCard
                  key={favorite.id}
                  program={favorite.program}
                  apiUrl={API_URL}
                  actions={
                    <RemoveFavorites
                      favoriteId={favorite.id}
                      apiUrl={API_URL}
                    />
                  }
                />
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