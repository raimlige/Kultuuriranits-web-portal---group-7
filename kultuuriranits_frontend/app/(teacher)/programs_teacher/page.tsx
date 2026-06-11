import { Program } from "../../../models/Program";
import { SearchBar } from "../../../components/SearchBar";
import { Pagination } from "../../../components/Pagination";
import { Sort } from "../../../components/Sort";
import { CategoryFilter } from "../../../components/CategoryFilter";
import { Category } from "../../../models/Category";
import { AddFavorites } from "../../../components/AddFavorites";
import { cookies } from "next/headers";
import { Favorites } from "../../../models/Favorites";
import { RemoveFavorites } from "../../../components/RemoveFavorites";
import Link from "next/link";

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
}

// kasutaja tuvastamine
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

        if (res.ok) {
            return await res.json();
        }
        return null;
    } catch (error) {
        console.error("Viga sisselogitud kasutaja tuvastamisel:", error);
        return null;
    }
}

async function getUserFavorites(): Promise<Favorites[]> {
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
        console.error("Viga kasutaja lemmikute pärimisel:", error);
        return [];
    }
}

// GET category
async function getCategories(): Promise<Category[]> {
    try {
        const res = await fetch(`${API_URL}/category`, {
            cache: "no-store"
        });
        return res.ok ? await res.json() : [];
    } catch (error) {
        console.error("Viga kategooriate pärimisel backendist:", error);
        return [];
    }
}

// GET programs (või search)
async function getPrograms(
    keyword?: string,
    page = 0,
    sort = "id,asc",
    size = 3,
    categoryId?: string,
): Promise<FetchResult> {
    try {
        const baseUrl = `${API_URL}/program${keyword ? "/search" : ""}`;

        const params = new URLSearchParams({
            page: String(page),
            size: String(size),
            sort
        });

        if (keyword) params.set("keyword", keyword);
        if (categoryId) params.set("categoryId", categoryId);

        const res = await fetch(
            `${baseUrl}?${params.toString()}`,
            { cache: "no-store" }
        );

        if (!res.ok) {
            console.error(`Backend tagastas vea staatuse: ${res.status}`);
            return { content: [], totalPages: 1 };
        }

        const data = await res.json();

        return {
            content: data.content ?? [],
            totalPages: data.totalPages ?? 1
        };
    } catch (error) {
        console.error("Ei saanud Spring Boot backendiga ühendust (getPrograms):", error);
        return { content: [], totalPages: 1 };
    }
}

export default async function ProgramsPage({
    searchParams
}: {
    searchParams: Promise<SearchParams>;
}) {
    const params = await searchParams;

    const keyword = params.keyword;
    const page = Number(params.page) || 0;
    const sort = params.sort || "id,desc";
    const size = Number(params.size) || 3;
    const categoryId = params.categoryId;
    const [programData, categories, currentUser, userFavorites] = await Promise.all([
        getPrograms(keyword, page, sort, size, categoryId),
        getCategories(),
        getCurrentUser(),
        getUserFavorites()
    ]);

    const { content: programs, totalPages } = programData;
    const currentUserId = currentUser ? currentUser.id : null;
    return (
        <main
            style={{
                padding: "20px",
                maxWidth: "800px",
                margin: "0 auto"
            }}
        >
            <h1>Programmid</h1>

            {/* Otsing + sorteerimine + filter */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginBottom: "20px"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                        alignItems: "center"
                    }}
                >
                    <div style={{ flex: 1, minWidth: "200px" }}>
                        <SearchBar />
                    </div>
                    <Sort />
                </div>

                <CategoryFilter
                    categories={categories}
                    currentCategoryId={categoryId}
                />
            </div>

            {/* Tulemused */}
            {programs.length === 0 ? (
                <p style={{ padding: "20px", background: "#f5f5f5", borderRadius: "5px" }}>
                    Andmeid ei õnnestunud laadida või ühtegi programmi ei leitud. Veendu, et andmebaas ja backend töötavad.
                </p>
            ) : (
                <>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px"
                        }}
                    >
                        {programs.map((program) => {
                            const details = [
                                ["Korraldaja", program.organization?.name ?? "Teadmata organisatsioon"],
                                ["Hind", `${program.pricePerStudent}€`],
                                ["Kestus", `${program.durationMinutes} min`],
                                ["Asukoht", program.location],
                                ["Keel", program.language],
                                ["Sihtgrupp", program.targetGroup],
                                [
                                    "Grupi suurus",
                                    `${program.minGroupSize} - ${program.maxGroupSize}`
                                ],
                                ["Staatus", program.status]
                            ];
                            return (
                                <div
                                    key={program.id}
                                    style={{
                                        border: "1px solid gray",
                                        padding: "16px",
                                        borderRadius: "8px"
                                    }}
                                >
                                    <h2>{program.title}</h2>
                                    {/* Lemmiku nupp  */}
                                    {currentUserId ? (
                                        (() => {
                                            const favoriteRelation = userFavorites.find(
                                                (fav) => fav.program && fav.program.id === program.id
                                            );

                                            if (favoriteRelation) {
                                                return (
                                                    <RemoveFavorites favoriteId={favoriteRelation.id} apiUrl={API_URL} />);
                                            } else {
                                                return (
                                                    <AddFavorites programId={program.id} personId={currentUserId} apiUrl={API_URL} />);
                                            }
                                        })()
                                    ) : (
                                        <p style={{ color: "gray", fontSize: "14px" }}>Logi sisse, et lisada lemmikutesse</p>
                                    )}
                                    <img
                                        src={`${API_URL}/program/${program.id}/image`}
                                        alt={program.title}
                                        style={{
                                            width: "100%",
                                            height: "250px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            marginBottom: "12px"
                                        }}
                                    />

                                    {program.category && (
                                        <span
                                            style={{
                                                display: "inline-block",
                                                backgroundColor: "#e0e0e0",
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                fontSize: "12px",
                                                marginBottom: "10px",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {program.category.name ?? `Kategooria ${program.category.id}`}
                                        </span>
                                    )}

                                    <p>{program.description}</p>

                                    <Link href={`/programs/${program.id}`}>Detailvaade</Link>

                                    {details.map(([label, value]) => (
                                        <p key={label}>
                                            <strong>{label}:</strong> {value}
                                        </p>
                                    ))}
                                </div>
                            );
                        })}
                    </div>

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                    />
                </>
            )}
        </main>
    );
}