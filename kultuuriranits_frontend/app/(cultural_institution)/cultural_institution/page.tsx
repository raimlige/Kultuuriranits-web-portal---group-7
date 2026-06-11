'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  MessageSquare,
  BarChart3,
  PlusCircle,
  Search,
  MapPin,
  Clock3,
  Users,
  Pencil,
  EyeOff,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type DashboardTab = 'programs' | 'feedback' | 'statistics';

type Organization = {
  id: number;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  type?: string;
  phone?: string;
  email?: string;
};

type CurrentUser = {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  organization?: Organization | null;
  role?: {
    id: number;
    name: string;
  };
};

type Category = {
  id: number;
  name: string;
};

type InstitutionProgram = {
  id: number;
  title: string;
  description: string;
  pricePerStudent: number;
  durationMinutes: number;
  targetGroup: string;
  minGroupSize: number;
  maxGroupSize: number;
  location: string;
  language: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  imageName: string | null;
  imageType: string | null;
  category: Category | null;
  organization?: Organization | null;
};

type ProgramResponse = {
  content?: InstitutionProgram[];
  totalPages?: number;
};

const API_URL = process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:5050';

const PROGRAMS_PER_PAGE = 4;

export default function CulturalInstitutionDashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('programs');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [programs, setPrograms] = useState<InstitutionProgram[]>([]);
  const [search, setSearch] = useState('');
  const [publishedOnly, setPublishedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboardData() {
      try {
        setLoading(true);
        setErrorMessage('');

        const meResponse = await fetch(`${API_URL}/me`, {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
          signal: controller.signal,
        });

        if (meResponse.status === 401 || meResponse.status === 403) {
          setCurrentUser(null);
          setPrograms([]);
          setErrorMessage('Töölaua vaatamiseks pead olema sisse logitud.');
          return;
        }

        if (!meResponse.ok) {
          throw new Error(`Kasutaja päring ebaõnnestus: ${meResponse.status}`);
        }

        const userData: CurrentUser = await meResponse.json();
        setCurrentUser(userData);

        const organizationId = userData.organization?.id;

        if (!organizationId) {
          setPrograms([]);
          setErrorMessage('Kasutajaga ei ole seotud kultuuriasutust.');
          return;
        }

        const programsResponse = await fetch(
          `${API_URL}/program?page=0&size=200&sort=id,desc`,
          {
            method: 'GET',
            credentials: 'include',
            cache: 'no-store',
            signal: controller.signal,
          }
        );

        if (!programsResponse.ok) {
          throw new Error(
            `Programmide päring ebaõnnestus: ${programsResponse.status}`
          );
        }

        const programsData: ProgramResponse | InstitutionProgram[] =
          await programsResponse.json();

        const allPrograms = Array.isArray(programsData)
          ? programsData
          : programsData.content ?? [];

        const ownPrograms = allPrograms.filter((program) => {
          return program.organization?.id === organizationId;
        });

        setPrograms(ownPrograms);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Töölaua andmete laadimine ebaõnnestus:', error);
          setErrorMessage(error.message);
        }

        setPrograms([]);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      controller.abort();
    };
  }, []);

  const institutionName = currentUser?.organization?.name ?? 'Minu asutus';

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        program.title.toLowerCase().includes(searchValue) ||
        program.description.toLowerCase().includes(searchValue) ||
        program.location.toLowerCase().includes(searchValue) ||
        program.targetGroup.toLowerCase().includes(searchValue);

      const matchesPublished = publishedOnly
        ? program.status?.toLowerCase() === 'active' ||
          program.status?.toLowerCase() === 'published' ||
          program.status?.toLowerCase() === 'avalikustatud'
        : true;

      return matchesSearch && matchesPublished;
    });
  }, [programs, search, publishedOnly]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPrograms.length / PROGRAMS_PER_PAGE)
  );

  const paginatedPrograms = useMemo(() => {
    const start = (currentPage - 1) * PROGRAMS_PER_PAGE;
    const end = start + PROGRAMS_PER_PAGE;

    return filteredPrograms.slice(start, end);
  }, [filteredPrograms, currentPage]);

  const activeProgramsCount = programs.filter((program) => {
    return (
      program.status?.toLowerCase() === 'active' ||
      program.status?.toLowerCase() === 'published' ||
      program.status?.toLowerCase() === 'avalikustatud'
    );
  }).length;

  function goToPreviousPage() {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }

  function goToNextPage() {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between mb-8">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wider text-blue-700 mb-2">
              Kultuuriasutuse töölaud
            </p>

            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              {institutionName}
            </h1>

            <p className="mt-3 text-gray-600 max-w-2xl">
              Siin saad hallata oma kultuuriasutuse programme, vaadata
              tagasisidet ja jälgida statistikat.
            </p>
          </div>

          <div className="flex items-center">
            <span className="inline-flex items-center rounded-full bg-white border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 mr-2" />
              Kultuuriasutuse vaade
            </span>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-8">
          <div className="flex flex-wrap items-center gap-2 md:gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('programs')}
              className={`inline-flex items-center gap-2 px-1 py-4 text-sm font-bold border-b-2 transition ${
                activeTab === 'programs'
                  ? 'text-blue-700 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Programmid
              <span className="inline-flex items-center justify-center min-w-6 h-6 rounded-full bg-gray-100 px-2 text-xs text-gray-600">
                {programs.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('feedback')}
              className={`inline-flex items-center gap-2 px-1 py-4 text-sm font-bold border-b-2 transition ${
                activeTab === 'feedback'
                  ? 'text-blue-700 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Tagasiside
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('statistics')}
              className={`inline-flex items-center gap-2 px-1 py-4 text-sm font-bold border-b-2 transition ${
                activeTab === 'statistics'
                  ? 'text-blue-700 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Statistika
            </button>

            <Link
              href="/addPrograms"
              className="inline-flex items-center gap-2 px-1 py-4 text-sm font-bold text-gray-500 border-b-2 border-transparent hover:text-gray-800"
            >
              <PlusCircle className="w-4 h-4" />
              Lisa uus programm
            </Link>
          </div>
        </div>

        {activeTab === 'programs' && (
          <>
            <div className="rounded-3xl bg-white border border-gray-200 p-4 md:p-5 shadow-sm mb-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col md:flex-row gap-4 md:items-center w-full lg:max-w-3xl">
                  <div className="relative flex-1">
                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

                    <input
                      type="text"
                      placeholder="Otsi..."
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                    />
                  </div>

                  <label className="inline-flex items-center gap-3 text-sm font-semibold text-gray-700 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={publishedOnly}
                      onChange={(event) => {
                        setPublishedOnly(event.target.checked);
                        setCurrentPage(1);
                      }}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                    Avalikustatud
                  </label>
                </div>

                <Link
                  href="/addPrograms"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 transition shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  Lisa uus programm
                </Link>
              </div>
            </div>

            {loading && (
              <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-12 text-center text-gray-500 font-medium">
                Laetakse programme...
              </div>
            )}

            {!loading && errorMessage && (
              <div className="rounded-3xl bg-white border border-red-100 shadow-sm p-8 mb-6">
                <h2 className="text-xl font-extrabold text-gray-900 mb-2">
                  Programme ei saanud laadida
                </h2>
                <p className="text-red-600 text-sm">{errorMessage}</p>
              </div>
            )}

            {!loading && !errorMessage && paginatedPrograms.length === 0 && (
              <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-12 text-center">
                <div className="max-w-xl mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-5">
                    <BookOpen className="w-8 h-8" />
                  </div>

                  <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                    Programme ei ole veel kuvada
                  </h2>

                  <p className="text-gray-500 mb-6">
                    Selle kultuuriasutusega seotud programme ei leitud või need
                    ei vasta filtritele.
                  </p>

                  <Link
                    href="/addPrograms"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Lisa esimene programm
                  </Link>
                </div>
              </div>
            )}

            {!loading && paginatedPrograms.length > 0 && (
              <div className="space-y-5">
                {paginatedPrograms.map((program) => {
                  const isPublished =
                    program.status?.toLowerCase() === 'active' ||
                    program.status?.toLowerCase() === 'published' ||
                    program.status?.toLowerCase() === 'avalikustatud';

                  return (
                    <article
                      key={program.id}
                      className="rounded-3xl bg-white border border-gray-300 shadow-sm overflow-hidden"
                    >
                      <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-[320px] xl:w-[340px] h-[220px] lg:h-auto bg-gray-100 overflow-hidden">
                          {program.imageName ? (
                            <img
                              src={`${API_URL}/program/${program.id}/image`}
                              alt={program.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium">
                              Pilt puudub
                            </div>
                          )}
                        </div>

                        <div className="flex-1 p-6">
                          <div className="flex flex-col gap-4 h-full">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                                      isPublished
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}
                                  >
                                    {isPublished
                                      ? 'Avalikustatud'
                                      : program.status || 'Staatus puudub'}
                                  </span>
                                </div>

                                <h3 className="text-2xl font-extrabold text-gray-900 mb-4">
                                  {program.title}
                                </h3>
                              </div>

                              <div className="self-start rounded-xl bg-blue-50 px-4 py-2 text-blue-700 font-extrabold text-sm">
                                {program.pricePerStudent}€
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 text-sm">
                              <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2">
                                <span className="font-bold uppercase tracking-wide text-gray-400 text-xs">
                                  Lühikirjeldus:
                                </span>
                                <p className="text-gray-700 line-clamp-2">
                                  {program.description || '—'}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2">
                                <span className="font-bold uppercase tracking-wide text-gray-400 text-xs">
                                  Teema:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {program.category ? (
                                    <span className="inline-flex rounded-xl border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 bg-white">
                                      {program.category.name}
                                    </span>
                                  ) : (
                                    <span className="text-gray-500">—</span>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2">
                                <span className="font-bold uppercase tracking-wide text-gray-400 text-xs">
                                  Sihtgrupp:
                                </span>
                                <span className="inline-flex w-fit rounded-xl bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                  {program.targetGroup || '—'}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2">
                                <span className="font-bold uppercase tracking-wide text-gray-400 text-xs">
                                  Toimumiskoht:
                                </span>
                                <div className="flex items-center gap-2 text-gray-700">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span>{program.location || '—'}</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-auto pt-5 border-t border-gray-100 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                              <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
                                <div className="inline-flex items-center gap-2">
                                  <Clock3 className="w-4 h-4" />
                                  <span>{program.durationMinutes} min</span>
                                </div>

                                <div className="inline-flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  <span>
                                    {program.minGroupSize} -{' '}
                                    {program.maxGroupSize} õpilast
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-3">
                                <Link
                                  href={`/programs/${program.id}/edit`}
                                  className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
                                >
                                  <Pencil className="w-4 h-4" />
                                  Muuda
                                </Link>

                                <button
                                  type="button"
                                  className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
                                >
                                  <EyeOff className="w-4 h-4" />
                                  Muuda mitteavalikuks
                                </button>

                                <button
                                  type="button"
                                  className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Kustuta
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {!loading && filteredPrograms.length > 0 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                  Leht {currentPage} / {totalPages}
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Eelmine
                  </button>

                  <button
                    type="button"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Järgmine
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'feedback' && (
          <section className="rounded-3xl bg-white border border-gray-200 shadow-sm p-10">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                Tagasiside
              </h2>

              <p className="text-gray-500">
                Siia saab hiljem kuvada kultuuriasutuse programmide kohta
                jäetud tagasiside, hinnangud ja kommentaarid.
              </p>
            </div>
          </section>
        )}

        {activeTab === 'statistics' && (
          <section className="space-y-6">
            <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-8">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                Statistika
              </h2>

              <p className="text-gray-500">
                Statistika põhineb hetkel laaditud kultuuriasutuse programmidel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="rounded-3xl border border-gray-200 bg-white p-8 min-h-[180px]">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                  Programme kokku
                </p>
                <p className="mt-5 text-5xl font-extrabold text-gray-900">
                  {programs.length}
                </p>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-8 min-h-[180px]">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                  Avalikustatud
                </p>
                <p className="mt-5 text-5xl font-extrabold text-gray-900">
                  {activeProgramsCount}
                </p>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-8 min-h-[180px]">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                  Keskmine hind
                </p>
                <p className="mt-5 text-5xl font-extrabold text-gray-900">
                  {programs.length > 0
                    ? `${Math.round(
                        programs.reduce(
                          (sum, program) =>
                            sum + Number(program.pricePerStudent || 0),
                          0
                        ) / programs.length
                      )}€`
                    : '—'}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 min-h-[260px] flex items-center justify-center text-center">
              <div>
                <BarChart3 className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                  Graafikute ala
                </h3>
                <p className="text-gray-500 max-w-md">
                  Siia saab hiljem lisada näiteks vaatamiste, osalejate või
                  tagasiside graafikud.
                </p>
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}