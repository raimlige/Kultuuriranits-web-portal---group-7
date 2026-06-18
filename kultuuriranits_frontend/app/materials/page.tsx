import { cookies } from "next/headers";
import { Material } from "@/models/Material";
import MaterialList from "@/components/MaterialList";
import { MaterialSearchControls } from "@/components/MaterialSearchControls";
import { Pagination } from "@/components/Pagination";

const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

type SearchParamValue = string | string[] | undefined;

interface SearchParams {
  keyword?: SearchParamValue;
  page?: SearchParamValue;
  size?: SearchParamValue;
}

interface User {
  id: number;
  role?:
    | string
    | {
        id?: number;
        name?: string;
      };
}

async function getCookieString() {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

function extractArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (
    data &&
    typeof data === "object" &&
    "content" in data &&
    Array.isArray((data as { content?: unknown }).content)
  ) {
    return (data as { content: T[] }).content;
  }

  if (
    data &&
    typeof data === "object" &&
    "data" in data &&
    Array.isArray((data as { data?: unknown }).data)
  ) {
    return (data as { data: T[] }).data;
  }

  return [];
}

async function getMaterials(): Promise<Material[]> {
  try {
    const cookieString = await getCookieString();

    const res = await fetch(`${API_URL}/material`, {
      headers: {
        Cookie: cookieString,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();

    return extractArray<Material>(data);
  } catch (error) {
    console.error("Viga õppematerjalide pärimisel:", error);
    return [];
  }
}

async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieString = await getCookieString();

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

function firstParam(value: SearchParamValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function getRoleName(user: User | null): string | undefined {
  if (!user?.role) return undefined;

  return typeof user.role === "string" ? user.role : user.role.name;
}

function normalize(value?: string | number | null): string {
  return String(value ?? "").trim().toLowerCase();
}

function includesText(value: string | number | null | undefined, keyword: string) {
  return normalize(value).includes(keyword);
}

function matchesMaterial(material: Material, keyword: string): boolean {
  if (!keyword) return true;

  return [
    material.title,
    material.name,
    material.fileType,
    material.program?.title,
    material.program?.category?.name,
    material.program?.organization?.name,
  ].some((value) => includesText(value, keyword));
}

export default async function MaterialsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const [currentUser, materials] = await Promise.all([
    getCurrentUser(),
    getMaterials(),
  ]);

  const isAdmin = getRoleName(currentUser) === "ADMIN";

  const keyword = normalize(firstParam(params.keyword));
  const page = Math.max(Number(firstParam(params.page)) || 0, 0);
  const size = Math.max(Number(firstParam(params.size)) || 6, 1);

  const filteredMaterials = materials.filter((material) =>
    matchesMaterial(material, keyword)
  );

  const totalPages = Math.max(Math.ceil(filteredMaterials.length / size), 1);
  const safePage = Math.min(page, totalPages - 1);
  const startIndex = safePage * size;

  const visibleMaterials = filteredMaterials.slice(
    startIndex,
    startIndex + size
  );

  const resultsText =
    filteredMaterials.length === 1
      ? "1 õppematerjal"
      : `${filteredMaterials.length} õppematerjali`;

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-10">
                  <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
                      Õppematerjalid
                  </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Leia kultuuriprogrammidega seotud õppematerjale, mida kasutada enne
            või pärast õppekäiku.
          </p>
        </div>

        <div className="mb-8">
          <MaterialSearchControls />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Kõik õppematerjalid
            </h2>

            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
              {resultsText}
            </p>
          </div>
        </div>

        {filteredMaterials.length === 0 ? (
          <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-12 text-center">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
              Õppematerjale ei leitud
            </h2>

            <p className="text-gray-500">
              Proovi otsingusõna muuta või otsing puhastada.
            </p>
          </div>
        ) : (
          <>
            <MaterialList
              initialMaterials={visibleMaterials}
              isAdmin={isAdmin}
            />

            {totalPages > 1 && (
              <div className="mt-10">
                <Pagination page={safePage} totalPages={totalPages} />
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}