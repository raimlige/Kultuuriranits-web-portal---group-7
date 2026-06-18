import { Program } from "../../models/Program";
import { SearchBar } from "../../components/SearchBar";
import { Pagination } from "../../components/Pagination";
import { Sort } from "../../components/Sort";
import { Category } from "../../models/Category";
import { AdvancedFilters } from "../../components/AdvancedFilter";
import { Organization } from "../../models/Organization";
import { TeacherProgramActions } from "../../components/TeacherProgramActions";
import { ProgramCard } from "../../components/ProgramCard";
import { getCurrentUser } from "../lib/auth";
import { getUserFavorites } from "../lib/favorites";

const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

interface FetchResult {
  content: Program[];
  totalPages: number;
}

interface SearchParams {
  keyword?: string;
  page?: string;
  sort?: string;
  size?: string;
  categoryId?: string;
  organizationId?: string;
  targetGroups?: string;
  date?: string;
  county?: string;
  location?: string;
  status?: string;
  duration?: string;
  minDurationMinutes?: string;
  maxDurationMinutes?: string;
  minGroupSize?: string;
  maxGroupSize?: string;
  languages?: string;
  wheelchair?: string;
  hev?: string;
  minPricePerStudent?: string;
  maxPricePerStudent?: string;
  outdoor?: string;
  lak?: string;
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/category`, { cache: "no-store" });
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Viga kategooriate pärimisel backendist:", error);
    return [];
  }
}

async function getOrganizations(): Promise<Organization[]> {
  try {
    const res = await fetch(`${API_URL}/organization`, { cache: "no-store" });
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Viga organisatsioonide pärimisel backendist:", error);
    return [];
  }
}

async function getPrograms(
  keyword?: string,
  page = 0,
  sort = "id,asc",
  size = 3,
  categoryId?: string,
  organizationId?: string,
  targetGroup?: string,
  date?: string,
  county?: string,
  location?: string,
  status?: string,
  //averageRating?: string,
  duration?: string,
  minDurationMinutes?: string,
  maxDurationMinutes?: string,
  minGroupSize?: string,
  maxGroupSize?: string,
  languages?: string,
  wheelchair?: string,
  specialNeeds?: string,
  minPricePerStudent?: string,
  maxPricePerStudent?: string,
  outdoor?: string,
  lak?: string
): Promise<FetchResult> {
  try {
    const baseUrl = `${API_URL}/program/searchall`;
    const params = new URLSearchParams({ page: String(page), size: String(size), sort });

    if (keyword) params.set("keyword", keyword);
    if (categoryId) params.set("categoryId", categoryId);
    if (organizationId) params.set("organizationId", organizationId);
    if (targetGroup) params.set("targetGroups", targetGroup);
    if (date) params.set("date", date);
    if (county) params.set("county", county);
    if (location) params.set("location", location);
    if (status) params.set("status", status);
    if (duration) params.set("durationMinutes", duration);
    if (minDurationMinutes) params.set("minDurationMinutes", minDurationMinutes);
    if (maxDurationMinutes) params.set("maxDurationMinutes", maxDurationMinutes);
    if (minGroupSize) params.set("minGroupSize", minGroupSize);
    if (maxGroupSize) params.set("maxGroupSize", maxGroupSize);
    if (languages) {
      languages
        .split(",")
        .map(l => l.trim())
        .filter(Boolean)
        .forEach(l => params.append("languages", l));
    }
    if (wheelchair) params.set("wheelchair", wheelchair);
    if (specialNeeds) params.set("hev", specialNeeds);
    if (minPricePerStudent) params.set("minPricePerStudent", minPricePerStudent);
    if (maxPricePerStudent) params.set("maxPricePerStudent", maxPricePerStudent);
    if (outdoor) params.set("outdoor", outdoor);
    if (lak) params.set("lak", lak);

    const res = await fetch(`${baseUrl}?${params.toString()}`, { cache: "no-store" });

    if (!res.ok) {
      console.log(`${baseUrl}?${params.toString()}`)
      console.error(`Backend tagastas vea staatuse: ${res.status}`);
      return { content: [], totalPages: 1 };
    }
    console.log(`${baseUrl}?${params.toString()}`);
    const data = await res.json();
    console.log(data);
    return { content: data.content ?? [], totalPages: data.totalPages ?? 1 };
  } catch (error) {
    console.error("Ei saanud Spring Boot backendiga ühendust (getPrograms):", error);
    return { content: [], totalPages: 1 };
  }
}

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const keyword = params.keyword;
  const page = Number(params.page) || 0;
  const sort = params.sort || "id,desc";
  const size = Number(params.size) || 3;
  const categoryId = params.categoryId;
  const organizationId = params.organizationId;
  const targetGroup = params.targetGroups;
  const date = params.date;
  const county = params.county;
  const location = params.location;
  const status = params.status;
  const duration = params.duration;
  const minDurationMinutes = params.minDurationMinutes;
  const maxDurationMinutes = params.maxDurationMinutes;
  const minGroupSize = params.minGroupSize;
  const maxGroupSize = params.maxGroupSize;
  const languages = params.languages;
  const wheelchair = params.wheelchair;
  const specialNeeds = params.hev;
  const minPricePerStudent = params.minPricePerStudent;
  const maxPricePerStudent = params.maxPricePerStudent;
  const outdoor = params.outdoor;
  const lak = params.lak;

  const [programData, categories, organizations, currentUser] = await Promise.all([
    getPrograms(
      keyword, page, sort, size, categoryId, organizationId, targetGroup,
      date, county, location, status, duration, minDurationMinutes, maxDurationMinutes,
      minGroupSize, maxGroupSize, languages, wheelchair, specialNeeds,
      minPricePerStudent, maxPricePerStudent, outdoor, lak
    ),
    getCategories(),
    getOrganizations(),
    getCurrentUser(),
  ]);

  const isTeacher = currentUser?.role?.name === "TEACHER";
  const userFavorites = isTeacher ? await getUserFavorites() : [];
  const activePrograms = programData.content.filter(
    (p) => p.status === "Active" || p.status === "ACTIVE"
  );

  const { content: programs, totalPages } = programData;
  const resultsText =
    programs.length === 1 ? "1 tulemus" : `${programs.length} tulemust`;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="text-center max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
          Leia klassile{" "}
          <span className="text-blue-600">sobivaim</span>{" "}
          kultuuriprogramm
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Tutvu programmidega ning vali klassile sobivaim õppekäik.
        </p>
      </section>

      <section className="max-w-4xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-start">
          <div className="w-full">
            <SearchBar />
          </div>

          <AdvancedFilters
            categories={categories}
            organizations={organizations}
          />
        </div>
      </section>

      <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Kõik programmid
          </h2>

          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{resultsText}</p>
        </div>

        <Sort />
      </section>

      {programs.length === 0 ? (
        <div className="p-8 bg-gray-50 border border-gray-100 rounded-2xl text-gray-600 text-center">
          Sinu otsingule vastavaid kultuuriprogramme ei leitud.
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-8">
            {activePrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                apiUrl={API_URL}
                actions={
                  isTeacher && currentUser ? (
                    <TeacherProgramActions
                      programId={program.id}
                      personId={currentUser.id}
                      favorites={userFavorites}
                      apiUrl={API_URL}
                    />
                  ) : undefined
                }
              />
            ))}
          </div>

          <div className="mt-12">
            <Pagination page={page} totalPages={totalPages} />
          </div>
        </>
      )}
    </main>
  );
}