import getProgram from "@/app/lib/program";
import { cookies } from "next/headers";
import { Feedback } from "../../../../models/Feedback";
import { AddFeedback } from "../../../../components/AddFeedback";
import { RemoveFeedback } from "../../../../components/RemoveFeedback";

const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

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

async function getUserFeedback(): Promise<Feedback[]> {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const res = await fetch(`${API_URL}/feedback`, {
      headers: {
        Cookie: cookieString,
      },
      cache: "no-store",
    });

    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Viga kasutaja tagasiside pärimisel:", error);
    return [];
  }
}




export default async function ProgramPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const program = await getProgram(id);
  console.log("Programmi andmed detailvaates:", program);

  console.log(console.log("params:", id));

  if (!program) {
    return <div>Programmi ei leitud.</div>;
  }

  const details = [
    ["Korraldaja", program.organization?.name ?? "Teadmata organisatsioon"],
    ["Hind", `${program.pricePerStudent}€`],
    ["Kestus", `${program.durationMinutes} min`],
    ["Asukoht", program.location],
    ["Keel", program.language],
    ["Sihtgrupp", program.targetGroup],
    ["Grupi suurus", `${program.minGroupSize} - ${program.maxGroupSize}`],
    ["Staatus", program.status],
  ];

  const [currentUser, userFeedback] = await Promise.all([
    getCurrentUser(),
    getUserFeedback()
  ]);

  const currentUserId = currentUser ? currentUser.id : null;

  return (
    <div>
      <div
        key={program.id}
        style={{
          border: "1px solid gray",
          padding: "16px",
          borderRadius: "8px",
        }}
      >
        <h2>{program.title}</h2>
        <p><strong>Korraldaja:</strong> {program.organization?.name ?? "Teadmata organisatsioon"}</p>
        <img
          src={`${API_URL}/program/${program.id}/image`}
          alt={program.title}
          style={{
            width: "100%",
            height: "250px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "12px",
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
              fontWeight: "bold",
            }}
          >
            {program.category.name ?? `Kategooria ${program.category.id}`}
          </span>
        )}

        <p>{program.description}</p>

        {details.map(([label, value]) => (
          <p key={label}>
            <strong>{label}:</strong> {value}
          </p>
        ))}

        {/* Tagasiside */}
        {currentUserId ? (
          (() => {
            const feedbackRelation = userFeedback.find(
              (fb) => fb.program && fb.program.id === program.id
            );

            if (feedbackRelation) {
              return (
                <RemoveFeedback feedbackId={feedbackRelation.id} apiUrl={API_URL} />);
            } else {
              return (
                <AddFeedback programId={program.id} personId={currentUserId} apiUrl={API_URL} />);
            }
          })()
        ) : (
          <p style={{ color: "gray", fontSize: "14px" }}>Logi sisse, et lisada lemmikutesse</p>
        )}
      </div>
    </div>
  );
}
