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

  const [currentUser, allFeedback] = await Promise.all([
    getCurrentUser(),
    getUserFeedback()
  ]);

  const currentUserId = currentUser ? currentUser.id : null;

  const userFeedbackForThisProgram = allFeedback.find(
    (fb) => {
      const feedbackUserId = fb.person?.id;
      return fb.program && fb.program.id === program.id && feedbackUserId === currentUserId;
    }
  );

  const allFeedbackForThisProgram = allFeedback.filter(
    (fb) => fb.program && fb.program.id === program.id
  );

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <div
        key={program.id}
        style={{
          border: "1px solid #e0e0e0",
          padding: "24px",
          borderRadius: "12px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
        }}
      >
        <h2>{program.title}</h2>
        <p><strong>Korraldaja:</strong> {program.organization?.name ?? "Teadmata organisatsioon"}</p>
        <img
          src={`${API_URL}/program/${program.id}/image`}
          alt={program.title}
          style={{
            width: "100%",
            height: "300px",
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

        {/* Tagasiside lisamise/eemaldamise nupp sisseloginud kasutajale */}
        <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
          {currentUserId ? (
            userFeedbackForThisProgram ? (
              <RemoveFeedback feedbackId={userFeedbackForThisProgram.id} apiUrl={API_URL} />
            ) : (
              <AddFeedback programId={program.id} personId={currentUserId} apiUrl={API_URL} />
            )
          ) : (
            <p style={{ color: "gray", fontSize: "14px" }}>Logi sisse, et lisada tagasisidet või lemmikutesse</p>
          )}
        </div>
      </div>

      {/* PROGRAMMI FEEDBACKID */}
      <div style={{ marginTop: "40px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
          Külastajate tagasiside ({allFeedbackForThisProgram.length})
        </h3>

        {allFeedbackForThisProgram.length === 0 ? (
          <p style={{ color: "gray", fontStyle: "italic" }}>Sellele programmile pole veel tagasisidet jäetud.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {allFeedbackForThisProgram.map((fb) => (
              <div
                key={fb.id}
                style={{
                  border: "1px solid #eee",
                  padding: "16px",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                    {fb.person?.firstName} {fb.person?.lastName}
                  </span>
                  <span style={{ color: "#ffb100", fontWeight: "bold" }}>
                    {"★".repeat(fb.rating || 0)}{"☆".repeat(5 - (fb.rating || 0))} ({fb.rating}/5)
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "14px", color: "#444", fontStyle: "italic" }}>
                  {`"${fb.text}"`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}